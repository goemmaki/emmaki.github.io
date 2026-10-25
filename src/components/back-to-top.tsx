"use client";

import { CircleArrowUp } from "lucide-react";
import { TooltipLink } from "@/components/tooltip-link";

// Scrolls smoothly to the top (instantly under reduced motion) and moves keyboard focus to the
// main content, which is focusable, so the next Tab continues from the top of the page.
export function BackToTop({ className }: { className?: string }) {
  const toTop = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    document.getElementById("content")?.focus({ preventScroll: true });
  };

  return (
    <TooltipLink href="#content" label="Back to top" onClick={toTop} className={className}>
      <CircleArrowUp className="size-[18px]" aria-hidden />
    </TooltipLink>
  );
}
