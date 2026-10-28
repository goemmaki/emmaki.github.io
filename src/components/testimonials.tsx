"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type Testimonial = { quote: string; name: string; role: string };

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
  const { quote, name, role } = items[index];

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
      <div key={index} className="testimonials-quote">
        <blockquote className={cn("mt-8 text-fg-max", size === "lg" ? "type-h3" : "type-editorial")}>
          “{quote}”
        </blockquote>
        <figcaption className="mt-6 type-secondary text-fg-2">
          <span className="text-fg-max">{name}</span>, {role}
        </figcaption>
      </div>
    </figure>
  );
}
