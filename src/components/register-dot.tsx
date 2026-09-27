import { cn } from "@/lib/utils";
import type { Register } from "@/lib/content";

/** A period-sized counter marking authored (yellow) vs machine (green) activity. */
export function RegisterDot({ register, className }: { register: Register; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-block size-3 shrink-0 rounded-[2px] border border-line-strong",
        register === "authored" ? "bg-yellow-active" : "bg-green-active",
        className,
      )}
    />
  );
}
