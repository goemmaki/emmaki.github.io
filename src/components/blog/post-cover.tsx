"use client";

import Image from "next/image";
import { useEffect, useRef, type PointerEvent, type ReactNode } from "react";

// A post's full-screen cover: the photo, in grayscale, under a shade of the page colour (black, or
// white in light mode), with the title centred on it, left-aligned. The site header sits over it,
// transparent (data-under-header, read by site-header.tsx). Under a mouse the shade clears in a
// spotlight, using the footer's settings, and the photo's colour shows there. Styles: the "Post
// cover" block in globals.css.
export function PostCover({ src, children }: { src: string; children: ReactNode }) {
  const cover = useRef<HTMLElement>(null);
  const frame = useRef(0);
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

  const onMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse" || !cover.current) return;
    const el = cover.current;
    const box = el.getBoundingClientRect();
    const x = event.clientX - box.left;
    const y = event.clientY - box.top;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.style.setProperty("--cover-x", `${x}px`);
      el.style.setProperty("--cover-y", `${y}px`);
      el.classList.add("cover-lit");
    });
  };
  const onLeave = () => {
    cancelAnimationFrame(frame.current);
    cover.current?.classList.remove("cover-lit");
  };

  return (
    <section
      ref={cover}
      data-under-header
      className="post-cover relative -mt-16 h-svh min-h-[32rem] overflow-hidden bg-bg"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <Image src={src} alt="" fill priority sizes="100vw" className="object-cover" />
      <div aria-hidden className="post-cover-shade absolute inset-0" />
      <div ref={content} className="shell relative flex h-full items-center justify-center pt-16 text-left">{children}</div>
    </section>
  );
}
