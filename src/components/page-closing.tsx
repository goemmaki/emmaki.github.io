"use client";

import { Info } from "lucide-react";
import { useLayoutEffect, useRef } from "react";
import { FloodButton } from "@/components/flood-button";
import { StatusLight } from "@/components/status-light";
import { FIVERR_PROFILE_URL } from "@/lib/content";

// Every main page closes the same way: the availability status, the owner's two-line ask, then the
// Fiverr button and a small note saying where it goes and what to send. Messaging
// first is the ask (CRO research, 2026-10-27): design work needs scoping before an order.
export function PageClosing() {
  const sectionRef = useRef<HTMLElement>(null);
  const askRef = useRef<HTMLSpanElement>(null);

  // The white line's widest set line, however it wraps, is the box the button row stays inside: the
  // note never runs past the end of "say it".
  useLayoutEffect(() => {
    const section = sectionRef.current;
    const ask = askRef.current;
    if (!section || !ask) return;
    const measure = () => {
      const range = document.createRange();
      range.selectNodeContents(ask);
      const width = Math.max(...Array.from(range.getClientRects(), (r) => r.width));
      section.style.setProperty("--ask-width", `${Math.ceil(width)}px`);
    };
    measure();
    document.fonts.ready.then(measure);
    const observer = new ResizeObserver(measure);
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="shell py-32">
      {/* The availability status leads the ask, as a kicker. */}
      <StatusLight className="mb-6" />
      {/* Two tones: the setup in grey, the ask in white. The brighter line is the one that matters. */}
      <p className="type-h2 text-balance">
        <span className="block text-fg-2">Got something important to say?</span>
        <span ref={askRef} className="block text-fg-max">Hire someone who knows how to say it.</span>
      </p>
      {/* The button on the left, the note's right edge under the end of the white line. Narrower
          than that line, the note goes under the button. */}
      <div className="mt-8 flex max-w-(--ask-width) flex-col items-start gap-6 sm:flex-row sm:items-baseline sm:justify-between">
        <FloodButton href={FIVERR_PROFILE_URL} external>
          Message me
        </FloodButton>
        {/* Balanced lines, so a wrap never strands "budget." alone; the icon is inline so it stays with "Opens". */}
        <p className="min-w-0 text-balance type-secondary text-fg-2 sm:text-right">
          <Info className="mr-2 inline-block size-[1.1em] align-[-0.2em]" aria-hidden />
          Opens my Fiverr profile. Hit Contact and send your brief, timeline and budget.
        </p>
      </div>
    </section>
  );
}
