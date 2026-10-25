"use client";

import { useEffect, useRef } from "react";

// Notches per gap between two headings. Notch pitch (1px + 4px) × 6 = 30px, the
// list's pitch (18px line + 12px gap), so every sixth notch sits level with a heading.
const TICKS_PER_SECTION = 6;
// Where a heading counts as reached, and where a clicked heading lands, in px from the top.
const OFFSET = 112;

export type TocEntry = { id: string; text: string };

/**
 * The post's headings beside a rail of notches. A brighter, wider cluster of
 * notches slides down the rail as the reader moves through the post, and the
 * nearest heading brightens (grafit.agency's article TOC).
 */
export function PostToc({ entries }: { entries: TocEntry[] }) {
  const railRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const ticks = Array.from(railRef.current?.children ?? []) as HTMLElement[];
    const links = Array.from(listRef.current?.querySelectorAll("a") ?? []);
    const headings = entries.map(({ id }) => document.getElementById(id));
    if (headings.some((heading) => !heading)) throw new Error("PostToc: a heading id is missing from the page");

    // Fractional position through the headings: 1.5 is halfway from the second to the third.
    function progress() {
      const y = window.scrollY + OFFSET;
      const tops = headings.map((heading) => heading!.getBoundingClientRect().top + window.scrollY);
      const last = tops.length - 1;
      if (y <= tops[0]) return 0;
      if (y >= tops[last]) return last;
      const i = tops.findLastIndex((top) => top <= y);
      return i + (y - tops[i]) / Math.max(1, tops[i + 1] - tops[i]);
    }

    let frame = 0;
    function update() {
      frame = 0;
      const p = progress();
      ticks.forEach((tick, r) => {
        const w = Math.max(0, 1 - Math.abs(r - p * TICKS_PER_SECTION) / 3) ** 3;
        tick.style.backgroundColor = `color-mix(in oklab, var(--color-fg-max) ${w * 100}%, var(--color-fg-muted))`;
        tick.style.transform = `scaleX(${1 + w})`;
      });
      links.forEach((link, k) => {
        link.style.setProperty("--near", String(Math.max(0, 1 - Math.abs(k - p)) ** 2));
        if (k === Math.round(p)) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [entries]);

  function jump(event: React.MouseEvent<HTMLAnchorElement>, id: string) {
    const heading = document.getElementById(id);
    if (!heading) return;
    event.preventDefault();
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({
      top: heading.getBoundingClientRect().top + window.scrollY - OFFSET,
      behavior: reduce ? "auto" : "smooth",
    });
    history.replaceState(null, "", `#${id}`);
    heading.focus({ preventScroll: true });
  }

  return (
    <nav aria-label="On this page" className="relative pl-10">
      <div ref={railRef} aria-hidden className="absolute left-0 top-[8.5px] flex flex-col gap-1">
        {Array.from({ length: (entries.length - 1) * TICKS_PER_SECTION + 1 }, (_, r) => (
          <div key={r} className="h-px w-3 origin-left bg-fg-muted" />
        ))}
      </div>
      <ol ref={listRef} className="flex flex-col gap-3 font-sans text-sm leading-[18px]">
        {entries.map(({ id, text }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              onClick={(event) => jump(event, id)}
              className="block truncate [color:color-mix(in_oklab,var(--color-fg-max)_calc(var(--near,0)*100%),var(--color-fg-2))] hover:text-fg-max focus-visible:text-fg-max"
            >
              {text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
