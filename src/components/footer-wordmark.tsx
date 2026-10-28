"use client";

import { type CSSProperties, useEffect, useRef, useSyncExternalStore, type PointerEvent, type ReactNode } from "react";

// The footer's dot field and big "*try*emmaki" wordmark ("try" set like the hero's "vituperative"; each
// visit swaps it for "fly" or "buy" at random, owner 2026-10-28),
// above the black bar (children). The field and wordmark are decorative: the © line names emmaki. Two copies of the field drift in step: the plain dots,
// and the yellow spotlight shown only under a mouse in dark mode. Styles: the "Footer" block in
// globals.css.
const VERBS = ["try", "fly", "buy"];
// "buyemmaki" is 4.95em wide, wider than "tryemmaki", so it gets a smaller size where the shell limits it.
const MARK_EM: Record<string, number | undefined> = { buy: 4.98 };
// Drawn once per page load, so client-side navigation keeps the same word.
const VERB = VERBS[Math.floor(Math.random() * VERBS.length)];
const noSubscribe = () => () => {};

export function FooterWordmark({ children }: { children: ReactNode }) {
  const footer = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  // "try" in the static HTML; the browser's draw replaces it once hydrated.
  const verb = useSyncExternalStore(noSubscribe, () => VERB, () => "try");

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
      className="footer relative overflow-hidden"
      style={MARK_EM[verb] ? ({ "--footer-mark-em": MARK_EM[verb] } as CSSProperties) : undefined}
      onPointerMove={onMove} onPointerLeave={onLeave}>
      <div className="footer-base absolute inset-x-0 bottom-0" />
      <div aria-hidden="true" className="footer-art footer-field footer-field--ink">
        <div className="footer-dots" />
      </div>
      <div aria-hidden="true" className="footer-art footer-field footer-field--torch">
        <div className="footer-dots" />
      </div>
      {/* overflow-hidden crops the wordmark at the bar */}
      <div aria-hidden="true" className="footer-art relative h-(--footer-field-h) overflow-hidden pointer-events-none">
        <div className="shell relative h-full">
          <p className="footer-mark absolute bottom-0 -ml-[0.05em] translate-y-[0.1em] select-none font-heading text-(length:--footer-mark) font-[number:var(--font-weight-announce)] leading-[0.8] tracking-[-0.06em] text-bg">
            <span className="font-[family-name:var(--nf-source-serif)] mr-[0.04em] font-light italic tracking-[-0.02em]">{verb}</span>
            emmaki
          </p>
        </div>
      </div>
      <div className="footer-bar relative">{children}</div>
    </div>
  );
}
