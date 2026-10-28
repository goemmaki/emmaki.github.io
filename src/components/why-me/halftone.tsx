"use client";

import { useEffect, useRef } from "react";

// The only procedural poster. All frame work belongs to this leaf and ends on leave.
export function Halftone() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const box = canvas?.closest<HTMLElement>(".why-me-proof-box");
    const context = canvas?.getContext("2d");
    if (!canvas || !box || !context) return;

    const enabled = matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    let frame = 0;
    let active = false;
    let entered = 0;
    let bounds = box.getBoundingClientRect();
    let targetX = 160;
    let targetY = 100;
    let x = targetX;
    let y = targetY;
    let previous = 0;

    function stop() {
      active = false;
      cancelAnimationFrame(frame);
      frame = 0;
      context!.clearRect(0, 0, 320, 320);
    }

    function drawHalftone(now: number) {
      if (!active) return;
      // Time-based interpolation keeps the response consistent at different refresh rates.
      const follow = 1 - Math.exp(-Math.min(now - previous, 64) / 85);
      previous = now;
      x += (targetX - x) * follow;
      y += (targetY - y) * follow;
      const elapsed = now - entered;
      const reach = Math.min(440, 24 + elapsed * .55);
      context!.clearRect(0, 0, 320, 320);
      context!.fillStyle = getComputedStyle(canvas!).color;
      context!.beginPath();
      for (let row = 0; row < 23; row++) {
        for (let column = 0; column < 23; column++) {
          const px = column * 15;
          const py = row * 15;
          const distance = Math.hypot(px - x, py - y);
          const density = Math.max(0, 1 - distance / reach);
          const wave = .5 + .5 * Math.cos(distance / 34 - elapsed / 1100);
          const radius = .65 + density * (2.5 + wave * 3.1);
          context!.moveTo(px + radius, py);
          context!.arc(px, py, radius, 0, Math.PI * 2);
        }
      }
      context!.fill();
      frame = requestAnimationFrame(drawHalftone);
    }

    function move(event: PointerEvent) {
      bounds = box!.getBoundingClientRect();
      targetX = (event.clientX - bounds.left) / bounds.width * 320;
      targetY = (event.clientY - bounds.top) / bounds.height * 320;
    }

    function start(event?: PointerEvent) {
      if (!enabled.matches || document.hidden || active) return;
      bounds = box!.getBoundingClientRect();
      const ratio = Math.min(devicePixelRatio || 1, 2);
      canvas!.width = Math.round(bounds.width * ratio);
      canvas!.height = Math.round(bounds.height * ratio);
      context!.setTransform(canvas!.width / 320, 0, 0, canvas!.height / 320, 0, 0);
      if (event) move(event);
      x = targetX;
      y = targetY;
      active = true;
      previous = entered = performance.now();
      frame = requestAnimationFrame(drawHalftone);
    }

    function refresh() {
      stop();
      if (box!.matches(":hover")) start();
    }

    box.addEventListener("pointerenter", start);
    box.addEventListener("pointermove", move, { passive: true });
    box.addEventListener("pointerleave", stop);
    box.addEventListener("pointercancel", stop);
    enabled.addEventListener("change", refresh);
    document.addEventListener("visibilitychange", refresh);
    window.addEventListener("resize", refresh);
    return () => {
      stop();
      box.removeEventListener("pointerenter", start);
      box.removeEventListener("pointermove", move);
      box.removeEventListener("pointerleave", stop);
      box.removeEventListener("pointercancel", stop);
      enabled.removeEventListener("change", refresh);
      document.removeEventListener("visibilitychange", refresh);
      window.removeEventListener("resize", refresh);
    };
  }, []);

  return <canvas ref={ref} className="why-me-poster why-me-poster-3" aria-hidden="true" />;
}
