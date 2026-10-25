"use client";

import { useRef, type PointerEvent } from "react";

// The big wordmark along the foot of every page. Decorative: the footer's © line names emmaki.
// Two copies of the dot field drift in step: neutral ink, and the yellow torch shown only under
// a mouse. Styles: the "Footer" block in globals.css.
export function FooterWordmark() {
  const band = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  // The torch follows a mouse only; touch and pen get the plain field.
  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || !band.current) return;
    const el = band.current;
    const box = el.getBoundingClientRect();
    const x = event.clientX - box.left;
    const y = event.clientY - box.top;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.style.setProperty("--footer-x", `${x}px`);
      el.style.setProperty("--footer-y", `${y}px`);
      el.classList.add("footer-lit");
    });
  };
  const onLeave = () => {
    cancelAnimationFrame(frame.current);
    band.current?.classList.remove("footer-lit");
  };

  return (
    <div ref={band} aria-hidden="true" className="footer-band relative h-60 overflow-hidden" onPointerMove={onMove} onPointerLeave={onLeave}>
      <div className="footer-field footer-field--ink">
        <div className="footer-dots" />
      </div>
      <div className="footer-field footer-field--torch">
        <div className="footer-dots" />
      </div>
      <div className="shell pointer-events-none absolute inset-x-0 -bottom-[0.05em]">
        <p className="footer-mark select-none font-heading text-[clamp(5rem,21vw,13rem)] font-[number:var(--font-weight-announce)] leading-[0.8] tracking-[-0.06em] text-bg">
          emmaki
        </p>
      </div>
    </div>
  );
}
