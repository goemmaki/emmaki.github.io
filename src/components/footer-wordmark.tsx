"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";

// The footer's dot field and big wordmark above the black bar (children). The field and wordmark
// are decorative: the © line names emmaki. Two copies of the field drift in step: the plain dots,
// and the yellow spotlight shown only under a mouse in dark mode. Styles: the "Footer" block in
// globals.css.
export function FooterWordmark({ children }: { children: ReactNode }) {
  const footer = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  // The spotlight follows a mouse only; touch and pen get the plain field.
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
      <div aria-hidden="true" className="footer-field footer-field--ink">
        <div className="footer-dots" />
      </div>
      <div aria-hidden="true" className="footer-field footer-field--torch">
        <div className="footer-dots" />
      </div>
      {/* overflow-hidden crops the wordmark at the bar */}
      <div aria-hidden="true" className="relative h-60 overflow-hidden pointer-events-none">
        <div className="shell relative h-full">
          <p className="footer-mark absolute bottom-0 translate-y-[0.1em] select-none font-heading text-[clamp(5rem,21vw,13rem)] font-[number:var(--font-weight-announce)] leading-[0.8] tracking-[-0.06em] text-bg">
            <span className="footer-wobble inline-block">emmaki</span>
          </p>
        </div>
      </div>
      <div className="footer-bar relative">{children}</div>
    </div>
  );
}
