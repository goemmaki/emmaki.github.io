import type { Metadata } from "next";
import { Geist_Pixel } from "next/font/google";
import { AsciiImage } from "@/components/ascii-image";

// Geist Pixel, loaded on this page only, for the tagline. ELSH picks the pixel shape.
const geistPixel = Geist_Pixel({ subsets: ["latin"], axes: ["ELSH"], variable: "--nf-geist-pixel" });

// Placeholders until the owner writes them. SEO (canonical, schema, social cards) is parked:
// docs/handoffs/20261026-site.md.
export const metadata: Metadata = {
  title: "Placeholder keyword phrase",
  description: "Placeholder description of Crossed Wires.",
};

// The blog, Crossed Wires: a full-window cover ("Blog index cover" in globals.css). The H1 will go
// below the fold.
export default function BlogIndex() {
  return (
    <section className={`blog-cover relative -mt-16 overflow-x-clip ${geistPixel.variable}`}>
      <div className="relative flex h-svh flex-col">
        {/* Sized and placed in globals.css ("Blog index cover"). */}
        <AsciiImage
          src="/blog/masks.webp"
          width={1000}
          height={890}
          className="blog-cover-masks"
        />
        <div className="blog-cover-bottom shell flex flex-1 flex-col justify-end pb-(--tagline-pb)">
          <div className="blog-cover-tagline-box">
            <p className="blog-cover-tagline text-center leading-[1.2] text-fg-2">
              A chronicle of <span className="text-fg-max">absurd humanity</span>
            </p>
          </div>
        </div>
        <p className="blog-cover-name text-fg-max">Crossed Wires</p>
      </div>
      <div className="blog-cover-overhang" aria-hidden />
      {/* Placeholder until the index below the fold is designed. */}
      <div className="shell py-24 text-center type-meta text-fg-2">Coming soon</div>
    </section>
  );
}
