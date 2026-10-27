"use client";

import { useEffect, useRef } from "react";

/*
 * An image redrawn as dithered characters, after 21st.dev's "Black ascii template" (studied from
 * its preview image; none of its code is used). The picture is averaged down to a grid of cells.
 * An ordered (Bayer) dither decides which cells get a mark, so tone becomes density. Strong edges
 * get a line character along the edge (- | / \), very bright cells a +, the rest a small square.
 * Dark mode draws the picture's own colours on black; light mode draws its shadows in ink on
 * white, like a print. The characters are drawn once (again on resize or a theme change) into an
 * offscreen canvas. Each frame copies it to the screen like a worn VHS tape: now and then a few
 * horizontal bands jump sideways by a pixel or three, rarely a thin band tears further, the
 * brightness flickers a little, and faint scanlines run over it (after 21st.dev's "Fuji" clip).
 * Reduced motion gets the still picture, also when it's switched on mid-visit. If the image fails
 * to load, nothing is drawn.
 */

// The picture's colour, a little dimmed and lifted towards a soft grey (not white) as the cell
// brightens, so highlights glow without glaring.
const lift = (c: number, tone: number) => Math.round(c * 0.9 + (220 - c * 0.9) * tone * 0.3);

// 4x4 Bayer matrix: the thresholds, spread so neighbouring cells differ.
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
// Gradient strength (0-1 luminance per cell) that counts as an edge.
const EDGE = 0.45;
// Luminance mapped to black and to white before dithering: wide in dark mode so the highlights
// ramp up gently, tighter in light mode for a crisp print.
const CONTRAST = { dark: [0.12, 0.92], light: [0.2, 0.8] };
// Frames per second: low, so the judder reads as a tape, not as smooth motion.
const FPS = 12;

export function AsciiImage({
  src,
  width,
  height,
  cols = 150,
  className,
}: {
  src: string;
  width: number;
  height: number;
  /** cells across */
  cols?: number;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const screen = canvas.getContext("2d")!;
    // The finished characters, copied to the screen each frame.
    const art = document.createElement("canvas");
    const ctx = art.getContext("2d")!;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    let still = reduce.matches;
    const image = new Image();
    image.src = src;
    const rows = Math.round((cols * height) / width);
    // The picture averaged down to one pixel per cell.
    let cells: Uint8ClampedArray | null = null;

    function sample() {
      const small = document.createElement("canvas");
      small.width = cols;
      small.height = rows;
      const sctx = small.getContext("2d")!;
      sctx.imageSmoothingQuality = "high";
      sctx.drawImage(image, 0, 0, cols, rows);
      cells = sctx.getImageData(0, 0, cols, rows).data;
    }

    function draw() {
      if (!cells) return;
      const dpr = Math.min(devicePixelRatio, 2);
      const box = canvas.getBoundingClientRect();
      canvas.width = art.width = Math.round(box.width * dpr);
      canvas.height = art.height = Math.round(box.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, box.width, box.height);

      const light = document.documentElement.dataset.theme === "light";
      const [black, white] = CONTRAST[light ? "light" : "dark"];
      const cw = box.width / cols;
      const ch = box.height / rows;
      // Canvas fonts can't read CSS variables, so resolve the site's mono font first.
      const mono = getComputedStyle(canvas).getPropertyValue("--font-mono") || "monospace";
      ctx.font = `${Math.round(ch * 1.05)}px ${mono}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.lineCap = "square";
      ctx.lineWidth = Math.max(1, cw * 0.18);

      const lum = (x: number, y: number) => {
        const i = (Math.min(rows - 1, Math.max(0, y)) * cols + Math.min(cols - 1, Math.max(0, x))) * 4;
        return ((0.2126 * cells![i] + 0.7152 * cells![i + 1] + 0.0722 * cells![i + 2]) / 255) * (cells![i + 3] / 255);
      };

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = (y * cols + x) * 4;
          const alpha = cells[i + 3] / 255;
          if (alpha < 0.5) continue;
          // Stretched so the stone's mid-tones spread across the whole dither range.
          const l = Math.min(1, Math.max(0, (lum(x, y) - black) / (white - black)));
          // Light mode inks the shadows, dark mode lights the highlights.
          const tone = light ? 1 - l : l;
          if (tone <= (BAYER[(y % 4) * 4 + (x % 4)] + 0.5) / 16) continue;

          // Sobel gradient: the edge runs across the direction of steepest change.
          const gx = lum(x + 1, y - 1) + 2 * lum(x + 1, y) + lum(x + 1, y + 1) - lum(x - 1, y - 1) - 2 * lum(x - 1, y) - lum(x - 1, y + 1);
          const gy = lum(x - 1, y + 1) + 2 * lum(x, y + 1) + lum(x + 1, y + 1) - lum(x - 1, y - 1) - 2 * lum(x, y - 1) - lum(x + 1, y - 1);
          const strength = Math.hypot(gx, gy) / 4;

          const colour = light
            ? `rgb(17 17 17 / ${0.55 + 0.45 * tone})`
            : `rgb(${lift(cells[i], tone)} ${lift(cells[i + 1], tone)} ${lift(cells[i + 2], tone)})`;
          ctx.fillStyle = ctx.strokeStyle = colour;
          const cx = x * cw + cw / 2;
          const cy = y * ch + ch / 2;

          if (strength > EDGE) {
            // The edge's angle, folded into 0-180 degrees and snapped to the nearest of four strokes.
            const angle = ((Math.atan2(gy, gx) * 180) / Math.PI + 90 + 360) % 180;
            const glyph = ["-", "\\", "|", "/"][Math.round(angle / 45) % 4];
            ctx.fillText(glyph, cx, cy);
          } else if (tone > 0.97) {
            ctx.fillText("+", cx, cy);
          } else {
            const s = Math.max(1, cw * 0.7);
            ctx.fillRect(cx - s / 2, cy - s / 2, s, s);
          }
        }
      }

      // Scanlines: every third pixel row faded, baked in so they hold still under the judder.
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgb(0 0 0 / 0.35)";
      for (let y = 0; y < box.height; y += 3) ctx.fillRect(0, y, box.width, 1);
      ctx.globalCompositeOperation = "source-over";
      show(false);
    }

    // Copy the art to the screen, juddering when asked.
    function show(judder: boolean) {
      const { width: w, height: h } = canvas;
      screen.clearRect(0, 0, w, h);
      if (!judder) {
        screen.globalAlpha = 1;
        screen.drawImage(art, 0, 0);
        return;
      }
      screen.globalAlpha = 0.92 + Math.random() * 0.08;
      // One pixel of shift per 250px of width, so it looks the same at every size.
      const unit = Math.max(1, w / 250);
      // Each row's sideways shift: mostly none, a few bands off by 1-3 units, rarely a tear.
      const shifts = new Float32Array(h);
      if (Math.random() < 0.3) {
        for (let n = 1 + Math.floor(Math.random() * 3); n > 0; n--) {
          const top = Math.floor(Math.random() * h);
          const tall = Math.floor(h * (0.08 + Math.random() * 0.17));
          const by = Math.round((Math.random() < 0.5 ? -1 : 1) * unit * (1 + Math.random() * 2));
          shifts.fill(by, top, Math.min(h, top + tall));
        }
      }
      if (Math.random() < 0.05) {
        const top = Math.floor(Math.random() * h);
        shifts.fill(Math.round(unit * (6 + Math.random() * 6)), top, Math.min(h, top + Math.floor(h * (0.02 + Math.random() * 0.04))));
      }
      // Draw runs of rows that share a shift as one slice.
      for (let y = 0; y < h; ) {
        let end = y + 1;
        while (end < h && shifts[end] === shifts[y]) end++;
        screen.drawImage(art, 0, y, w, end - y, shifts[y], y, w, end - y);
        y = end;
      }
    }

    let frame = 0;
    let then = 0;
    let visible = false;
    function tick(now: number) {
      frame = requestAnimationFrame(tick);
      if (now - then < 1000 / FPS) return;
      then = now;
      show(true);
    }
    // Runs only while on screen (the browser also pauses it in background tabs) and motion is allowed.
    function play() {
      cancelAnimationFrame(frame);
      if (visible && !still && cells) frame = requestAnimationFrame(tick);
      else if (cells) show(false);
    }
    const seen = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      play();
    });
    const onMotion = () => {
      still = reduce.matches;
      play();
    };
    reduce.addEventListener("change", onMotion);

    image
      .decode()
      .then(() => {
        sample();
        draw();
        play();
      })
      // A missing or broken image leaves the canvas empty; it's decoration.
      .catch(() => {});
    const resize = new ResizeObserver(draw);
    resize.observe(canvas);
    seen.observe(canvas);
    const theme = new MutationObserver(draw);
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      seen.disconnect();
      theme.disconnect();
      reduce.removeEventListener("change", onMotion);
    };
  }, [src, width, height, cols]);

  return <canvas ref={ref} aria-hidden className={className} style={{ aspectRatio: `${width} / ${height}` }} />;
}
