"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import { BRANDS, SERVICES } from "@/lib/content";

// Temporary project data, not case-study claims. Brand names/colors remain owned by BRANDS.
const PROJECTS = [
  { client: "Harvard University", project: "Placeholder 01", work: SERVICES[0], companion: "#E39380", darkInk: "#BE3D50", lightCompanion: "#AD6250" },
  { client: "Quartile", project: "Placeholder 02", work: SERVICES[1], companion: "#C35A32", lightInk: "#B86D00" },
  { client: "Accredible", project: "Placeholder 03", work: SERVICES[4], companion: "#8D9FDC", lightCompanion: "#6274AE" },
  { client: "Fiverr", project: "Placeholder 04", work: "AI automation", companion: "#247C88", lightInk: "#168852" },
  { client: "TV Tropes", project: "Placeholder 05", work: SERVICES[3], companion: "#78ABB5", lightCompanion: "#467D88" },
  { client: "Spectral Core", project: "Placeholder 06", work: "AI automation", companion: "#526AB6", lightInk: "#10899F" },
].map(({ client, ...project }) => {
  const brand = BRANDS.find((brand) => brand.name === client);
  if (!brand?.color) throw new Error(`Proof project needs a brand color: ${client}`);
  return { ...project, brand };
});

const FINE_POINTER = "(hover: hover) and (pointer: fine)";
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

// The dot screen behind a hovered row, after shortscut.com's work list: a fine grid of dots, like
// newsprint, swelling around the pointer. Pitch and radii in CSS pixels.
const PITCH = 6;

type Point = { x: number; y: number };

function dotRadius(x: number, y: number, at: Point) {
  return 0.35 + 1.9 * Math.max(0, 1 - Math.hypot(x - at.x, y - at.y) / 220);
}

// Draws only for the active row and stops on leave; reduced motion draws a single, still frame.
function DotScreen({ on, pointer }: { on: boolean; pointer: RefObject<Point> }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const row = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!on || !canvas || !row || !ctx) return;
    const motion = matchMedia(REDUCED_MOTION);
    const box = row.getBoundingClientRect();
    const ratio = Math.min(devicePixelRatio || 1, 2);
    const w = box.width;
    const h = box.height;
    canvas.width = Math.round(w * ratio);
    canvas.height = Math.round(h * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.fillStyle = getComputedStyle(canvas).color;
    // Keyboard focus has no pointer: start from the row's middle.
    const inside = (p: Point) => p.x >= box.left && p.x <= box.right && p.y >= box.top && p.y <= box.bottom;
    const local = () => inside(pointer.current)
      ? { x: pointer.current.x - box.left, y: pointer.current.y - box.top }
      : { x: w / 2, y: h / 2 };
    const at = local();
    let frame = 0;

    function drawDotScreen() {
      const target = local();
      at.x += (target.x - at.x) * 0.2;
      at.y += (target.y - at.y) * 0.2;
      ctx!.clearRect(0, 0, w, h);
      ctx!.beginPath();
      for (let y = PITCH / 2; y < h; y += PITCH) {
        for (let x = PITCH / 2; x < w; x += PITCH) {
          const r = dotRadius(x, y, at);
          if (r < 0.1) continue;
          ctx!.moveTo(x + r, y);
          ctx!.arc(x, y, r, 0, Math.PI * 2);
        }
      }
      ctx!.fill();
      if (!motion.matches && !document.hidden) frame = requestAnimationFrame(drawDotScreen);
    }

    const stop = () => cancelAnimationFrame(frame);
    const sync = () => {
      stop();
      if (!document.hidden) frame = requestAnimationFrame(drawDotScreen);
    };
    sync();
    document.addEventListener("visibilitychange", sync);
    motion.addEventListener("change", sync);
    // The last frame stays on the canvas while it fades out.
    return () => {
      stop();
      document.removeEventListener("visibilitychange", sync);
      motion.removeEventListener("change", sync);
    };
  }, [on, pointer]);

  return <canvas ref={ref} className="proof-screen" aria-hidden />;
}

export function ProofIndex() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [focused, setFocused] = useState<number | null>(null);
  const names = useRef<(HTMLSpanElement | null)[]>([]);
  const pointer = useRef<Point>({ x: -1, y: -1 });
  const active = hovered ?? focused;

  useEffect(() => {
    if (active === null) return;
    const name = names.current[active];
    if (!name) return;
    const motion = matchMedia(REDUCED_MOTION);
    const pointer = matchMedia(FINE_POINTER);
    // A single 96×64 tile, independent of DPR and text size. No full-window canvas or image assets.
    const tile = document.createElement("canvas");
    tile.width = 96;
    tile.height = 64;
    const ctx = tile.getContext("2d");
    if (!ctx) return; // Real text and the CSS gradient remain available without canvas.
    const pixels = ctx.createImageData(tile.width, tile.height);
    let frame = 0;
    let last = -Infinity;
    function drawProofGrain(time: number) {
      // 20 texture updates per second; no React renders in the animation loop.
      if (time - last >= 50) {
        last = time;
        for (let i = 0; i < pixels.data.length; i += 4) {
          const gray = Math.floor(Math.random() * 256);
          pixels.data[i] = pixels.data[i + 1] = pixels.data[i + 2] = gray;
          pixels.data[i + 3] = 64;
        }
        ctx!.putImageData(pixels, 0, 0);
        name!.style.setProperty("--proof-noise", `url("${tile.toDataURL()}")`);
        name!.style.backgroundPosition = `0 0, ${50 + Math.sin(time / 1600) * 45}% 50%`;
      }
      frame = requestAnimationFrame(drawProofGrain);
    }
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      // Keep the last texture and gradient position for the short leaving fade.
    };
    const sync = () => {
      stop();
      // Focus works on keyboards even when no mouse is present.
      if (!document.hidden && !motion.matches && (hovered === null || pointer.matches)) {
        last = -Infinity;
        frame = requestAnimationFrame(drawProofGrain);
      }
    };
    sync();
    document.addEventListener("visibilitychange", sync);
    motion.addEventListener("change", sync);
    pointer.addEventListener("change", sync);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", sync);
      motion.removeEventListener("change", sync);
      pointer.removeEventListener("change", sync);
    };
  }, [active, hovered]);

  return (
    <section className="shell proof-index">
      <div className="proof-index-head" aria-hidden>
        <span>Client</span><span>Project</span><span>Work</span>
      </div>
      <ul className="proof-list">
        {PROJECTS.map(({ brand, project, work, companion, lightInk, darkInk, lightCompanion }, i) => (
          <li key={brand.name}>
            <Link
              href="/proof"
              className="proof-row"
              data-active={active === i || undefined}
              style={{
                  "--proof-brand": brand.color,
                "--proof-companion": companion,
                "--proof-ink-light": lightInk,
                "--proof-ink-dark": darkInk,
                "--proof-companion-light": lightCompanion,
              } as CSSProperties}
              onPointerEnter={(event) => {
                if (event.pointerType !== "mouse" || !matchMedia(FINE_POINTER).matches) return;
                pointer.current = { x: event.clientX, y: event.clientY };
                setHovered(i);
                }}
              onPointerMove={(event) => { pointer.current = { x: event.clientX, y: event.clientY }; }}
              onPointerLeave={() => setHovered(null)}
              onPointerCancel={() => setHovered(null)}
              onFocus={(event) => {
                if (event.currentTarget.matches(":focus-visible")) setFocused(i);
              }}
              onBlur={() => setFocused(null)}
            >
              <DotScreen on={active === i} pointer={pointer} />
              {/* The arrow reads as the name's first word, a word space before it. */}
              <span className="proof-client-cell">
                <ArrowUpRight className="proof-row-arrow" viewBox="6 6 12 12" strokeWidth={1.5} aria-hidden />
                <span className="proof-client">
                  <span className="proof-client-base">{brand.name}</span>
                  <span className="proof-client-gradient" aria-hidden ref={(el) => { names.current[i] = el; }}>{brand.name}</span>
                </span>
              </span>
              <span className="proof-project"><span className="sr-only">Project: </span>{project}</span>
              <span className="proof-work"><span className="sr-only">Work: </span>{work}</span>
            </Link>
          </li>
        ))}
      </ul>
      </section>
  );
}
