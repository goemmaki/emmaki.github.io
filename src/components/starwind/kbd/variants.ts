import { tv } from "tailwind-variants";

export const kbd = tv({
  base: [
    "pointer-events-none inline-flex h-4 w-fit min-w-4 items-center justify-center gap-1 px-1 select-none",
    "rounded-sm border border-line font-mono text-[0.6875rem] leading-none text-fg-muted",
    "[&_svg:not([class*='size-'])]:size-3",
  ],
});

export const kbdGroup = tv({
  base: "inline-flex items-center gap-0.5",
});
