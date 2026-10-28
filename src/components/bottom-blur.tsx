"use client";

import { type CSSProperties, useEffect, useState } from "react";

// The window's bottom edge goes soft as the page scrolls under it (after supersolid.agency). Each
// layer blurs harder and is masked to a band 12.5% lower; the stack hangs a third below the window, so
// only its gentler bands show. Once scrolling settles at the page's end the footer pulls into focus
// ("Bottom blur" in globals.css).
const LAYERS = [0.75, 0.875, 1.125, 2.25, 4.5, 9, 18, 48];
const SETTLE_MS = 250;

export function BottomBlur() {
  const [off, setOff] = useState(false);
  useEffect(() => {
    let settle = 0;
    // A pixel of slack for fractional scroll positions.
    const atEnd = () => window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 1;
    const update = () => {
      clearTimeout(settle);
      if (!atEnd()) setOff(false);
      // Supersolid's blur fades only as their smooth scroll slows to a stop; native scrolling stops
      // dead at the end, so wait for the scroll events to stop instead.
      else settle = window.setTimeout(() => setOff(atEnd()), SETTLE_MS);
    };
    update();
    // The page's height changes without a scroll too: a new route, an FAQ opening.
    const observer = new ResizeObserver(update);
    observer.observe(document.body);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      clearTimeout(settle);
      observer.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div aria-hidden className="bottom-blur" data-off={off || undefined}>
      {LAYERS.map((blur, i) => {
        const at = (n: number) => `${Math.min(100, Math.max(0, n * 12.5))}%`;
        const style = { "--blur": `${blur}px`, "--a": at(i), "--b": at(i + 1), "--c": at(i + 2), "--d": at(i + 3) };
        return <div key={blur} style={style as CSSProperties} />;
      })}
    </div>
  );
}
