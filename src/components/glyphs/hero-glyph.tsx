"use client";

import { useEffect, useId, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { cn } from "@/lib/utils";

/*
 * The hero mark. Two "counters" (A = authored/yellow, B = machine/green) are
 * clipping windows onto two texture layers. Morphing the counters between
 * punctuation shapes reveals different parts of each layer.
 *
 * viewBox 320 × 640. Square dots echo the 2px-corner brand geometry.
 */

type Box = { x: number; y: number; w: number; h: number };
type MarkState = { a: Box; b: Box; tail: boolean };

const DOT_TOP: Box = { x: 80, y: 40, w: 160, h: 160 };
const DOT_BOTTOM: Box = { x: 80, y: 360, w: 160, h: 160 };

const TAIL_OPEN = "M150 520 H240 L170 636 H80 Z";
const TAIL_SHUT = "M150 520 H240 L240 520 H150 Z";

export const MARKS = [
  {
    glyph: ";",
    name: "Semicolon",
    line: "Joins two complete thoughts. Writing; systems.",
    shape: { a: DOT_TOP, b: DOT_BOTTOM, tail: true },
  },
  {
    glyph: ":",
    name: "Colon",
    line: "Promises something. Then delivers it.",
    shape: { a: DOT_TOP, b: DOT_BOTTOM, tail: false },
  },
  {
    glyph: "—",
    name: "Em dash",
    line: "The aside that changes the meaning.",
    shape: {
      a: { x: 0, y: 290, w: 160, h: 60 },
      b: { x: 160, y: 290, w: 160, h: 60 },
      tail: false,
    },
  },
  {
    glyph: ".",
    name: "Full stop",
    line: "Says it once. Stops.",
    shape: { a: DOT_BOTTOM, b: DOT_BOTTOM, tail: false },
  },
] satisfies { glyph: string; name: string; line: string; shape: MarkState }[];

const authoredLines = [
  "Say the true thing",
  "clearly. Find the",
  "angle buyers feel.",
  "Cut what doesn’t",
  "earn its place.",
  "Lead with stakes.",
  "Make the complex",
  "obvious. Write it",
  "like a person who",
  "knows the work.",
  "Say the true thing",
  "clearly. Find the",
  "angle buyers feel.",
  "Cut what doesn’t",
  "earn its place.",
  "Lead with stakes.",
];

const machineLines = [
  "load  sources/*.md",
  "parse brief → angle",
  "check voice.guide",
  "draft v1 → editor",
  "flag  needs:human",
  "n8n   webhook › llm",
  "make  router › review",
  "diff  draft/final",
  "route editor.queue",
  "hold  until approved",
];

const spring = { type: "spring", stiffness: 240, damping: 28, mass: 0.9 } as const;

function Counter({ box }: { box: Box }) {
  return (
    <motion.rect
      initial={false}
      animate={{ attrX: box.x, attrY: box.y, width: box.w, height: box.h }}
      transition={spring}
      rx={2}
    />
  );
}

export function HeroGlyph({ className, markClassName }: { className?: string; markClassName?: string }) {
  const [index, setIndex] = useState(0);
  const mark = MARKS[index];
  const uid = useId().replace(/:/g, "");
  const reduce = useReducedMotion();

  // Pointer parallax: each counter floats at its own depth; textures drift
  // the other way inside the windows.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 80, damping: 20 });
  const sy = useSpring(py, { stiffness: 80, damping: 20 });
  const aX = useTransform(sx, (v) => v * 10);
  const aY = useTransform(sy, (v) => v * 10);
  const bX = useTransform(sx, (v) => v * 20);
  const bY = useTransform(sy, (v) => v * 20);
  const tX = useTransform(sx, (v) => v * -28);
  const tY = useTransform(sy, (v) => v * -18);

  useEffect(() => {
    if (reduce || !matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      px.set((e.clientX / window.innerWidth) * 2 - 1);
      py.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, px, py]);

  const { a, b, tail } = mark.shape;
  const clipA = `clip-a-${uid}`;
  const clipB = `clip-b-${uid}`;
  const tailD = tail ? TAIL_OPEN : TAIL_SHUT;

  return (
    <figure className={cn("flex flex-col items-center lg:items-start", className)}>
      <button
        type="button"
        onClick={() => setIndex((i) => (i + 1) % MARKS.length)}
        aria-label={`${mark.name}. Change the mark`}
        className={cn("group block cursor-pointer rounded-sm", markClassName)}
      >
        <svg viewBox="0 0 320 640" className="h-full w-full overflow-visible" aria-hidden>
          <defs>
            <clipPath id={clipA}>
              <Counter box={a} />
            </clipPath>
            <clipPath id={clipB}>
              <Counter box={b} />
              <motion.path initial={false} animate={{ d: tailD }} transition={spring} />
            </clipPath>
          </defs>

          {/* B — machine counter (drawn first so A sits on top) */}
          <g data-intro="glyph-b">
            <motion.g style={{ x: bX, y: bY }}>
              <g clipPath={`url(#${clipB})`}>
                <rect x={-80} y={-80} width={480} height={800} style={{ fill: "var(--color-system-green-motif)" }} />
                <motion.g style={{ x: tX, y: tY }}>
                  {Array.from({ length: 48 }, (_, i) => (
                    <text
                      key={i}
                      x={-40}
                      y={-40 + i * 16}
                      style={{
                        fill: "var(--color-system-green-crisp)",
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        opacity: 0.75,
                      }}
                    >
                      {machineLines[i % machineLines.length]}
                      {"   "}
                      {machineLines[(i + 4) % machineLines.length]}
                    </text>
                  ))}
                </motion.g>
              </g>
              <Outline box={b} tailD={tailD} />
            </motion.g>
          </g>

          {/* A — authored counter */}
          <g data-intro="glyph-a">
            <motion.g style={{ x: aX, y: aY }}>
              <g clipPath={`url(#${clipA})`}>
                <rect x={-80} y={-80} width={480} height={800} style={{ fill: "var(--color-canvas)" }} />
                <rect x={-80} y={-80} width={480} height={800} style={{ fill: "var(--color-brand-yellow-active)" }} />
                <motion.g style={{ x: tX, y: tY }}>
                  {authoredLines.map((line, i) => (
                    <text
                      key={i}
                      x={-30}
                      y={-10 + i * 44}
                      style={{
                        fill: "var(--color-text-maximum)",
                        fontFamily: "var(--font-display)",
                        fontSize: 34,
                        fontWeight: 600,
                        letterSpacing: "-0.03em",
                      }}
                    >
                      {line}
                    </text>
                  ))}
                </motion.g>
              </g>
              <Outline box={a} />
            </motion.g>
          </g>
        </svg>
      </button>

      <figcaption className="mt-6 flex max-w-[34ch] items-baseline gap-3 type-meta text-fg-muted" data-intro="fade">
        <span className="text-fg" aria-hidden>
          {mark.glyph}
        </span>
        <span aria-live="polite">
          <span className="text-fg-2">{mark.name}.</span> {mark.line}
        </span>
      </figcaption>
    </figure>
  );
}

function Outline({ box, tailD }: { box: Box; tailD?: string }) {
  const stroke = { fill: "none", stroke: "var(--color-border-emphasized)", strokeWidth: 1 };
  return (
    <g data-glyph-outline vectorEffect="non-scaling-stroke">
      <motion.rect
        initial={false}
        animate={{ attrX: box.x, attrY: box.y, width: box.w, height: box.h }}
        transition={spring}
        rx={2}
        pathLength={1}
        vectorEffect="non-scaling-stroke"
        style={stroke}
      />
      {tailD && (
        <motion.path
          initial={false}
          animate={{ d: tailD, opacity: tailD === TAIL_OPEN ? 1 : 0 }}
          transition={spring}
          pathLength={1}
          vectorEffect="non-scaling-stroke"
          style={stroke}
        />
      )}
    </g>
  );
}
