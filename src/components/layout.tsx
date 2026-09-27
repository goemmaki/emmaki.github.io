import { cn } from "@/lib/utils";

/** Small drafting crosshair where a rule meets a rail. */
function Cross({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 11 11"
      className={cn("absolute size-[11px] text-fg-muted", className)}
      aria-hidden
    >
      <path d="M5.5 0v11M0 5.5h11" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

/**
 * A section in the drafting frame: a full-bleed top rule, rails on the shell
 * edges (desktop only), and crosshairs where they meet.
 */
export function Section({
  children,
  className,
  innerClassName,
  id,
  label,
}: {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  id?: string;
  label?: string;
}) {
  return (
    <section id={id} aria-label={label} className={cn("relative border-t border-line", className)}>
      <div className="shell relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 right-0 hidden lg:block" aria-hidden>
          <span className="absolute inset-y-0 left-0 w-px bg-line" />
          <span className="absolute inset-y-0 right-0 w-px bg-line" />
          <Cross className="-left-[5px] -top-[6px]" />
          <Cross className="-right-[6px] -top-[6px]" />
        </div>
        <div className={cn("relative py-e2 lg:px-e1 lg:py-e3", innerClassName)}>{children}</div>
      </div>
    </section>
  );
}

export function Kicker({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("type-meta text-fg-muted", className)}>{children}</p>;
}

export function PlaceholderTag({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border border-dashed border-line-strong px-2 py-1 type-meta text-fg-muted",
        className,
      )}
    >
      Placeholder
    </span>
  );
}
