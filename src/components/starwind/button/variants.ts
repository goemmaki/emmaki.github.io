import { tv } from "tailwind-variants";

// Focus uses the site-wide :focus-visible outline; controls set their own offset where space is tight.
export const button = tv({
  base: [
    "inline-flex items-center justify-center gap-1.5 rounded-sm whitespace-nowrap",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    "transition-colors duration-150",
    "disabled:pointer-events-none disabled:opacity-40",
    "data-disabled:pointer-events-none data-disabled:opacity-40",
  ],
  variants: {
    variant: {
      default: "bg-fg-max text-bg hover:bg-fg",
      outline: "border border-line-strong text-fg-max hover:border-fg-max",
      ghost: "text-fg-2 hover:text-fg-max",
    },
    size: {
      sm: "h-9 px-3 type-meta uppercase [&_svg:not([class*='size-'])]:size-3.5",
      md: "h-11 px-4 type-meta uppercase [&_svg:not([class*='size-'])]:size-4",
      "icon-sm": "size-9 [&_svg:not([class*='size-'])]:size-4",
      icon: "size-11 [&_svg:not([class*='size-'])]:size-4.5",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});
