"use client";

import { useState } from "react";

// Lab only. The hero's canvas runs on as ink: it funnels down at an angle into a pen nib whose point
// lands on the next section's headline. The section's top peeks under the hero (--peek). Flat,
// angular, no blur; splotches and parallax come later. The switcher tries the paper colour.
const PAPERS = [
  { id: "inverse", label: "Inverse" },
  { id: "yellow", label: "Yellow" },
  { id: "grey", label: "Pin grey" },
] as const;

export function NibSection() {
  const [paper, setPaper] = useState<(typeof PAPERS)[number]["id"]>("inverse");

  return (
    <section className="nib-section" data-paper={paper}>
      <div className="nib-ink" aria-hidden>
        <div className="nib-funnel" />
        <svg className="nib-pen" viewBox="0 0 100 260">
          <polygon points="0,0 100,0 100,70 62,200 50,260 38,200 0,70" fill="var(--ink)" />
          <line x1="50" y1="120" x2="50" y2="262" stroke="var(--paper)" strokeWidth="3" />
          <circle cx="50" cy="120" r="7" fill="var(--paper)" />
        </svg>
      </div>

      <div className="shell">
        <h2 className="nib-headline font-heading">Section headline</h2>
      </div>
      <div className="nib-strip">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div key={n} className="nib-card">
            <span>{String(n).padStart(2, "0")}</span>
            <span>Card</span>
          </div>
        ))}
      </div>

      <div className="fixed bottom-4 left-4 z-50 flex gap-1 bg-bg/80 p-1 text-xs font-medium backdrop-blur-md">
        {PAPERS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setPaper(id)}
            className={`px-3 py-2 ${paper === id ? "bg-fg-max text-bg" : "text-fg-muted hover:text-fg"}`}
          >
            {label}
          </button>
        ))}
      </div>
    </section>
  );
}
