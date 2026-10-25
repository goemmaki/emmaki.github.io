import React, { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

// OutlineText from 21st.dev: transparent letters drawn as a 2px stroke, so whatever is behind shows through.
// Stroke colour changed from #000/#fff to the site's fg-max token (the same black and white).
interface OutlineTextProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  className?: string;
}

export function OutlineText({ children, className = "", ...props }: OutlineTextProps) {
  return (
    <span
      className={cn(
        "inline-block font-extrabold",
        "text-[4rem] md:text-[6rem] leading-none",
        "text-transparent bg-clip-text select-none",
        className
      )}
      style={{
        WebkitTextStroke: "2px",
        WebkitTextFillColor: "transparent",
        WebkitBackgroundClip: "text",
      }}
      {...props}
    >
      <span className="[-webkit-text-stroke-color:var(--color-fg-max)]">{children}</span>
    </span>
  );
}
