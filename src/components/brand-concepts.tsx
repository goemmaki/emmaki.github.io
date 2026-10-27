"use client";

import { useSyncExternalStore } from "react";

// Brand-list concepts under review (owner, 2026-10-27): /brands?v=index|wall|grid|run. The switcher
// in the corner is for review only and goes once the owner picks one.
const CONCEPTS = {
  index: "Index",
  wall: "Wall",
  grid: "Grid",
  run: "Run-in",
} as const;
type Concept = keyof typeof CONCEPTS;
const EVENT = "brands-concept";
const subscribe = (onChange: () => void) => {
  addEventListener(EVENT, onChange);
  return () => removeEventListener(EVENT, onChange);
};
const read = (): Concept => {
  const v = new URLSearchParams(location.search).get("v");
  return v && v in CONCEPTS ? (v as Concept) : "index";
};
const choose = (v: Concept) => {
  const url = new URL(location.href);
  url.searchParams.set("v", v);
  history.replaceState(history.state, "", url);
  dispatchEvent(new Event(EVENT));
};

const pad = (n: number) => String(n + 1).padStart(2, "0");

export function BrandConcepts({ brands }: { brands: string[] }) {
  const concept = useSyncExternalStore(subscribe, read, () => "index" as const);
  const letters = [...new Set(brands.map((b) => b[0].toUpperCase()))];

  return (
    <>
      {concept === "index" && (
        // A book index: the initial in the first three columns, the names from column 4, a hairline per letter.
        <section className="shell py-32">
          <dl className="border-b border-line">
            {letters.map((letter) => (
              <div key={letter} className="grid grid-cols-12 gap-x-(--gutter) border-t border-line py-4">
                <dt className="col-span-3 font-mono text-sm text-fg-2">{letter}</dt>
                <dd className="col-span-9 brand-index-names">
                  {brands
                    .filter((b) => b[0].toUpperCase() === letter)
                    .map((b) => (
                      <span key={b} className="block">
                        {b}
                      </span>
                    ))}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {concept === "wall" && (
        // The covers' massive type carried on: one name a line, flush left, set solid.
        <section className="overflow-x-clip py-32 [container-type:inline-size]">
          <ol className="shell">
            {brands.map((b, i) => (
              <li key={b} className="brand-wall-name">
                {b}
                <sup className="brand-wall-no">{pad(i)}</sup>
              </li>
            ))}
          </ol>
        </section>
      )}

      {concept === "grid" && (
        // A specimen sheet: hairline cells, number top left, name bottom left.
        <section className="shell py-32">
          <ol className="grid grid-cols-2 border-t border-l border-line md:grid-cols-3 lg:grid-cols-4">
            {brands.map((b, i) => (
              <li
                key={b}
                className="flex aspect-square flex-col justify-between border-r border-b border-line p-4 md:p-6"
              >
                <span className="font-mono text-sm text-fg-2">{pad(i)}</span>
                <span className="brand-grid-name">{b}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {concept === "run" && (
        // One block, flush left and ragged right: the names run on like a paragraph, a yellow slash after each.
        <section className="shell py-32">
          <p className="brand-run">
            {brands.map((b, i) => (
              <span key={b}>
                <span className="whitespace-nowrap">
                  {b}
                  {i < brands.length - 1 && <span className="brand-run-sep">&nbsp;/</span>}
                </span>{" "}
              </span>
            ))}
          </p>
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
