"use client";

import { useEffect } from "react";

// Lab only. Closes the hero's rectangle on the headline's own letters: the question's H stems sit on
// the A's foot and the question ends under the S of OPS; the justified H1 starts under the H of HERE,
// with its cap height and last baseline on the question's, at the size that stretches its word spaces
// least (best fit). Below MIN_SIZE the H1 drops under the rectangle instead (data-stacked).
// Background and rejected tests: Studio docs/research/hero-type-fitting-20261025.md.
const MIN_SIZE = 16;
const BASE_LEADING = 1.2;
const MAX_LEADING = 1.5; // best fit never opens the lines wider than this
const BEST_FIT_RANGE = 0.15; // how much of the largest size best fit may give up
const BEST_FIT_STEPS = 30;
const STACKED_RANGE = [0.9, 1.15]; // stacked best fit, as a share of the CSS size

const cssNumber = (el: Element, name: string) => parseFloat(getComputedStyle(el).getPropertyValue(name));

// Right edge of each rendered line of el, top to bottom, from its text (sparkle SVGs have none).
function lineRights(el: HTMLElement, size: number) {
  const rows: { mid: number; right: number }[] = [];
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (!node.textContent?.trim()) continue;
    const range = document.createRange();
    range.selectNodeContents(node);
    for (const rect of range.getClientRects()) {
      if (!rect.width) continue;
      const mid = (rect.top + rect.bottom) / 2;
      const row = rows.find((r) => Math.abs(r.mid - mid) < size / 2);
      if (row) row.right = Math.max(row.right, rect.right);
      else rows.push({ mid, right: rect.right });
    }
  }
  return rows.sort((a, b) => a.mid - b.mid).map((r) => r.right);
}

// Best fit's measure: how far the worst non-final line falls short of the H1's right edge when set
// ragged, in ems.
function unevenness(copy: HTMLElement, size: number) {
  copy.style.textAlign = "left";
  const edge = copy.getBoundingClientRect().left + copy.clientWidth;
  const gaps = lineRights(copy, size).map((right) => edge - right);
  copy.style.textAlign = "";
  return Math.max(0, ...gaps.slice(0, -1)) / size;
}

let canvas: HTMLCanvasElement | undefined;

// Ink edges of one rendered character, from its advance box and the canvas's glyph bounds.
function inkEdges(node: Node, index: number) {
  const range = document.createRange();
  range.setStart(node, index);
  range.setEnd(node, index + 1);
  const left = range.getBoundingClientRect().left;
  const style = getComputedStyle(node.parentElement!);
  const char = node.textContent![index];
  const context = (canvas ??= document.createElement("canvas")).getContext("2d")!;
  context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  const glyph = context.measureText(style.textTransform === "uppercase" ? char.toUpperCase() : char);
  return { left: left - glyph.actualBoundingBoxLeft, right: left + glyph.actualBoundingBoxRight };
}

// Puts the question's H stems on the left axis, the ink of the headline's first letter (the A's foot),
// replacing the CSS optical margin with a measured one.
function alignLeft(poster: HTMLElement, question: HTMLElement) {
  const headline = poster.querySelector<HTMLElement>(".hero-lab-headline")!;
  const axis = inkEdges(headline.firstElementChild!.firstChild!, 0).left;
  const starts = [...question.children].map((el) => inkEdges(el.firstChild!, 0).left);
  const margin = parseFloat(getComputedStyle(question).marginLeft);
  question.style.marginLeft = `${margin + axis - Math.min(...starts)}px`;
}

// Sizes the question (--r) so its widest line ends under the S of OPS, then sets the gap so the H1's
// first letter starts under the H of HERE: the gap becomes the headline's word space. --r also moves
// Hello and so the headline, so it iterates.
function alignToOps(poster: HTMLElement, question: HTMLElement, copy: HTMLElement) {
  const bottom = poster.querySelector<HTMLElement>(".hero-lab-bottom")!;
  const line = poster.querySelector<HTMLElement>(".hero-lab-headline")!.lastElementChild!.firstChild!;
  const text = (line.textContent ?? "").toLowerCase();
  const h = text.indexOf("here");
  const s = text.indexOf("ops") + 2;
  const lineEnds = [...question.children].map((el) => el.firstChild!);
  const questionInkRight = () =>
    Math.max(...lineEnds.map((node) => inkEdges(node, node.textContent!.trimEnd().length - 1).right));

  let r = cssNumber(poster, "--r");
  for (let i = 0; i < 20; i++) {
    const left = question.getBoundingClientRect().left;
    r *= (inkEdges(line, s).right - left) / (questionInkRight() - left);
    poster.style.setProperty("--r", String(r));
    alignLeft(poster, question);
  }

  // The H1's first letter has its own side bearing; take it off so the two inks meet, not the boxes.
  const walker = document.createTreeWalker(copy, NodeFilter.SHOW_TEXT);
  let first = walker.nextNode();
  while (first && !first.textContent?.trim()) first = walker.nextNode();
  const bearing = first ? inkEdges(first, first.textContent!.search(/\S/)).left - copy.getBoundingClientRect().left : 0;
  bottom.style.columnGap = `${inkEdges(line, h).left - bearing - question.getBoundingClientRect().right}px`;
}

function fit(poster: HTMLElement) {
  const question = poster.querySelector<HTMLElement>(".hero-lab-question");
  const copy = poster.querySelector<HTMLElement>(".hero-lab-copy");
  if (!question || !copy) return;

  delete poster.dataset.stacked;
  poster.style.removeProperty("--r");
  poster.querySelector<HTMLElement>(".hero-lab-bottom")!.style.columnGap = "";
  question.style.marginLeft = "";
  alignToOps(poster, question, copy);
  const cap = cssNumber(poster, "--cap");
  const target = question.getBoundingClientRect().height;
  const height = (size: number) => {
    copy.style.fontSize = `${size}px`;
    copy.style.lineHeight = String(BASE_LEADING);
    return copy.getBoundingClientRect().height;
  };
  const lineCount = (size: number) => Math.round((height(size) - cap * size) / (BASE_LEADING * size)) + 1;

  let lo = 8;
  let hi = 160;
  for (let i = 0; i < 20; i++) {
    const mid = (lo + hi) / 2;
    if (height(mid) <= target) lo = mid;
    else hi = mid;
  }

  // Stacked: CSS sizes the question to the column and best fit searches around the CSS H1 size.
  if (lo < MIN_SIZE) {
    copy.style.fontSize = "";
    copy.style.lineHeight = "";
    poster.style.removeProperty("--r");
    poster.querySelector<HTMLElement>(".hero-lab-bottom")!.style.columnGap = "";
    poster.dataset.stacked = "";
    const base = parseFloat(getComputedStyle(copy).fontSize);
    let best = base;
    let bestCost = Infinity;
    for (let k = 0; k <= BEST_FIT_STEPS; k++) {
      const s = base * (STACKED_RANGE[0] + ((STACKED_RANGE[1] - STACKED_RANGE[0]) * k) / BEST_FIT_STEPS);
      copy.style.fontSize = `${s}px`;
      const cost = unevenness(copy, s);
      if (cost < bestCost - 0.1) {
        bestCost = cost;
        best = s;
      }
    }
    copy.style.fontSize = `${best}px`;
    alignLeft(poster, question);
    return;
  }

  // Best fit: from the largest size down, keep the size whose worst non-final line falls least short,
  // so justifying stretches the word spaces least. Only clear wins beat a bigger size.
  let size = lo;
  let bestCost = Infinity;
  for (let k = 0; k <= BEST_FIT_STEPS; k++) {
    const s = lo * (1 - (BEST_FIT_RANGE * k) / BEST_FIT_STEPS);
    const lines = lineCount(s);
    if (lines < 2 || (target - cap * s) / ((lines - 1) * s) > MAX_LEADING) continue;
    const cost = unevenness(copy, s);
    if (cost < bestCost - 0.1) {
      bestCost = cost;
      size = s;
    }
  }

  const lines = lineCount(size);
  if (lines > 1) copy.style.lineHeight = String((target - cap * size) / ((lines - 1) * size));
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
