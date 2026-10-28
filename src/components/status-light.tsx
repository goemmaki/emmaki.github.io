import { AVAILABILITY, type Availability } from "@/lib/content";
import { cn } from "@/lib/utils";

// The availability status, after grafit.agency's header status: a light and its words, since the
// light alone means nothing.
const LABEL: Record<Availability, string> = {
  open: "Open for work",
  limited: "Limited availability",
  full: "Fully booked",
};

export function StatusLight({ className }: { className?: string }) {
  return (
    <span className={cn("status-badge type-meta text-fg-2", className)}>
      <span className="status-light" data-status={AVAILABILITY} aria-hidden />
      {LABEL[AVAILABILITY]}
    </span>
  );
}
