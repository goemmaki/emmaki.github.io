"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";

// The big wordmark along the foot of every page, with the footer's own row (children) laid over
// the sparse top of the dot field. The field and wordmark are decorative: the © line names emmaki.
// Styles: the "Footer wordmark" block in globals.css.
export function FooterWordmark({ children }: { children?: ReactNode }) {
  const field = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  // Spotlight follows a mouse only; touch and pen get the plain field.
  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || !field.current) return;
    const el = field.current;
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
    field.current?.classList.remove("footer-lit");
  };

  return (
    <div className="footer-band relative h-60 overflow-hidden" onPointerMove={onMove} onPointerLeave={onLeave}>
      <div ref={field} aria-hidden="true" className="footer-field">
        <div className="footer-dots" />
      </div>
      <div aria-hidden="true" className="shell pointer-events-none absolute inset-x-0 -bottom-[0.05em]">
        <p className="footer-mark select-none font-heading text-[clamp(5rem,21vw,13rem)] font-[number:var(--font-weight-announce)] leading-[0.8] tracking-[-0.06em] text-bg">
          emmaki
        </p>
      </div>
      {children && <div className="shell relative">{children}</div>}
    </div>
  );
}
