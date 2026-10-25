"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";

// The footer's dot field and big wordmark, with the black bar (children) along the bottom.
// The field and wordmark are decorative: the © line names emmaki. Styles: the "Footer" block in
// globals.css.
export function FooterWordmark({ children }: { children: ReactNode }) {
  const footer = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  // The spotlight follows a mouse only (and only in dark mode, in CSS); touch and pen get the plain field.
  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || !footer.current) return;
    const el = footer.current;
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
    footer.current?.classList.remove("footer-lit");
  };

  return (
    <div ref={footer} className="footer relative overflow-hidden" onPointerMove={onMove} onPointerLeave={onLeave}>
      <div className="footer-base absolute inset-x-0 bottom-0" />
      <div aria-hidden="true" className="footer-field">
        <div className="footer-dots" />
      </div>
      <div aria-hidden="true" className="h-60 shell pointer-events-none relative">
        <p className="footer-mark absolute -bottom-[0.05em] select-none font-heading text-[clamp(5rem,21vw,13rem)] font-[number:var(--font-weight-announce)] leading-[0.8] tracking-[-0.06em] text-bg">
          emmaki
        </p>
      </div>
      <div className="footer-bar relative">{children}</div>
    </div>
  );
}
