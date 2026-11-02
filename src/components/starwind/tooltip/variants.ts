import { tv } from "tailwind-variants";

export const tooltip = tv({
  base: "inline-block",
});

export const tooltipPositioner = tv({
  base: "z-[70]",
});

// Emmaki's tooltip: a raised slip of mono meta text, hairline edge, no caret.
export const tooltipContent = tv({
  base: [
    "group hidden w-fit max-w-64 px-2 py-1 whitespace-nowrap",
    "type-meta text-fg [&>[data-slot=kbd]]:ms-2 [&>[data-slot=kbd-group]]:ms-2",
    "rounded-sm border border-line bg-raised",
    "animate-in fade-in duration-150 ease-out",
    "data-[state=closed]:animate-out data-[state=closed]:fill-mode-forwards fade-out",
    "data-[side=bottom]:slide-in-from-top-0.5 data-[side=top]:slide-in-from-bottom-0.5",
    "data-[side=left]:slide-in-from-right-0.5 data-[side=right]:slide-in-from-left-0.5",
    "motion-reduce:animate-none",
  ],
});
