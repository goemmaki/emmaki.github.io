"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Testimonial } from "@/lib/content";
import { cn } from "@/lib/utils";

// Client quotes on a timer, after bymonolog.com: a hairline fills left to right, and when it's full
// the next quote rises in. Arrows step by hand, with a mono count beside them. The timer holds while
// the quotes are hovered, focused or off screen; with reduced motion there's no timer and no rise,
// only the arrows. Styles: "Testimonials" in globals.css.
export function Testimonials({
  items,
  size = "sm",
  className,
}: {
  items: Testimonial[];
  size?: "sm" | "lg";
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const [held, setHeld] = useState(false);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const go = (step: number) => setIndex((i) => (i + step + items.length) % items.length);
  const pad = (n: number) => String(n).padStart(2, "0");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <figure
      ref={ref}
      className={cn("testimonials", className)}
      onPointerEnter={() => setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={() => setHeld(false)}
    >
      <div className="testimonials-line">
        <span
          key={index}
          className="testimonials-fill"
          data-held={held || !visible || undefined}
          onAnimationEnd={() => go(1)}
        />
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex gap-2">
          <button type="button" className="testimonials-button" aria-label="Previous quote" onClick={() => go(-1)}>
            <ArrowLeft className="size-4" aria-hidden />
          </button>
          <button type="button" className="testimonials-button" aria-label="Next quote" onClick={() => go(1)}>
            <ArrowRight className="size-4" aria-hidden />
          </button>
        </div>
        <p className="type-meta text-fg-2">
          {pad(index + 1)} / {pad(items.length)}
        </p>
      </div>
      {/* Every quote sits in the same grid cell and only the current one shows, so the box keeps one
          height and nothing around it moves when the quote changes (owner, 2026-10-28). */}
      <div className="testimonials-stack">
        {items.map((t, i) => (
          <div key={i} className="testimonials-quote" data-current={i === index || undefined}>
            <blockquote className={cn("mt-8 text-fg-max", size === "lg" ? "type-h3" : "type-editorial")}>
              “{t.quote}”
            </blockquote>
            {/* After bymonolog.com: the name, the role and the company each on their own line, with
                no commas (owner, 2026-10-28), then who the client is in a mono line, so a reader can
                tell whether the client is like them. */}
            <figcaption className="mt-6 flex items-center gap-3 type-secondary text-fg-2">
              {t.photo && (
                // eslint-disable-next-line @next/next/no-img-element -- a 168px headshot in a static export
                <img src={`/testimonials/${t.photo}`} alt="" width={56} height={56} className="testimonials-photo" />
              )}
              <span className="flex flex-col">
                <span className="text-fg-max">{t.name}</span>
                <span>{t.role}</span>
                <span>{t.company}</span>
              </span>
            </figcaption>
            {t.about && <p className="mt-6 type-meta text-fg-2 uppercase">({t.about})</p>}
          </div>
        ))}
      </div>
    </figure>
  );
}
