import type { Metadata } from "next";
import { Geist, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MotionProvider } from "@/components/motion-provider";

const geist = Geist({ subsets: ["latin"], variable: "--nf-geist" });
const plexSans = IBM_Plex_Sans({ subsets: ["latin"], variable: "--nf-plex-sans" });
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--nf-plex-mono",
});

export const metadata: Metadata = {
  title: {
    default: "Emmaki — Senior copy & AI content strategy",
    template: "%s — Emmaki",
  },
  description:
    "Senior B2B copywriting and AI content strategy for complex offers. The writing makes it clear; the systems make it scale.",
};

// Runs before first paint: restores the theme and arms the entry choreography.
const bootScript = `(function(){try{var d=document.documentElement;var t=localStorage.getItem("emmaki-theme");if(t==="light"||t==="dark")d.dataset.theme=t;if(!matchMedia("(prefers-reduced-motion: reduce)").matches)d.classList.add("intro")}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={cn(geist.variable, plexSans.variable, plexMono.variable)}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <MotionProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </MotionProvider>
      </body>
    </html>
  );
}
