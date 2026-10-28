import { Testimonials } from "@/components/testimonials";
import type { Testimonial } from "@/lib/content";

// A killed darling, mounted nowhere: Home's "Why me" testimonial on 2026-10-28, cut the same evening
// (journal, "Killing your darlings"). The rotating quotes in a ruled box that keeps the height of the
// longest quote, so nothing around it moves when the quote changes. Styles: "Testimonial box" in
// globals.css.
export function TestimonialBox({ quotes }: { quotes: Testimonial[] }) {
  return (
    <div className="testimonial-box">
      <Testimonials items={quotes} />
    </div>
  );
}
