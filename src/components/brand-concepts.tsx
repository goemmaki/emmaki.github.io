"use client";

import { useState, useSyncExternalStore, type CSSProperties, type PointerEvent } from "react";

// Brand-list concepts under review (owner, 2026-10-27): /brands?v=wall|grid. The switcher in the
// corner is for review only and goes once the owner picks one.
const CONCEPTS = { wall: "Wall", grid: "Grid" } as const;
type Concept = keyof typeof CONCEPTS;
const EVENT = "brands-concept";
const subscribe = (onChange: () => void) => {
  addEventListener(EVENT, onChange);
  return () => removeEventListener(EVENT, onChange);
};
const read = (): Concept => {
  const v = new URLSearchParams(location.search).get("v");
  return v && v in CONCEPTS ? (v as Concept) : "wall";
};
const choose = (v: Concept) => {
  const url = new URL(location.href);
  url.searchParams.set("v", v);
  history.replaceState(history.state, "", url);
  dispatchEvent(new Event(EVENT));
};

export type Brand = { name: string; logo?: string };

const pad = (n: number) => String(n + 1).padStart(2, "0");

// The logo in grey on a white card, in both themes, so dark and light logos both read. Without a logo
// yet, the card sets the name instead. Decorative: the list's text already names the brand.
function LogoCard({ brand, className, style }: { brand: Brand; className: string; style?: CSSProperties }) {
  return (
    <div aria-hidden="true" className={`brand-card ${className}`} style={style}>
      {brand.logo ? (
        // eslint-disable-next-line @next/next/no-img-element -- static export, unoptimised images
        <img src={brand.logo} alt="" className="brand-card-logo" />
      ) : (
        <span className="brand-card-name">{brand.name}</span>
      )}
    </div>
  );
}

// Grid: the pointer tilts the cell's face towards it, up to MAX_TILT degrees, inside the cell.
const MAX_TILT = 10;
function tilt(e: PointerEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width - 0.5;
  const y = (e.clientY - r.top) / r.height - 0.5;
  e.currentTarget.style.setProperty("--ry", `${x * 2 * MAX_TILT}deg`);
  e.currentTarget.style.setProperty("--rx", `${-y * 2 * MAX_TILT}deg`);
}
function untilt(e: PointerEvent<HTMLElement>) {
  e.currentTarget.style.removeProperty("--rx");
  e.currentTarget.style.removeProperty("--ry");
}

export function BrandConcepts({ brands }: { brands: Brand[] }) {
  const concept = useSyncExternalStore(subscribe, read, () => "wall" as const);
  // Wall: the brand under the pointer, and the pointer's position for its card.
  const [peek, setPeek] = useState<{ brand: Brand; x: number; y: number } | null>(null);

  return (
    <>
      {concept === "wall" && (
        // The covers' massive type carried on: one name a line, flush left, set solid. Hovering a name
        // brings up a small logo card by the pointer (mouse only).
        <section className="overflow-x-clip py-32 [container-type:inline-size]">
          <ol className="shell">
            {brands.map((b, i) => (
              <li
                key={b.name}
                className="brand-wall-name"
                onPointerMove={(e) => e.pointerType === "mouse" && setPeek({ brand: b, x: e.clientX, y: e.clientY })}
                onPointerLeave={() => setPeek(null)}
              >
                {b.name}
                <sup className="brand-wall-no">{pad(i)}</sup>
              </li>
            ))}
          </ol>
          {peek && (
            <LogoCard
              key={peek.brand.name}
              brand={peek.brand}
              className="brand-peek"
              style={{ left: peek.x, top: peek.y }}
            />
          )}
        </section>
      )}

      {concept === "grid" && (
        // A specimen sheet: hairline cells, number top left, name bottom left. Hovering a cell tilts its
        // face towards the pointer and lays the logo card over it, inside the cell's lines.
        <section className="shell py-32">
          <ol className="grid grid-cols-2 border-t border-l border-line md:grid-cols-3 lg:grid-cols-4">
            {brands.map((b, i) => (
              <li
                key={b.name}
                className="brand-cell aspect-square border-r border-b border-line"
                onPointerMove={(e) => e.pointerType === "mouse" && tilt(e)}
                onPointerLeave={untilt}
              >
                <div className="brand-cell-face relative flex h-full flex-col justify-between p-4 md:p-6">
                  <span className="font-mono text-sm text-fg-2">{pad(i)}</span>
                  <span className="brand-grid-name">{b.name}</span>
                  <LogoCard brand={b} className="brand-cell-card" />
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      <nav
        aria-label="Brand list concepts (review only)"
        className="fixed right-4 bottom-4 z-50 flex gap-1 rounded-full border border-line bg-bg p-1 font-mono text-xs"
      >
        {(Object.keys(CONCEPTS) as Concept[]).map((v) => (
          <button
            key={v}
            type="button"
            aria-pressed={v === concept}
            onClick={() => choose(v)}
            className="rounded-full px-3 py-2 aria-pressed:bg-fg-max aria-pressed:text-bg"
          >
            {CONCEPTS[v]}
          </button>
        ))}
      </nav>
    </>
  );
}
