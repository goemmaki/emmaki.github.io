"use client";

import { motion, useReducedMotion } from "motion/react";
import { Kicker, Section } from "@/components/layout";
import { process } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * How the work moves: one structural rule, activated once on view. Authored
 * steps light yellow, machine steps light green — sparse signal on neutral structure.
 */
export function Process() {
  const reduce = useReducedMotion();
  const step = 0.28;

  return (
    <Section label="Process">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-e1">
        <div>
          <Kicker>How the work moves</Kicker>
          <h2 className="mt-4 type-h2 text-fg-max">Judgment at the ends. Systems in the middle.</h2>
        </div>
        <p className="self-end text-fg-2 type-editorial lg:max-w-[46ch]">
          AI does the gathering and the grind. The brief, the angle, the draft, and the final edit
          stay with a senior writer. Nothing ships unread.
        </p>
      </div>

      <motion.ol
        className="relative mt-e2 grid grid-cols-2 gap-y-e1 sm:grid-cols-3 lg:grid-cols-6"
        initial={reduce ? "on" : "off"}
        whileInView="on"
        viewport={{ once: true, margin: "0px 0px -20% 0px" }}
      >
        {/* the rule */}
        <span className="absolute left-0 right-0 top-[5px] hidden h-px bg-line-strong lg:block" aria-hidden />
        {process.map((p, i) => {
          const authored = p.register === "authored";
          return (
            <li key={p.step} className="relative pr-4">
              {/* segment activation along the rule */}
              <motion.span
                aria-hidden
                className={cn(
                  "absolute left-0 right-0 top-[4px] hidden h-[3px] origin-left lg:block",
                  authored ? "bg-yellow-active" : "bg-green-active",
                )}
                variants={{ off: { scaleX: 0 }, on: { scaleX: 1 } }}
                transition={{ duration: step, delay: i * step, ease: "linear" }}
              />
              <motion.span
                aria-hidden
                className="relative block size-[11px] rounded-[2px] border border-line-solid bg-bg"
                variants={{
                  off: { backgroundColor: "var(--color-canvas)" },
                  on: {
                    backgroundColor: authored
                      ? "var(--color-brand-yellow-splash)"
                      : "var(--color-system-green-crisp)",
                  },
                }}
                transition={{ duration: 0.2, delay: i * step }}
              />
              <p className="mt-6 type-meta text-fg-muted">{String(i + 1).padStart(2, "0")}</p>
              <p className="mt-2 font-heading text-xl font-medium tracking-tight text-fg">{p.step}</p>
              <p className="mt-1 type-secondary text-fg-2">{p.note}</p>
              <p className="mt-3 type-meta text-fg-muted">{authored ? "Authored" : "Machine"}</p>
            </li>
          );
        })}
      </motion.ol>
    </Section>
  );
}
