"use client";

import Image from "next/image";
import { useEffect, useRef, type PointerEvent } from "react";

const smoothstep = (from: number, to: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - from) / (to - from)));
  return t * t * (3 - 2 * t);
};

// A post's full-screen cover: the photo under a shade of the page colour, with a big copy of the
// title along the bottom. The site header sits over it, transparent (data-under-header, read by
// site-header.tsx). In dark mode a mouse spotlight clears the shade, using the footer's settings.
//
// As the page scrolls, the big title shrinks and slides onto the real title (#post-title) below,
// then hands over to it; the two wrap differently, so the last stretch is a crossfade. Once it has
// landed, the header's stripes appear (.title-landed). The photo's parallax and deepening shade are
// CSS. Under reduced motion none of this runs and both titles simply stay put. Styles: the "Post
// cover" block in globals.css.
export function PostCover({ src, title }: { src: string; title: string }) {
  const cover = useRef<HTMLElement>(null);
  const bigTitle = useRef<HTMLParagraphElement>(null);
  const frame = useRef(0);

  useEffect(() => {
    const big = bigTitle.current;
    const real = document.getElementById("post-title");
    const header = real?.closest<HTMLElement>(".post-header");
    if (!big || !real || !header || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let dx = 0;
    let dy = 0;
    let scale = 1;
    let end = 1;
    let raf = 0;

    const update = () => {
      // Lands when the real title is 30% down the screen.
      const p = Math.min(1, Math.max(0, window.scrollY / end));
      big.style.transform = `translate(${dx * p}px, ${dy * p}px) scale(${1 + (scale - 1) * p})`;
      const handover = smoothstep(0.8, 1, p);
      big.style.opacity = String(1 - handover);
      real.style.opacity = String(handover);
      header.classList.toggle("title-landed", p >= 1);
    };
    // The two titles move with the page together, so the gap between them only changes on layout.
    const measure = () => {
      big.style.transform = "";
      const from = big.getBoundingClientRect();
      const to = real.getBoundingClientRect();
      dx = to.left - from.left;
      dy = to.top - from.top;
      scale = parseFloat(getComputedStyle(real).fontSize) / parseFloat(getComputedStyle(big).fontSize);
      end = Math.max(1, to.top + window.scrollY - window.innerHeight * 0.3);
      update();
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    header.classList.add("title-morph");
    measure();
    document.fonts.ready.then(measure);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      header.classList.remove("title-morph", "title-landed");
      real.style.opacity = "";
    };
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
      className="post-cover relative -mt-16 h-svh min-h-[32rem] bg-bg"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <div aria-hidden className="absolute inset-0 overflow-hidden">
        <div className="post-cover-media absolute inset-0">
          <Image src={src} alt="" fill priority sizes="100vw" className="object-cover" />
        </div>
        <div className="post-cover-shade absolute inset-0" />
        <div className="post-cover-deepen absolute inset-0 bg-bg" />
      </div>
      <div className="shell relative flex h-full flex-col justify-end pb-e2">
        {/* A visual copy: the real title is the h1 below. */}
        <p
          ref={bigTitle}
          aria-hidden="true"
          className="pointer-events-none relative z-20 max-w-[18ch] origin-top-left font-heading text-[clamp(2.75rem,7vw,7.5rem)] font-semibold leading-[0.92] tracking-[-0.045em] text-fg-max text-balance will-change-transform"
        >
          {title}
        </p>
      </div>
    </section>
  );
}
