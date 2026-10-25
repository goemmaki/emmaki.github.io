"use client";

import { Tooltip } from "@base-ui/react/tooltip";

/** An icon link that names itself in a small tooltip on hover and focus. `newTab` opens it in a new tab. */
export function TooltipLink({
  href,
  label,
  className,
  newTab,
  children,
}: {
  href: string;
  label: string;
  className?: string;
  newTab?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger
        delay={150}
        render={newTab ? <a href={href} target="_blank" rel="noopener" /> : <a href={href} />}
        aria-label={newTab ? `${label} (opens in a new tab)` : label}
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
