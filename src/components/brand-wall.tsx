"use client";

import { useEffect, useRef, useState } from "react";

export type Brand = { name: string; logo?: string; color?: string };

const pad = (n: number) => String(n + 1).padStart(2, "0");

// The hover card, standardised: every logo is drawn in one ink on the brand's colour (a neutral card
// where none is known), at the screen's full resolution. The ink is white or black, whichever has
// more contrast with the card. A brand without a logo file gets its name
// set in the wall's type instead.
const CARD = { w: 240, h: 180 };
const LOGO_BOX = { w: 0.7, h: 0.36 }; // the share of the card a logo may fill
const NEUTRAL = "#2a2a2a";

// The logo drawn once at its own size, and the box around its visible pixels, so files padded with
// empty space size like the rest. Cropping from this copy, not the image, keeps SVGs exact. An SVG
// without a pixel size is drawn 1000px square.
function inkBox(img: HTMLImageElement) {
  const w = img.naturalWidth || 1000;
  const h = img.naturalHeight || 1000;
  const c = document.createElement("canvas").getContext("2d", { willReadFrequently: true })!;
  c.canvas.width = w;
  c.canvas.height = h;
  c.drawImage(img, 0, 0, w, h);
  const { data } = c.getImageData(0, 0, w, h);
  let [x0, y0, x1, y1] = [w, h, -1, -1];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (data[(y * w + x) * 4 + 3] < 16) continue;
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
    }
  }
  const source = c.canvas;
  return x1 < 0 ? { source, x: 0, y: 0, w, h } : { source, x: x0, y: y0, w: x1 - x0 + 1, h: y1 - y0 + 1 };
}

// White or black, whichever contrasts more with hex (WCAG relative luminance).
function inkFor(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  const l = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return 1.05 / (l + 0.05) >= (l + 0.05) / 0.05 ? "#fff" : "#000";
}

function LogoCard({ brand, font, x, y }: { brand: Brand; font: string; x: number; y: number }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current;
    const c = el?.getContext("2d");
    if (!el || !c) return;
    const dpr = devicePixelRatio || 1;
    el.width = CARD.w * dpr;
    el.height = CARD.h * dpr;
    const cols = el.width;
    const rows = el.height;
    const paint = (draw: () => void) => {
      c.clearRect(0, 0, cols, rows);
      c.globalCompositeOperation = "source-over";
      draw();
      // Recolour whatever was drawn to the ink, keeping its shape and soft edges.
      c.globalCompositeOperation = "source-in";
      c.fillStyle = inkFor(brand.color ?? NEUTRAL);
      c.fillRect(0, 0, cols, rows);
    };
    if (!brand.logo) {
      paint(() => {
        let size = rows * 0.22;
        c.font = `600 ${size}px ${font}`;
        size = Math.min(size, (size * cols * LOGO_BOX.w) / c.measureText(brand.name).width);
        c.font = `600 ${size}px ${font}`;
        c.textAlign = "center";
        c.textBaseline = "middle";
        c.fillText(brand.name, cols / 2, rows / 2);
      });
      return;
    }
    let live = true;
    const img = new Image();
    img.src = brand.logo;
    img
      .decode()
      .then(() => {
        if (!live || !img.naturalWidth) return; // a broken logo leaves the card plain
        const ink = inkBox(img);
        const scale = Math.min((cols * LOGO_BOX.w) / ink.w, (rows * LOGO_BOX.h) / ink.h);
        const w = ink.w * scale;
        const h = ink.h * scale;
        paint(() => c.drawImage(ink.source, ink.x, ink.y, ink.w, ink.h, (cols - w) / 2, (rows - h) / 2, w, h));
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [brand, font]);

  return (
    <div
      aria-hidden="true"
      className="brand-peek"
      style={{ left: x, top: y, background: brand.color ?? NEUTRAL }}
    >
      <canvas ref={canvas} />
    </div>
  );
}

// The covers' massive type carried on: one name a line, flush left, set solid, numbered. Hovering a
// name (mouse only) brings up its logo card by the pointer.
export function BrandWall({ brands }: { brands: Brand[] }) {
  const list = useRef<HTMLOListElement>(null);
  const [peek, setPeek] = useState<{ brand: Brand; x: number; y: number } | null>(null);
  const [font, setFont] = useState("sans-serif");

  // The canvas sets names in the wall's own font, read once it's on the page.
  useEffect(() => {
    if (list.current) setFont(getComputedStyle(list.current).fontFamily);
  }, []);

  return (
    <section className="overflow-x-clip py-32 [container-type:inline-size]">
      <ol ref={list} className="brand-wall shell">
        {brands.map((b, i) => (
          <li
            key={b.name}
            className="brand-wall-name"
            onPointerMove={(e) => e.pointerType === "mouse" && setPeek({ brand: b, x: e.clientX, y: e.clientY })}
            onPointerLeave={() => setPeek(null)}
          >
            {b.name}
            <sup className="brand-wall-no">{pad(i)}</sup>
          </li>
        ))}
      </ol>
      {peek && <LogoCard key={peek.brand.name} font={font} {...peek} />}
    </section>
  );
}
