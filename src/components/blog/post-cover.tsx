"use client";

import Image from "next/image";
import { useEffect, useRef, type ReactNode } from "react";

// A post's full-screen cover: the photo, in grayscale, under a shade of the page colour (black, or
// white in light mode), with the title centred on it, left-aligned. The site header sits over it,
// transparent (data-under-header, read by site-header.tsx). Under a mouse the shade clears in a
// spotlight, using the footer's settings, and the photo's colour shows there. In dark mode,
// scrolling plays a parallax, the title rises and fades, and the spotlight splutters and dies as the
// photo pixelates and dissolves into the page. Styles: the "Post cover" block in globals.css.
// The photo's pixelation as it leaves, in dark mode: block sizes in CSS px, stepped like a
// censor's mosaic, over this stretch of the cover's scroll progress (see globals.css).
const PIXEL_STEPS = [0, 6, 10, 16, 26, 40, 64];
const PIXEL_FROM = 0.3;
const PIXEL_TO = 0.72;

// How far down the screen, in px, a spotlight reaches the header's buttons: the header (64) plus
// most of the spotlight's 190px radius.
const HEADER_REACH = 64 + 150;

export function PostCover({ src, children }: { src: string; children: ReactNode }) {
  const cover = useRef<HTMLElement>(null);
  const frame = useRef(0);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const content = useRef<HTMLDivElement>(null);
  const photo = useRef<HTMLDivElement>(null);
  const mosaic = useRef<HTMLCanvasElement>(null);

  // Pixelation: the photo is drawn into a canvas one cell per block, and the browser scales it up
  // without smoothing (image-rendering: pixelated). Redrawn only when the block size steps. Runs
  // only where the scroll choreography does: dark mode, motion allowed, scroll-driven animations.
  useEffect(() => {
    const view = photo.current;
    const canvas = mosaic.current;
    const img = view?.querySelector("img");
    if (!view || !canvas || !img) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const motion = window.matchMedia("(prefers-reduced-motion: no-preference)");
    const supported = CSS.supports("animation-timeline: scroll()");
    let drawn = -1;
    let raf = 0;
    const draw = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const active = supported && motion.matches && document.documentElement.dataset.theme === "dark";
        const progress = window.scrollY / (2 * view.offsetHeight);
        const at = (progress - PIXEL_FROM) / (PIXEL_TO - PIXEL_FROM);
        const step = !active || at <= 0 || !img.complete ? 0 : Math.min(PIXEL_STEPS.length - 1, 1 + Math.floor(at * (PIXEL_STEPS.length - 1)));
        if (step === drawn) return;
        drawn = step;
        canvas.hidden = step === 0;
        if (step === 0) return;
        // The canvas fills the same box as the photo; crop the photo the way object-cover does.
        const box = canvas.getBoundingClientRect();
        const block = PIXEL_STEPS[step];
        const w = Math.max(1, Math.round(box.width / block));
        const h = Math.max(1, Math.round(box.height / block));
        const scale = Math.max(box.width / img.naturalWidth, box.height / img.naturalHeight);
        const sw = box.width / scale;
        const sh = box.height / scale;
        canvas.width = w;
        canvas.height = h;
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = "high";
        context.drawImage(img, (img.naturalWidth - sw) / 2, (img.naturalHeight - sh) / 2, sw, sh, 0, 0, w, h);
      });
    };
    const redraw = () => {
      drawn = -1;
      draw();
    };
    draw();
    window.addEventListener("scroll", draw, { passive: true });
    window.addEventListener("resize", redraw);
    img.addEventListener("load", redraw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", draw);
      window.removeEventListener("resize", redraw);
      img.removeEventListener("load", redraw);
    };
  }, []);

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

  // The mouse is followed on the whole window, not the cover, so the spotlight keeps working under
  // the site header, which overlaps the cover's top and takes its pointer events. It is placed in
  // the photo frame's coordinates, so it is placed again on scroll to stay under a mouse that isn't
  // moving. While a live spotlight reaches the header, data-cover-torch on <html> turns the header's
  // buttons white so the lit photo doesn't swallow them (globals.css).
  useEffect(() => {
    const el = cover.current;
    const view = photo.current;
    if (!el || !view) return;
    const shade = view.querySelector<HTMLElement>(".post-cover-shade")!;
    const root = document.documentElement;
    const place = () => {
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        const box = view.getBoundingClientRect();
        const p = pointer.current;
        const inside = !!p && p.x >= box.left && p.x < box.right && p.y >= box.top && p.y < box.bottom;
        el.classList.toggle("cover-lit", inside);
        const power = parseFloat(getComputedStyle(shade).getPropertyValue("--cover-power"));
        root.toggleAttribute("data-cover-torch", inside && p.y < HEADER_REACH && power > 0.3);
        if (!inside) return;
        el.style.setProperty("--cover-x", `${p.x - box.left}px`);
        el.style.setProperty("--cover-y", `${p.y - box.top}px`);
      });
    };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pointer.current = { x: event.clientX, y: event.clientY };
      place();
    };
    const onLeave = () => {
      pointer.current = null;
      place();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", place, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame.current);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", place);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      root.removeAttribute("data-cover-torch");
    };
  }, []);

  return (
    // In dark mode the section is taller than the screen and the photo frame stays pinned for the
    // extra length, so the choreography has room to play (globals.css).
    <section ref={cover} data-under-header className="post-cover relative -mt-16 h-svh min-h-[32rem] bg-bg">
      <div ref={photo} className="sticky top-0 h-svh min-h-[32rem] overflow-hidden">
        <div className="post-cover-media absolute inset-0">
          <Image src={src} alt="" fill priority sizes="100vw" className="object-cover" />
          <canvas ref={mosaic} hidden aria-hidden className="absolute inset-0 size-full [image-rendering:pixelated]" />
        </div>
        <div aria-hidden className="post-cover-shade absolute inset-0" />
        <div aria-hidden className="post-cover-dim absolute inset-0 bg-bg" />
        <div aria-hidden className="post-cover-fade absolute inset-x-0 bottom-0 h-3/5" />
        <div ref={content} className="post-cover-title shell relative flex h-full items-center justify-center pt-16 text-left">
          {children}
        </div>
      </div>
    </section>
  );
}
