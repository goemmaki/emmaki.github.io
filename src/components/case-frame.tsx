"use client";

import { useEffect, useLayoutEffect, useRef, type CSSProperties } from "react";

const METRICS = [
  { value: "00%", label: "Lorem ipsum dolor sit amet" },
  { value: "000", label: "Consectetur adipiscing elit" },
  { value: "00 → 00", label: "Sed do eiusmod tempor" },
];

export function CaseFrame({ brandColor, clientName }: { brandColor: string; clientName: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLParagraphElement>(null);

  // Like PageClosing, align the attribution to the longest rendered line, after fonts and wraps.
  useLayoutEffect(() => {
    const field = ref.current;
    const quote = quoteRef.current;
    if (!field || !quote) return;
    let active = true;
    const measure = () => {
      if (!active) return;
      const range = document.createRange();
      range.selectNodeContents(quote);
      const width = Math.max(...Array.from(range.getClientRects(), (rect) => rect.width));
      field.style.setProperty("--case-quote-width", `${width}px`);
    };
    measure();
    document.fonts.ready.then(measure);
    const observer = new ResizeObserver(measure);
    observer.observe(quote);
    return () => {
      active = false;
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const field = ref.current;
    if (!field) return;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    // Proof's small noise tile and soft-light blend, over one field for the whole grid.
    const tile = document.createElement("canvas");
    tile.width = 96;
    tile.height = 64;
    const ctx = tile.getContext("2d");
    if (!ctx) return; // The content and CSS gradient remain readable without canvas.
    const pixels = ctx.createImageData(tile.width, tile.height);
    let frame = 0;
    let last = -Infinity;
    let visible = false;

    function paint(time: number) {
      for (let i = 0; i < pixels.data.length; i += 4) {
        const gray = Math.floor(Math.random() * 256);
        pixels.data[i] = pixels.data[i + 1] = pixels.data[i + 2] = gray;
        pixels.data[i + 3] = 64;
      }
      ctx!.putImageData(pixels, 0, 0);
      field!.style.setProperty("--case-noise", `url("${tile.toDataURL()}")`);
      field!.style.backgroundPosition = `0 0, ${50 + Math.sin(time / 1600) * 45}% 50%`;
    }

    function drawCaseGrain(time: number) {
      // At most 20 texture updates per second, with no React renders or full-size canvas.
      if (time - last >= 50) {
        last = time;
        paint(time);
      }
      frame = requestAnimationFrame(drawCaseGrain);
    }

    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };
    const sync = () => {
      stop();
      if (visible && !document.hidden && !motion.matches) {
        last = -Infinity;
        frame = requestAnimationFrame(drawCaseGrain);
      }
    };
    // Reduced motion gets a real, still grain frame too, including on the first visit.
    paint(0);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(field);
    document.addEventListener("visibilitychange", sync);
    motion.addEventListener("change", sync);
    return () => {
      stop();
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      motion.removeEventListener("change", sync);
    };
  }, []);

  return (
    <div ref={ref} data-theme="dark" className="case-frame mt-e2" style={{ "--case-brand": brandColor } as CSSProperties}>
      <dl className="case-frame-metrics" aria-label="Placeholder results">
        {METRICS.map(({ value, label }) => (
          <div className="case-frame-metric" key={value}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      <figure className="case-frame-quote">
        <blockquote>
          <p ref={quoteRef}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</p>
        </blockquote>
        {/* The person, then the client's logo at the height of their two lines, its right edge on
            the quote's longest line (owner, 2026-10-29). */}
        <figcaption>
          <span className="case-frame-avatar" aria-hidden="true" />
          <span className="case-frame-person">
            <span className="case-frame-name">Name Surname</span>
            <span className="case-frame-role">Role</span>
          </span>
          <span className="case-frame-logo" role="img" aria-label={clientName} />
        </figcaption>
      </figure>
    </div>
  );
}
