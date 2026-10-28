import type { Metadata } from "next";
import { NebulaField } from "@/components/nebula-field";
import { TextLink } from "@/components/text-link";

// The static export writes this to out/404.html, which GitHub Pages serves for any missing path.
// One look in both themes: the nebula field runs under the header (data-under-header makes it
// transparent with light ink), and the footer keeps only its black bar ("Footer" in globals.css).
export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    // Pulled up under the header (h-16) and one screen tall less the footer bar (2.5rem). The nebula
    // field's glow is on the left (above, on phones); the text takes the right-hand column, clear of it.
    <div data-not-found data-under-header className="relative -mt-16 flex min-h-[calc(100dvh-2.5rem)] [--color-focus:#fff]">
      <NebulaField />
      {/* Phones: centered just under the glow. From md: the right-hand column, centered in the window. */}
      <div className="shell relative grid justify-items-center pt-[60svh] md:grid-cols-[3fr_2fr] md:items-center md:justify-items-start md:pt-0">
        {/* "404" and the link share one width at every size: their font sizes are that width
            divided by their measured widths in em (Plex Mono "404" 1.68em, the link 10.27em). */}
        <div className="flex w-(--w) flex-col gap-3 text-white [--w:clamp(12rem,62vw,20rem)] md:col-start-2">
          <h1 className="font-mono text-[calc(var(--w)/1.68)] leading-none tracking-[-0.04em]">
            404<span className="sr-only"> page not found</span>
          </h1>
          <p className="font-sans text-[calc(var(--w)/10.27)] leading-tight">
            <TextLink href="/">Back to the home page</TextLink>
          </p>
        </div>
      </div>
    </div>
  );
}
