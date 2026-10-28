"use client";

import { useEffect, useRef } from "react";

export type Benefit = { title: string; body: string };

// A killed darling, mounted nowhere: the benefit cards under Home's "Why me" grid on 2026-10-28, cut
// the same evening (journal, "Killing your darlings"). Large cards, the first two in view on arrival,
// pinned while vertical scroll runs them sideways (after a horizontal scroll on 21st.dev). Reduced
// motion gets a plain stack. Styles: "Benefit run" in globals.css.
export function BenefitRun({ benefits }: { benefits: Benefit[] }) {
  const run = useRef<HTMLDivElement>(null);
  const lane = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const r = run.current;
    const l = lane.current;
    const t = track.current;
    if (!r || !l || !t) return;
    const motion = matchMedia("(prefers-reduced-motion: no-preference)");
    let raf = 0;
    const update = () => {
      raf = 0;
      if (!motion.matches) {
        r.style.height = "";
        t.style.translate = "";
        return;
      }
      // The run is pinned for half again as long as the cards travel, so they don't race.
      const travel = Math.max(0, t.offsetWidth - l.clientWidth);
      const length = travel * 1.5;
      r.style.height = `${l.offsetHeight + length}px`;
      const progress = length ? Math.min(1, Math.max(0, -r.getBoundingClientRect().top / length)) : 0;
      t.style.translate = `${-travel * progress}px 0`;
    };
    const request = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", request, { passive: true });
    addEventListener("resize", request);
    motion.addEventListener("change", request);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("scroll", request);
      removeEventListener("resize", request);
      motion.removeEventListener("change", request);
    };
  }, [benefits.length]);

  return (
    <div ref={run} className="benefit-run">
      <div ref={lane} className="benefit-run-lane">
        <ul ref={track} className="benefit-run-track">
          {benefits.map((b) => (
            <li key={b.title} className="benefit-run-card">
              <h3 className="type-h3">{b.title}</h3>
              <p className="mt-4 type-lead">{b.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
