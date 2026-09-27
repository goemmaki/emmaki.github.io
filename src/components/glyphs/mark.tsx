import { cn } from "@/lib/utils";

/*
 * Static punctuation shapes on the same geometry as the hero mark: square
 * counters, 2px corners. Each mark does its grammatical job in the layout —
 * colon introduces, em dash interrupts, pilcrow opens a paragraph, full stop ends.
 */

export type MarkName = "colon" | "semicolon" | "dash" | "period" | "pilcrow";

const shapes: Record<MarkName, { viewBox: string; d: string }> = {
  colon: {
    viewBox: "0 0 120 440",
    d: "M2 0h116a2 2 0 0 1 2 2v116a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2Z M2 320h116a2 2 0 0 1 2 2v116a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V322a2 2 0 0 1 2-2Z",
  },
  semicolon: {
    viewBox: "0 0 130 560",
    d: "M12 0h116a2 2 0 0 1 2 2v116a2 2 0 0 1-2 2H12a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2Z M12 320h116a2 2 0 0 1 2 2v118H130L70 560H0L60 440H10V322a2 2 0 0 1 2-2Z",
  },
  dash: {
    viewBox: "0 0 320 48",
    d: "M2 0h316a2 2 0 0 1 2 2v44a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2Z",
  },
  period: {
    viewBox: "0 0 120 120",
    d: "M2 0h116a2 2 0 0 1 2 2v116a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2Z",
  },
  pilcrow: {
    viewBox: "-10 0 250 560",
    d: "M110 0H240V560H212V28H178V560H150V240H110A120 120 0 0 1 110 0Z",
  },
};

export const markGlyph: Record<MarkName, string> = {
  colon: ":",
  semicolon: ";",
  dash: "—",
  period: ".",
  pilcrow: "¶",
};

export function Mark({
  name,
  className,
  variant = "solid",
}: {
  name: MarkName;
  className?: string;
  variant?: "solid" | "outline";
}) {
  const s = shapes[name];
  return (
    <svg viewBox={s.viewBox} className={cn("overflow-visible", className)} aria-hidden>
      <path
        d={s.d}
        fillRule="evenodd"
        vectorEffect="non-scaling-stroke"
        style={
          variant === "solid"
            ? { fill: "currentColor" }
            : { fill: "none", stroke: "currentColor", strokeWidth: 1 }
        }
      />
    </svg>
  );
}

/** Mark path for use as a clip/mask (e.g. an image or texture seen through a pilcrow). */
export function markPath(name: MarkName) {
  return shapes[name];
}
