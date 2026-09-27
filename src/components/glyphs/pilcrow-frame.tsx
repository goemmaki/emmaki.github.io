import { useId } from "react";
import { markPath } from "@/components/glyphs/mark";
import { cn } from "@/lib/utils";

/**
 * A pilcrow used as a container: whatever sits inside (a portrait, later) is
 * seen through the mark. Without an image, it shows a labelled drafting field.
 */
export function PilcrowFrame({ src, alt, className }: { src?: string; alt?: string; className?: string }) {
  const { viewBox, d } = markPath("pilcrow");
  const id = `pilcrow-${useId().replace(/:/g, "")}`;

  return (
    <svg viewBox={viewBox} className={cn("overflow-visible", className)} role={src ? "img" : undefined} aria-label={src ? alt : undefined} aria-hidden={src ? undefined : true}>
      <defs>
        <clipPath id={id}>
          <path d={d} />
        </clipPath>
        <pattern id={`${id}-grid`} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" style={{ stroke: "var(--color-border-default)" }} strokeWidth="1" />
        </pattern>
      </defs>
      <g clipPath={`url(#${id})`}>
        {src ? (
          <image href={src} x="-10" y="0" width="250" height="560" preserveAspectRatio="xMidYMid slice" />
        ) : (
          <>
            <rect x="-10" y="0" width="250" height="560" style={{ fill: "var(--color-canvas-secondary)" }} />
            <rect x="-10" y="0" width="250" height="560" style={{ fill: "var(--color-brand-yellow-motif)" }} />
            <rect x="-10" y="0" width="250" height="560" fill={`url(#${id}-grid)`} />
            <text x="12" y="130" style={{ fill: "var(--color-text-secondary)", fontFamily: "var(--font-mono)", fontSize: 11 }}>
              portrait
            </text>
          </>
        )}
      </g>
      <path d={d} fill="none" vectorEffect="non-scaling-stroke" style={{ stroke: "var(--color-border-emphasized)", strokeWidth: 1 }} />
    </svg>
  );
}
