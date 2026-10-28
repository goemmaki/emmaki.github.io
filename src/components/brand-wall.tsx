import type { CSSProperties, ReactNode } from "react";
import type { Brand } from "@/lib/content";

// The covers' type carried on, smaller: one name a line, flush left, set solid. Hovering a name
// turns it the brand's color. On wide screens the note, a bordered box, sits in a narrow right column, level with
// the first name, and stays put while the names scroll past; on narrow ones it comes first.
export function BrandWall({ brands, note }: { brands: Brand[]; note: ReactNode }) {
  return (
    <section className="py-32">
      <div className="shell grid gap-e1 lg:grid-cols-[2fr_1fr]">
        <aside className="flex max-w-[48ch] flex-col gap-6 rounded-(--shape-control-radius) border border-line p-6 text-base text-fg-2 lg:sticky lg:max-w-none lg:top-24 lg:order-2 lg:self-start">
          {note}
        </aside>
        <ul className="brand-wall">
          {brands.map((b) => (
            <li
              key={b.name}
              className="brand-wall-name"
              style={b.color ? ({
                "--brand": b.color,
                "--brand-hover-light": b.hoverInk?.light,
                "--brand-hover-dark": b.hoverInk?.dark,
              } as CSSProperties) : undefined}
            >
              {b.name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
