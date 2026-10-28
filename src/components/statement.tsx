"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState, type PointerEvent } from "react";

export type StatementLink = { text: string; href: string; metric: string; summary: string; client: string };

// The positioning line with its proof inside it, after grafit.agency's "Who we are": each highlighted
// phrase links to the case study behind it, and under a mouse a preview card (the result as a figure,
// a line on the work, the client) scales in and trails the pointer. Touch and keyboard go straight to
// the link; screen readers get the preview's text inside the link. Styles: "Statement" in globals.css.
export function Statement({
  kicker,
  before,
  links,
  after,
}: {
  kicker: string;
  before: string;
  links: StatementLink[];
  after: string;
}) {
  const [active, setActive] = useState<number | null>(null);
  // The last phrase hovered stays in the card while it scales out.
  const [shown, setShown] = useState(0);
  const card = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0, tx: 0, ty: 0, frame: 0, placed: false });

  useEffect(() => () => cancelAnimationFrame(pos.current.frame), []);

  // The card's corner sits just below and right of the pointer, kept inside the window, and eases
  // after it (instantly with reduced motion).
  const onMove = (event: PointerEvent<HTMLElement>) => {
    const el = card.current;
    if (event.pointerType !== "mouse" || !el) return;
    const p = pos.current;
    p.tx = Math.min(event.clientX + 20, innerWidth - el.offsetWidth - 16);
    p.ty = Math.min(event.clientY + 20, innerHeight - el.offsetHeight - 16);
    if (!p.placed) Object.assign(p, { x: p.tx, y: p.ty, placed: true });
    const k = matchMedia("(prefers-reduced-motion: reduce)").matches ? 1 : 0.16;
    const tick = () => {
      p.x += (p.tx - p.x) * k;
      p.y += (p.ty - p.y) * k;
      el.style.translate = `${p.x}px ${p.y}px`;
      p.frame = Math.abs(p.tx - p.x) + Math.abs(p.ty - p.y) > 0.5 ? requestAnimationFrame(tick) : 0;
    };
    if (!p.frame) p.frame = requestAnimationFrame(tick);
  };

  const preview = links[shown];
  return (
    <section className="shell pt-32" onPointerMove={onMove}>
      <p className="type-meta text-fg-2 uppercase">{kicker}</p>
      <h2 className="mt-6 max-w-[26ch] type-h1 text-fg-max">
        {before}{" "}
        {links.map((link, i) => {
          // Each phrase keeps the punctuation after it on its line, so no line starts with a comma.
          const last = i === links.length - 1;
          const mark = last ? (after.match(/^[^\s]*/)?.[0] ?? "") : ",";
          return (
            <Fragment key={link.text}>
              <span className="whitespace-nowrap">
                <Link
                  href={link.href}
                  className="statement-link"
                  onPointerEnter={(e) => {
                    if (e.pointerType !== "mouse") return;
                    setActive(i);
                    setShown(i);
                  }}
                  onPointerLeave={() => setActive(null)}
                >
                  {link.text}
                  <ArrowUpRight className="statement-link-icon" aria-hidden />
                  <span className="sr-only">
                    {" "}
                    (case study: {link.metric}, {link.summary}, {link.client})
                  </span>
                </Link>
                {mark}
              </span>
              {last ? after.slice(mark.length) : " "}
            </Fragment>
          );
        })}
      </h2>
      <div ref={card} className="statement-preview" data-open={active !== null || undefined} aria-hidden>
        <div className="statement-preview-inner">
          <p className="type-h3">{preview.metric}</p>
          <p className="mt-1 type-secondary">{preview.summary}</p>
          <p className="mt-auto type-meta uppercase">{preview.client}</p>
        </div>
      </div>
    </section>
  );
}
