import type { Metadata } from "next";
import { Geist, IBM_Plex_Mono, IBM_Plex_Sans, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BottomBlur } from "@/components/bottom-blur";

const geist = Geist({ subsets: ["latin"], variable: "--nf-geist" });
const plexSans = IBM_Plex_Sans({ subsets: ["latin"], variable: "--nf-plex-sans" });
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--nf-plex-mono",
});
// Light italic serif for accent words.
const sourceSerif = Source_Serif_4({ subsets: ["latin"], style: "italic", weight: "300", variable: "--nf-source-serif" });

export const metadata: Metadata = {
  title: {
    default: "Emmaki — Senior copy & AI content strategy",
    template: "%s — Emmaki",
  },
  description:
    "Senior B2B copywriting and AI content strategy for complex offers. The writing makes it clear; the systems make it scale.",
};

// Runs before first paint: restores the theme.
const bootScript = `(function(){try{var d=document.documentElement;var t=localStorage.getItem("emmaki-theme");if(t==="light"||t==="dark")d.dataset.theme=t}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-US"
      data-theme="dark"
      suppressHydrationWarning
      className={cn(geist.variable, plexSans.variable, plexMono.variable, sourceSerif.variable)}
    >
      <head>
        {/* The site has its own dark theme; stop Dark Reader rewriting the markup before hydration. */}
        <meta name="darkreader-lock" />
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <a href="#content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:bg-bg focus:px-3 focus:py-2 focus:type-meta">
          Skip to content
        </a>
        <SiteHeader />
        <main id="content" tabIndex={-1} className="flex-1 outline-none">{children}</main>
        <SiteFooter />
        <BottomBlur />
      </body>
    </html>
  );
}
