"use client";

import { type CSSProperties, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

// A killed darling, mounted nowhere: beside the testimonial in Home's "Why me" on 2026-10-28, cut
// the same evening (journal, "Killing your darlings").
// Paragraphs whose letters brighten in a wave as the block scrolls up the window, after
// bymonolog.com. Scroll position drives it, so it never holds a reader up; screen readers get the
// plain text. The type size comes in className. Styles: "Shading text" in globals.css.
export function ShadingText({ paragraphs, className }: { paragraphs: string[]; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    // How much of the block has passed 70% of the way down the window, as a fraction of its height:
    // the letters there are the ones lighting up, so the edge between lit and dim stays on screen.
    const update = () => {
      frame = 0;
      const box = el.getBoundingClientRect();
      const p = (innerHeight * 0.7 - box.top) / box.height;
      el.style.setProperty("--p", String(Math.min(1.2, Math.max(-0.2, p))));
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", request, { passive: true });
    addEventListener("resize", request);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", request);
      removeEventListener("resize", request);
    };
  }, []);

  // Every letter's place in the whole text, across paragraphs.
  const total = paragraphs.join("").length;
  const split = paragraphs.map((text, pi) => {
    const base = paragraphs.slice(0, pi).join("").length;
    return [...text.matchAll(/\S+/g)].map(({ 0: word, index }) =>
      [...word].map((ch, k) => ({ ch, i: base + index + k })),
    );
  });

  return (
    <div ref={ref} className={cn("shading-text", className)} style={{ "--n": total } as CSSProperties}>
      {paragraphs.map((text, pi) => (
        <p key={pi} className={cn("text-fg-max", pi > 0 && "mt-[1em]")}>
          <span className="sr-only">{text}</span>
          <span aria-hidden>
            {split[pi].map((letters, wi) => (
              <span key={wi}>
                {wi > 0 && " "}
                <span className="shading-word">
                  {letters.map(({ ch, i }) => (
                    <span key={i} style={{ "--i": i } as CSSProperties}>
                      {ch}
                    </span>
                  ))}
                </span>
              </span>
            ))}
          </span>
        </p>
      ))}
    </div>
  );
}
