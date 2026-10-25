"use client";

import Image from "next/image";
import { useRef, type PointerEvent, type ReactNode } from "react";

// A post's full-screen cover: the photo under a dark shade, with the title and byline along the
// bottom. The site header sits over it, transparent (data-under-header, read by site-header.tsx).
// Under a mouse the shade clears in a spotlight, using the footer's settings. Styles: the "Post
// cover" block in globals.css.
export function PostCover({ src, children }: { src: string; children: ReactNode }) {
  const cover = useRef<HTMLElement>(null);
  const frame = useRef(0);

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
      className="post-cover relative -mt-16 h-svh min-h-[32rem] overflow-hidden bg-black text-white"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <Image src={src} alt="" fill priority sizes="100vw" className="object-cover" />
      <div aria-hidden className="post-cover-shade absolute inset-0" />
      <div className="shell relative flex h-full flex-col justify-end pb-e2">{children}</div>
    </section>
  );
}
