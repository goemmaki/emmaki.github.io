"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { HeroGlyph } from "@/components/glyphs/hero-glyph";
import { tools } from "@/lib/content";

/*
 * Entry choreography (GSAP): rules extend, the mark's outlines draw, the
 * counters drop into place, the clauses rise. Only runs when <html> carries
 * `.intro` (set pre-paint, never under reduced motion), and only once per load.
 */
function useHeroIntro(scope: React.RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains("intro") || !scope.current) return;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(scope);
      const all = q("[data-intro]");
      gsap.set(all, { autoAlpha: 0 });
      root.classList.remove("intro");

      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.set(q("[data-intro]:not([data-intro='fade'])"), { autoAlpha: 1 })
        .from(q("[data-intro='rule-x']"), { scaleX: 0, transformOrigin: "0 50%", duration: 1.4, stagger: 0.08 }, 0)
        .from(q("[data-intro='rule-y']"), { scaleY: 0, transformOrigin: "50% 0", duration: 1.4, stagger: 0.08 }, 0.1)
        .fromTo(q("[data-glyph-outline] > *"), { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut", stagger: 0.15, clearProps: "strokeDashoffset,strokeDasharray" }, 0.15)
        .from(q("[data-intro='glyph-a'] [clip-path]"), { autoAlpha: 0, y: -60, duration: 1.1 }, 0.7)
        .from(q("[data-intro='glyph-b'] [clip-path]"), { autoAlpha: 0, y: 60, duration: 1.1 }, 0.85)
        .from(q("[data-intro='line'] > span"), { yPercent: 110, duration: 1.1, stagger: 0.07 }, 0.35)
        .fromTo(q("[data-intro='fade']"), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.06, ease: "power2.out" }, 1.1);
    }, scope);

    return () => {
      ctx.revert();
      root.classList.remove("intro");
    };
  }, [scope]);
}

function Line({ children }: { children: React.ReactNode }) {
  return (
    <span data-intro="line" className="block overflow-hidden pb-[0.08em]">
      <span className="block">{children}</span>
    </span>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  useHeroIntro(ref);

  return (
    <section ref={ref} className="relative overflow-hidden">
      {/* drafting rails */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden>
        <div className="shell relative h-full">
          <span data-intro="rule-y" className="absolute inset-y-0 left-0 w-px bg-line" />
          <span data-intro="rule-y" className="absolute inset-y-0 right-0 w-px bg-line" />
        </div>
      </div>

      <div className="shell relative">
        <div className="grid min-h-[calc(100svh-var(--header-h)-7rem)] grid-cols-1 gap-8 py-e1 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-e1 lg:py-e2 lg:pl-e1">
          <div className="flex flex-col">
            <p data-intro="fade" className="mb-8 type-meta text-fg-muted">
              Emmaki — senior copywriter &amp; AI content strategist
            </p>
            <h1 className="flex flex-1 flex-col justify-between gap-e1 type-mega">
              <span className="block text-fg-max">
                <Line>The writing</Line>
                <Line>makes it clear</Line>
                <span className="sr-only">;</span>
              </span>
              <span className="block text-fg-muted">
                <Line>the systems</Line>
                <Line>make it scale.</Line>
              </span>
            </h1>
          </div>

          <div className="flex items-center justify-center lg:justify-end">
            <HeroGlyph markClassName="h-[min(44svh,320px)] w-[min(22svh,160px)] lg:h-[min(64svh,600px)] lg:w-[min(32svh,300px)]" />
          </div>
        </div>
      </div>

      {/* meta strip */}
      <div className="relative">
        <span data-intro="rule-x" className="absolute inset-x-0 top-0 h-px bg-line" aria-hidden />
        <div className="shell">
          <dl className="grid grid-cols-1 gap-4 py-6 type-meta sm:grid-cols-3 lg:pl-e1">
            <div data-intro="fade">
              <dt className="text-fg-muted">Writes</dt>
              <dd className="text-fg">Positioning, launch &amp; sales copy</dd>
            </div>
            <div data-intro="fade">
              <dt className="text-fg-muted">Builds</dt>
              <dd className="text-fg">AI content systems &amp; workflows</dd>
            </div>
            <div data-intro="fade">
              <dt className="text-fg-muted">Works in</dt>
              <dd className="text-fg">{tools.join(" · ")}</dd>
            </div>
          </dl>
        </div>
        <span data-intro="rule-x" className="absolute inset-x-0 bottom-0 h-px bg-line" aria-hidden />
      </div>
    </section>
  );
}
