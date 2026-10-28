"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";
import { BRANDS, type Brand, CLIENT_STRIP_ORDER } from "@/lib/content";

// The client strip, after grafit.agency's home page: a row of cells between full-bleed hairlines, each
// a slot-machine reel of client logos, monochrome until hovered, when the logo shows its own colors.
// One cell rolls at a time, in a random order each round, so the row never changes all at once. Two
// cells on phones, three on tablets, five on desktops; the clients are dealt across the cells in strip
// order. Rolling stops while the strip is off screen or hovered, and never starts with reduced motion.
// Styles: "Client slots" in globals.css.

/* eslint-disable @next/next/no-img-element -- small trimmed logos in a static export: next/image would only add sizing */
// Both theme versions; CSS shows the one for the current theme.
function Logo({ brand }: { brand: Brand }) {
  const { light, dark } = brand.logo;
  return (
    <span className="client-slot-logo">
      <img src={`/clients/${light}`} alt="" className="client-logo-on-light" />
      <img src={`/clients/${dark}`} alt="" className="client-logo-on-dark" />
    </span>
  );
}
const STEP_MS = 1400;

const rank = (b: Brand) => {
  const i = CLIENT_STRIP_ORDER.indexOf(b.name);
  return i < 0 ? Infinity : i;
};
const CLIENTS = [...BRANDS].sort((a, b) => rank(a) - rank(b));

// One round: every cell rolls once, one at a time, in a random order, except the first cell (it opens
// on Fiverr), which always rolls last (owner, 2026-10-28).
function roundOrder(cols: number) {
  const rest = Array.from({ length: cols - 1 }, (_, i) => i + 1);
  for (let i = rest.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [rest[i], rest[j]] = [rest[j], rest[i]];
  }
  return [...rest, 0];
}

function useColumns() {
  const [cols, setCols] = useState(5);
  useEffect(() => {
    const lg = matchMedia("(min-width: 64rem)");
    const sm = matchMedia("(min-width: 40rem)");
    const update = () => setCols(lg.matches ? 5 : sm.matches ? 3 : 2);
    update();
    lg.addEventListener("change", update);
    sm.addEventListener("change", update);
    return () => {
      lg.removeEventListener("change", update);
      sm.removeEventListener("change", update);
    };
  }, []);
  return cols;
}

function Slot({ reel, rolls }: { reel: Brand[]; rolls: number }) {
  const [shown, setShown] = useState(0);
  const [rolling, setRolling] = useState(false);
  const seen = useRef(rolls);
  useEffect(() => {
    if (rolls !== seen.current && reel.length > 1) setRolling(true);
    seen.current = rolls;
  }, [rolls, reel.length]);
  const current = reel[shown % reel.length];
  const next = reel[(shown + 1) % reel.length];
  return (
    <li className="client-slot">
      <div
        className="client-slot-reel"
        data-rolling={rolling || undefined}
        onTransitionEnd={(e) => {
          // A logo's hover fades too; only the reel's own roll counts.
          if (e.target !== e.currentTarget) return;
          setShown((s) => s + 1);
          setRolling(false);
        }}
      >
        {[current, next].map((b, i) => (
          <Logo key={i} brand={b} />
        ))}
      </div>
    </li>
  );
}

export function ClientSlots({ className }: { className?: string }) {
  const cols = useColumns();
  const ref = useRef<HTMLDivElement>(null);
  // How many times each cell has rolled, for the column count they were counted under.
  const [rolls, setRolls] = useState({ cols, counts: [] as number[] });
  const queue = useRef({ cols, cells: [] as number[] });
  const [running, setRunning] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(([entry]) => setRunning(entry.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!running || hovered) return;
    const id = setInterval(() => {
      if (queue.current.cols !== cols || !queue.current.cells.length) queue.current = { cols, cells: roundOrder(cols) };
      const cell = queue.current.cells.shift()!;
      setRolls((r) => {
        const counts = r.cols === cols ? [...r.counts] : [];
        counts[cell] = (counts[cell] ?? 0) + 1;
        return { cols, counts };
      });
    }, STEP_MS);
    return () => clearInterval(id);
  }, [running, hovered, cols]);

  const reels = Array.from({ length: cols }, (_, c) => CLIENTS.filter((_, i) => i % cols === c));

  return (
    <div
      ref={ref}
      className={`client-strip ${className ?? ""}`}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <ul className="sr-only">
        {CLIENTS.map((b) => (
          <li key={b.name}>{b.name}</li>
        ))}
      </ul>
      <ul className="client-slots" style={{ "--cols": cols } as CSSProperties} aria-hidden>
        {reels.map((reel, c) => (
          <Slot key={`${cols}-${c}`} reel={reel} rolls={(rolls.cols === cols && rolls.counts[c]) || 0} />
        ))}
      </ul>
    </div>
  );
}
