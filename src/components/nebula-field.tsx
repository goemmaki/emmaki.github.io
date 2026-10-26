"use client";

import { useEffect, useRef } from "react";

/*
 * The 404 background, after 21st.dev's "Neon Nebula" ASCII effect (its preview video): a sparse
 * grid of small hollow squares on black, lit by a soft glow that wobbles and drifts, with cells
 * twinkling on and off as a wave passes through them. Recoloured from violet to the site yellow,
 * kept dim. The glow sits left of centre from md (the 404 is in the right-hand column) and above
 * the text on phones. Each 16px cell samples an animated radial gradient at its centre; dim cells
 * are left out, which is what makes it sparse. Film grain, halftone, scan lines and vignette as in
 * the preset. Reduced motion gets one still frame.
 */

const CELL = 16;
// The site yellow at the core, darkening out to near black.
const STOPS: [number, [number, number, number]][] = [
  [0, [0xff, 0xc3, 0x00]],
  [0.3, [0xb3, 0x7a, 0x00]],
  [0.65, [0x4a, 0x2c, 0x00]],
  [1, [0x05, 0x02, 0x00]],
];
// Brightest the core gets: the yellow at this opacity, so it stays a glow and not a floodlight.
const PEAK = 0.75;
// Cells darker than this (after the twinkle) are not drawn.
const THRESHOLD = 0.16;
const GRADIENT = { count: 6, distortion: 0.28, wave: 0.12, motion: 0.86, speed: 0.5 };
// Opaque, so light mode is as black as dark.
const BG = "#000";
const PFX = { halftone: 0.2, scanLines: 0.4, vignette: 0.38, filmGrain: 0.3 };

const smooth = (t: number) => t * t * (3 - 2 * t);

function gradientAt(pos: number): [number, number, number] {
  const p = Math.min(1, Math.max(0, pos));
  const i = STOPS.findIndex(([at]) => at >= p);
  if (i <= 0) return STOPS[0][1];
  const [a, ca] = STOPS[i - 1];
  const [b, cb] = STOPS[i];
  const t = smooth((p - a) / (b - a));
  return [0, 1, 2].map((k) => ca[k] + (cb[k] - ca[k]) * t) as [number, number, number];
}

// Where the glow sits and how far it reaches, in px: left of centre beside the text from md,
// above it on phones.
function glowFor(width: number, height: number) {
  return width >= 768
    ? { x: width * 0.3, y: height * 0.5, radius: Math.min(width * 0.32, height * 0.6) }
    : { x: width * 0.5, y: height * 0.3, radius: Math.min(width * 0.75, height * 0.32) };
}

// Position along the gradient (0 core, 1 edge) for a point in px at time t. The glow drifts in a
// slow loop, and its edge wobbles in six lobes.
function fieldAt(x: number, y: number, glow: ReturnType<typeof glowFor>, t: number) {
  const s = t * GRADIENT.speed;
  const u = (x - glow.x - glow.radius * 0.08 * Math.sin(s * 0.7)) / glow.radius;
  const v = (y - glow.y - glow.radius * 0.06 * Math.cos(s * 0.9)) / glow.radius;
  const angle = Math.atan2(v, u);
  let r = Math.hypot(u, v);
  r *= 1 + GRADIENT.distortion * GRADIENT.motion * 0.35 * Math.sin(GRADIENT.count * angle + s);
  r += GRADIENT.wave * 0.5 * Math.sin(r * 9 - s * 1.5);
  return r;
}

// A per-cell number in 0-1 that stays put, so the twinkle is scattered rather than banded.
function hash(col: number, row: number) {
  const n = Math.sin(col * 127.1 + row * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

function makeCanvas(width: number, height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return [canvas, canvas.getContext("2d")!] as const;
}

// A repeating pattern drawn once.
function pattern(ctx: CanvasRenderingContext2D, size: number, draw: (c: CanvasRenderingContext2D) => void) {
  const [tile, tileCtx] = makeCanvas(size, size);
  draw(tileCtx);
  return ctx.createPattern(tile, "repeat")!;
}

export function NebulaField() {
  const ref = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const overlay = overlayRef.current!;
    const overlayCtx = overlay.getContext("2d")!;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const [grain, grainCtx] = makeCanvas(256, 256);
    const noise = grainCtx.createImageData(256, 256);
    for (let i = 0; i < noise.data.length; i += 4) {
      const n = Math.random() * 255;
      noise.data.set([n, n, n, 255], i);
    }
    grainCtx.putImageData(noise, 0, 0);
    const grainPattern = ctx.createPattern(grain, "repeat")!;

    let width = 0;
    let height = 0;
    let glow = glowFor(0, 0);

    // The field is drawn one canvas pixel per CSS pixel and shown with hard pixel edges. Halftone,
    // scan lines and vignette never change, so they sit on a second canvas drawn only on resize.
    function resize() {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width;
      canvas.height = height;
      glow = glowFor(width, height);

      const dpr = Math.min(devicePixelRatio, 2);
      overlay.width = Math.round(width * dpr);
      overlay.height = Math.round(height * dpr);
      overlayCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      overlayCtx.fillStyle = pattern(overlayCtx, 4, (c) => {
        c.fillStyle = `rgb(0 0 0 / ${PFX.halftone})`;
        c.beginPath();
        c.arc(2, 2, 1, 0, Math.PI * 2);
        c.fill();
      });
      overlayCtx.fillRect(0, 0, width, height);
      overlayCtx.fillStyle = pattern(overlayCtx, 3, (c) => {
        c.fillStyle = `rgb(0 0 0 / ${PFX.scanLines * 0.6})`;
        c.fillRect(0, 2, 3, 1);
      });
      overlayCtx.fillRect(0, 0, width, height);
      const vignette = overlayCtx.createRadialGradient(width / 2, height / 2, Math.min(width, height) * 0.3, width / 2, height / 2, Math.hypot(width, height) / 2);
      vignette.addColorStop(0, "rgb(0 0 0 / 0)");
      vignette.addColorStop(1, `rgb(0 0 0 / ${PFX.vignette * 1.6})`);
      overlayCtx.fillStyle = vignette;
      overlayCtx.fillRect(0, 0, width, height);
    }

    function draw(t: number) {
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, width, height);

      const cols = Math.ceil(width / CELL);
      const rows = Math.ceil(height / CELL);
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const cx = col * CELL + CELL / 2;
          const cy = row * CELL + CELL / 2;
          const pos = fieldAt(cx, cy, glow, t);
          if (pos >= 1) continue;
          const light = 1 - pos;
          // A wave sweeps across the grid; each cell's own phase scatters it into a twinkle.
          const twinkle = 0.6 + 0.4 * Math.sin((col + row) * 0.35 - t * 2 + hash(col, row) * 6.28);
          const level = light * twinkle;
          if (level < THRESHOLD) continue;
          // Hollow squares, 4-7px, bigger and brighter towards the core.
          const size = 4 + Math.round(level * 3);
          const x = Math.round(cx - size / 2);
          const y = Math.round(cy - size / 2);
          const [r, g, b] = gradientAt(pos);
          ctx.fillStyle = `rgb(${r} ${g} ${b} / ${Math.min(1, level * 1.4) * PEAK})`;
          ctx.fillRect(x, y, size, 1);
          ctx.fillRect(x, y + size - 1, size, 1);
          ctx.fillRect(x, y + 1, 1, size - 2);
          ctx.fillRect(x + size - 1, y + 1, 1, size - 2);
        }
      }

      // Film grain: the noise tile at a new offset each frame.
      ctx.globalCompositeOperation = "overlay";
      ctx.globalAlpha = PFX.filmGrain * 0.35;
      ctx.save();
      ctx.translate(-Math.random() * 256, -Math.random() * 256);
      ctx.fillStyle = grainPattern;
      ctx.fillRect(0, 0, width + 256, height + 256);
      ctx.restore();
    }

    // 30 frames a second is plenty for the slow drift, and halves the work on phones.
    let frame = 0;
    let drawn = -Infinity;
    const loop = (ms: number) => {
      if (ms - drawn >= 1000 / 30 - 2) {
        drawn = ms;
        draw(ms / 1000);
      }
      frame = requestAnimationFrame(loop);
    };
    // Resizing a canvas clears it, and the observer runs after the frame's draw but before paint,
    // so redraw at once (at the last frame's time) or the field blanks while the window is dragged.
    const observer = new ResizeObserver(() => {
      resize();
      draw(still ? 0 : Math.max(0, drawn) / 1000);
    });
    observer.observe(canvas);
    resize();
    if (still) draw(0);
    else frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return (
    <div aria-hidden className="fixed inset-0">
      <canvas ref={ref} className="absolute inset-0 size-full [image-rendering:pixelated]" />
      <canvas ref={overlayRef} className="absolute inset-0 size-full" />
    </div>
  );
}
