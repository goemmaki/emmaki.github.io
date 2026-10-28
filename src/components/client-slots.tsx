"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";
import { BRANDS, type Brand } from "@/lib/content";

// The client strip, after grafit.agency's home page: a row of hairline cells, each a slot-machine
// reel of client names. One cell rolls to its next name at a time, left to right, so the row never
// changes all at once. Hovering a name shows its brand's color. Two cells on phones, three on
// tablets, five on desktops; the names are dealt across the cells in turn. Rolling stops while the
// strip is off screen or hovered, and never starts with reduced motion. Styles: "Client slots" in
// globals.css.
const STEP_MS = 1400;

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
          // A name's hover color fades too; only the reel's own roll counts.
          if (e.target !== e.currentTarget) return;
          setShown((s) => s + 1);
          setRolling(false);
        }}
      >
        {[current, next].map((b, i) => (
          <span key={i} className="client-slot-name" style={{ "--brand": b.color } as CSSProperties}>
            {b.name}
          </span>
        ))}
      </div>
    </li>
  );
}

export function ClientSlots({ className }: { className?: string }) {
  const cols = useColumns();
  const ref = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
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
    const id = setInterval(() => setStep((s) => s + 1), STEP_MS);
    return () => clearInterval(id);
  }, [running, hovered]);

  const reels = Array.from({ length: cols }, (_, c) => BRANDS.filter((_, i) => i % cols === c));

  return (
    <div
      ref={ref}
      className={className}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <ul className="sr-only">
        {BRANDS.map((b) => (
          <li key={b.name}>{b.name}</li>
        ))}
      </ul>
      <ul className="client-slots" style={{ "--cols": cols } as CSSProperties} aria-hidden>
        {reels.map((reel, c) => (
          // Cell c has rolled once for every full pass of the row that has reached it.
          <Slot key={`${cols}-${c}`} reel={reel} rolls={Math.floor((step + cols - 1 - c) / cols)} />
        ))}
      </ul>
    </div>
  );
}
