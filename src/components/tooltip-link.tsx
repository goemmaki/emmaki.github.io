"use client";

import { Tooltip } from "@base-ui/react/tooltip";

/** An icon link that names itself in a small tooltip on hover and focus. */
export function TooltipLink({
  href,
  label,
  className,
  children,
}: {
  href: string;
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger
        delay={150}
        render={<a href={href} />}
        aria-label={label}
        className={className}
      >
        {children}
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Positioner side="top" sideOffset={4} className="z-[70]">
          <Tooltip.Popup className="rounded-sm bg-raised px-2 py-1 type-meta text-fg transition-opacity duration-150 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0">
            {label}
          </Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}
