"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type Testimonial = { quote: string; name: string; role: string };

// Client quotes on a timer, as a card on a short deck: a hairline along the card's foot fills left
// to right (after bymonolog.com), and when it's full the next quote rises in. The timer holds while
// the card is hovered, focused or off screen; reduced motion leaves only the arrows. Styles:
// "Testimonials" in globals.css.
export function Testimonials({ items, className }: { items: Testimonial[]; className?: string }) {
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
      <div className="flex items-center justify-between gap-4">
        <p className="type-meta text-fg-2">
          {pad(index + 1)} / {pad(items.length)}
        </p>
        <div className="flex gap-2">
          <button type="button" className="testimonials-button" aria-label="Previous quote" onClick={() => go(-1)}>
            <ArrowLeft className="size-4" aria-hidden />
          </button>
          <button type="button" className="testimonials-button" aria-label="Next quote" onClick={() => go(1)}>
            <ArrowRight className="size-4" aria-hidden />
          </button>
        </div>
      </div>
      <div key={index} className="testimonials-quote flex flex-1 flex-col justify-between gap-e1 pt-e1">
        <blockquote className="type-h3 text-fg-max">“{quote}”</blockquote>
        <figcaption className="type-secondary text-fg-2">
          <span className="block text-fg-max">{name}</span>
          {role}
        </figcaption>
      </div>
      <div className="testimonials-line">
        <span
          key={index}
          className="testimonials-fill"
          data-held={held || !visible || undefined}
          onAnimationEnd={() => go(1)}
        />
      </div>
    </figure>
  );
}
