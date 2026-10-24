"use client";

import { useEffect } from "react";

// Lab only. Fits the H1 into the box beside the two-line question: the largest size whose wrapped lines
// fit the question's cap-to-baseline height, then line-height stretched so its last baseline lands on the
// question's. Below MIN_SIZE the H1 drops under the rectangle instead (data-stacked).
const MIN_SIZE = 16;
const BASE_LEADING = 1.2;

function fit(poster: HTMLElement) {
  const question = poster.querySelector<HTMLElement>(".hero-lab-question");
  const copy = poster.querySelector<HTMLElement>(".hero-lab-copy");
  if (!question || !copy) return;

  delete poster.dataset.stacked;
  const cap = parseFloat(getComputedStyle(poster).getPropertyValue("--cap"));
  const target = question.getBoundingClientRect().height;
  const height = (size: number) => {
    copy.style.fontSize = `${size}px`;
    copy.style.lineHeight = String(BASE_LEADING);
    return copy.getBoundingClientRect().height;
  };

  let lo = 8;
  let hi = 160;
  for (let i = 0; i < 20; i++) {
    const mid = (lo + hi) / 2;
    if (height(mid) <= target) lo = mid;
    else hi = mid;
  }

  if (lo < MIN_SIZE) {
    copy.style.fontSize = "";
    copy.style.lineHeight = "";
    poster.dataset.stacked = "";
    return;
  }

  const lines = Math.round((height(lo) - cap * lo) / (BASE_LEADING * lo)) + 1;
  if (lines > 1) copy.style.lineHeight = String((target - cap * lo) / ((lines - 1) * lo));
}

export function RectFit() {
  useEffect(() => {
    const posters = [...document.querySelectorAll<HTMLElement>(".hero-lab-poster")];
    const widths = new Map<Element, number>();
    const observer = new ResizeObserver((entries) => {
      for (const { target, contentRect } of entries) {
        if (widths.get(target) === contentRect.width) continue;
        widths.set(target, contentRect.width);
        fit(target.firstElementChild as HTMLElement);
      }
    });
    posters.forEach((poster) => observer.observe(poster.parentElement!));
    document.fonts.ready.then(() => posters.forEach(fit));
    return () => observer.disconnect();
  }, []);

  return null;
}
