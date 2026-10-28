import { AVAILABILITY, type Availability } from "@/lib/content";
import { cn } from "@/lib/utils";

// The availability status: an outlined badge with a small glowing light in the traffic-light colours,
// and its words (the light alone means nothing). After grafit.agency's header status. One component,
// so a change here or in AVAILABILITY shows everywhere it's used.
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
