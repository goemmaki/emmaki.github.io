"use client";

import { useEffect, useRef, useSyncExternalStore, type CSSProperties, type PointerEvent, type ReactNode } from "react";

// Wordmark variants under review (owner, 2026-10-25): /?mark=plain, /?mark=try (default), /?mark=hash.
// "try" is set like the hero's "vituperative": Source Serif light italic. Each variant's font size
// is the largest that fits the shell (width: the mark's width in ems), and `inset` pulls the first
// letter's ink onto the gutter.
const MARKS = {
  plain: { prefix: "", try: false, width: undefined, inset: "-0.04em" },
  try: { prefix: "", try: true, width: 4.66, inset: "-0.05em" },
  hash: { prefix: "#", try: true, width: 5.14, inset: "0em" },
} as const;
type Mark = keyof typeof MARKS;
const noSubscription = () => () => {};
const readMark = (): Mark => {
  const mark = new URLSearchParams(location.search).get("mark");
  return mark && mark in MARKS ? (mark as Mark) : "try";
};

// The footer's dot field and big wordmark above the black bar (children). The field and wordmark
// are decorative: the © line names emmaki. Two copies of the field drift in step: the plain dots,
// and the yellow spotlight shown only under a mouse in dark mode. Styles: the "Footer" block in
// globals.css.
export function FooterWordmark({ children }: { children: ReactNode }) {
  const footer = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const mark = MARKS[useSyncExternalStore(noSubscription, readMark, () => "try" as const)];

  // The drift moves one device pixel per step, so the dots never land between pixels. Resize also
  // fires on zoom and on moving to a screen with a different pixel ratio.
  useEffect(() => {
    const el = footer.current;
    const dots = el?.querySelector<HTMLElement>(".footer-dots");
    if (!el || !dots) return;
    const setSteps = () => {
      const tile = dots.offsetWidth - el.offsetWidth;
      el.style.setProperty("--footer-steps", String(Math.max(1, Math.round(tile * devicePixelRatio))));
    };
    setSteps();
    window.addEventListener("resize", setSteps);
    return () => window.removeEventListener("resize", setSteps);
  }, []);

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
    <div
      ref={footer}
      style={
        {
          "--footer-mark-inset": mark.inset,
          ...(mark.width && { "--footer-mark": `min(13rem, (100vw - 2 * var(--gutter)) / ${mark.width})` }),
        } as CSSProperties
      }
      className="footer relative overflow-hidden" onPointerMove={onMove} onPointerLeave={onLeave}>
      <div className="footer-base absolute inset-x-0 bottom-0" />
      <div aria-hidden="true" className="footer-field footer-field--ink">
        <div className="footer-dots" />
      </div>
      <div aria-hidden="true" className="footer-field footer-field--torch">
        <div className="footer-dots" />
      </div>
      {/* overflow-hidden crops the wordmark at the bar */}
      <div aria-hidden="true" className="relative h-(--footer-field-h) overflow-hidden pointer-events-none">
        <div className="shell relative h-full">
          <p className="footer-mark absolute bottom-0 ml-(--footer-mark-inset) translate-y-[0.1em] select-none font-heading text-(length:--footer-mark) font-[number:var(--font-weight-announce)] leading-[0.8] tracking-[-0.06em] text-bg">
            {mark.prefix}
            {mark.try && <span className="font-[family-name:var(--nf-source-serif)] mr-[0.04em] font-light italic tracking-[-0.02em]">try</span>}
            emmaki
          </p>
        </div>
      </div>
      <div className="footer-bar relative">{children}</div>
    </div>
  );
}
