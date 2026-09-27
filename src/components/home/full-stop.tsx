"use client";

import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { Section } from "@/components/layout";

/**
 * The page ends on a full stop — the one solid-yellow splash. It leans toward
 * the cursor like it wants the last word.
 */
export function FullStop() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 150, damping: 15 });
  const y = useSpring(my, { stiffness: 150, damping: 15 });

  function onMove(e: React.PointerEvent) {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    const dist = Math.hypot(dx, dy);
    const pull = Math.max(0, 1 - dist / 420);
    mx.set(dx * 0.25 * pull);
    my.set(dy * 0.25 * pull);
  }

  return (
    <Section label="Closing" className="overflow-hidden">
      <div
        onPointerMove={onMove}
        onPointerLeave={() => {
          mx.set(0);
          my.set(0);
        }}
        className="py-e1"
      >
        <p className="type-meta text-fg-muted">The whole job, really</p>
        <p className="mt-6 font-heading text-[clamp(3.5rem,11vw,10rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-fg-max">
          Say it once.
          <br />
          <span className="text-fg-muted">Say it clearly</span>
          <motion.span
            ref={ref}
            aria-hidden
            className="ml-[0.06em] inline-block size-[0.2em] rounded-[2px] bg-yellow-splash align-baseline"
            style={{ x, y }}
            initial={reduce ? false : { scale: 0, rotate: -45 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.2 }}
          />
          <span className="sr-only">.</span>
        </p>
      </div>
    </Section>
  );
}
