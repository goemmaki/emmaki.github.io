import type { CSSProperties } from "react";

// color: the brand's colour, for its name on hover. Leave it out for a black (or near-black) brand:
// its name keeps the page's ink.
export type Brand = { name: string; color?: string };

// The covers' type carried on, smaller: one name a line, flush left, set solid. Hovering a name
// turns it the brand's colour.
export function BrandWall({ brands }: { brands: Brand[] }) {
  return (
    <section className="py-32">
      <ul className="brand-wall shell">
        {brands.map((b) => (
          <li key={b.name} className="brand-wall-name" style={b.color ? ({ "--brand": b.color } as CSSProperties) : undefined}>
            {b.name}
          </li>
        ))}
      </ul>
    </section>
  );
}
