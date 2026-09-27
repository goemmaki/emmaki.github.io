"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/content";
import { RegisterDot } from "@/components/register-dot";
import { PlaceholderTag } from "@/components/layout";
import { Mark, markGlyph } from "@/components/glyphs/mark";

/**
 * Work as an index of em-dash rows. On fine pointers, a preview opens out of a
 * period-sized counter and follows the cursor.
 */
export function WorkList({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<number | null>(null);
  const [fine, setFine] = useState(false);
  const reduce = useReducedMotion();

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 300, damping: 30 });
  const y = useSpring(my, { stiffness: 300, damping: 30 });

  useEffect(() => {
    const mq = matchMedia("(pointer: fine) and (min-width: 960px)");
    const update = () => setFine(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const current = active === null ? null : projects[active];

  return (
    <div
      onPointerMove={(e) => {
        mx.set(e.clientX + 24);
        my.set(e.clientY - 120);
      }}
      onPointerLeave={() => setActive(null)}
    >
      <ul className="border-t border-line">
        {projects.map((p, i) => (
          <li key={p.slug} className="border-b border-line">
            <Link
              href={`/work/${p.slug}`}
              onPointerEnter={() => setActive(i)}
              onFocus={() => setActive(null)}
              className="group grid grid-cols-[2.5rem_minmax(0,1fr)] items-baseline gap-x-4 gap-y-2 py-6 lg:grid-cols-[2.5rem_auto_minmax(3rem,1fr)_auto_3.5rem] lg:py-8"
            >
              <span className="font-heading text-2xl text-fg-muted transition-colors group-hover:text-fg" aria-hidden>
                {markGlyph[p.mark]}
              </span>
              <span className="type-h3 text-fg transition-colors lg:max-w-[28ch]">{p.title}</span>

              {/* em-dash leader: a hairline that thickens into a dash on hover */}
              <span className="relative hidden h-px self-center bg-line-strong lg:block" aria-hidden>
                <span className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 origin-left scale-x-0 rounded-[2px] bg-fg transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100" />
              </span>

              <span className="col-start-2 flex items-center gap-3 type-meta text-fg-2 lg:col-start-auto">
                <RegisterDot register={p.register} />
                {p.kind}
              </span>
              <span className="col-start-2 type-meta text-fg-muted lg:col-start-auto lg:text-right">{p.year}</span>
            </Link>
          </li>
        ))}
      </ul>

      {fine && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed left-0 top-0 z-40 h-[240px] w-[360px]"
          style={{ x, y }}
          initial={false}
          animate={{
            clipPath: current ? "inset(0% 0% 0% 0% round 2px)" : "inset(47% 48% 47% 48% round 2px)",
            opacity: current ? 1 : 0,
          }}
          transition={reduce ? { duration: 0 } : { duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {current && <Cover project={current} />}
        </motion.div>
      )}
    </div>
  );
}

/** Typographic placeholder cover: the project's mark, tinted by register. */
export function Cover({ project, className }: { project: Project; className?: string }) {
  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden rounded-sm border border-line-strong bg-bg-2",
        className,
      )}
    >
      <div
        className={cn(
          "absolute inset-0",
          project.register === "authored" ? "bg-yellow-ghost" : "bg-green-ghost",
        )}
      />
      {/* drafting grid */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-border-faint) 1px, transparent 1px), linear-gradient(90deg, var(--color-border-faint) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <Mark name={project.mark} className="absolute inset-[16%] h-[68%] w-[68%] text-fg-max" />
      <span className="absolute left-4 top-4 type-meta text-fg-2">{project.kind}</span>
      {project.placeholder && <PlaceholderTag className="absolute bottom-4 left-4 bg-bg" />}
    </div>
  );
}
