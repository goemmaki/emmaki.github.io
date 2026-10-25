"use client";

import Image from "next/image";
import { useEffect, useRef, type PointerEvent, type ReactNode } from "react";

// A post's full-screen cover: the photo, in grayscale, under a shade of the page colour (black, or
// white in light mode), with the title centred on it, left-aligned. The site header sits over it,
// transparent (data-under-header, read by site-header.tsx). Under a mouse the shade clears in a
// spotlight, using the footer's settings, and the photo's colour shows there. In dark mode,
// scrolling plays a parallax, the title rises and fades, and the spotlight splutters and dies as the
// photo dissolves into the page. Styles: the "Post cover" block in globals.css.
export function PostCover({ src, children }: { src: string; children: ReactNode }) {
  const cover = useRef<HTMLElement>(null);
  const frame = useRef(0);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const content = useRef<HTMLDivElement>(null);

  // A wrapped title's box keeps its full max-width, so centring it would push the lines left. Shrink
  // the box to its longest line on every resize so the block centres on what you see.
  useEffect(() => {
    const title = content.current?.firstElementChild as HTMLElement | null;
    if (!title) return;
    const fit = () => {
      title.style.width = "";
      const range = document.createRange();
      range.selectNodeContents(title);
      const lines = [...range.getClientRects()];
      const left = Math.min(...lines.map((line) => line.left));
      const right = Math.max(...lines.map((line) => line.right));
      title.style.width = `${Math.ceil(right - left)}px`;
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(content.current!);
    document.fonts.ready.then(fit);
    return () => observer.disconnect();
  }, []);

  // The spotlight is placed in the cover's coordinates, so it is placed again on scroll to stay
  // under a mouse that isn't moving.
  const place = () => {
    const el = cover.current;
    if (!el || !pointer.current) return;
    const { x, y } = pointer.current;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const box = el.getBoundingClientRect();
      el.style.setProperty("--cover-x", `${x - box.left}px`);
      el.style.setProperty("--cover-y", `${y - box.top}px`);
      el.classList.add("cover-lit");
    });
  };
  const onMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse") return;
    pointer.current = { x: event.clientX, y: event.clientY };
    place();
  };
  const onLeave = () => {
    pointer.current = null;
    cancelAnimationFrame(frame.current);
    cover.current?.classList.remove("cover-lit");
  };

  useEffect(() => {
    window.addEventListener("scroll", place, { passive: true });
    return () => window.removeEventListener("scroll", place);
  });

  return (
    <section
      ref={cover}
      data-under-header
      className="post-cover relative -mt-16 h-svh min-h-[32rem] overflow-hidden bg-bg"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <div className="post-cover-media absolute inset-0">
        <Image src={src} alt="" fill priority sizes="100vw" className="object-cover" />
      </div>
      <div aria-hidden className="post-cover-shade absolute inset-0" />
      <div aria-hidden className="post-cover-dim absolute inset-0 bg-bg" />
      <div aria-hidden className="post-cover-fade absolute inset-x-0 bottom-0 h-2/5" />
      <div ref={content} className="post-cover-title shell relative flex h-full items-center justify-center pt-16 text-left">
        {children}
      </div>
    </section>
  );
}
