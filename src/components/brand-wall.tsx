"use client";

import { useEffect, useRef, useState } from "react";

export type Brand = { name: string; logo?: string; color?: string };

const pad = (n: number) => String(n + 1).padStart(2, "0");

// The hover card, standardised: every logo is drawn in white on the brand's colour (a neutral card
// where none is known), at the screen's full resolution. A brand without a logo file gets its name
// set in the wall's type instead.
const CARD = { w: 240, h: 180 };
const LOGO_BOX = { w: 0.7, h: 0.36 }; // the share of the card a logo may fill

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
      // Recolour whatever was drawn to white, keeping its shape and soft edges.
      c.globalCompositeOperation = "source-in";
      c.fillStyle = "#fff";
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
        const scale = Math.min((cols * LOGO_BOX.w) / img.naturalWidth, (rows * LOGO_BOX.h) / img.naturalHeight);
        const w = img.naturalWidth * scale;
        const h = img.naturalHeight * scale;
        paint(() => c.drawImage(img, (cols - w) / 2, (rows - h) / 2, w, h));
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
      style={{ left: x, top: y, background: brand.color ?? "var(--brand-peek-neutral)" }}
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
