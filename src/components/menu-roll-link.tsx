"use client";

import { useAnimate, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useRef } from "react";

const ROLL_DURATION = 0.35;
const ROLL_EASE = [0.76, 0, 0.24, 1] as const;
// Room above and below the line so ascenders and descenders aren't clipped.
const SLOT_BLEED_EM = 0.15;

/** -1 rolls the line up, 1 rolls it down. */
type RollDirection = -1 | 1;

function Line({ number, label }: { number: string; label: string }) {
  return (
    <span className="flex items-baseline gap-[0.5em] whitespace-nowrap">
      <span className="text-fg-muted tabular-nums" aria-hidden>
        {number}
      </span>
      <span>{label}</span>
    </span>
  );
}

/**
 * A menu link whose whole line rolls once on hover or keyboard focus, like a
 * flip-counter: opposite to the pointer's travel, always to completion.
 */
export function MenuRollLink({
  href,
  label,
  number,
  active,
  onNavigate,
}: {
  href: string;
  label: string;
  number: string;
  active: boolean;
  onNavigate: () => void;
}) {
  const [scope, animate] = useAnimate<HTMLSpanElement>();
  const rolling = useRef(false);
  const reducedMotion = useReducedMotion();

  async function roll(direction: RollDirection) {
    const line = scope.current;
    if (rolling.current || reducedMotion || !line) return;
    rolling.current = true;
    const bleed = SLOT_BLEED_EM * 2 * parseFloat(getComputedStyle(line).fontSize);
    const distance = line.offsetHeight + bleed;
    await animate(line, { y: direction * distance }, { duration: ROLL_DURATION, ease: ROLL_EASE });
    // The copy that rolled in is identical, so snapping back is invisible.
    await animate(line, { y: 0 }, { duration: 0 });
    rolling.current = false;
  }

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      onClick={onNavigate}
      onPointerEnter={(event) => {
        if (event.pointerType !== "mouse") return;
        const box = event.currentTarget.getBoundingClientRect();
        // Entering from above means moving down the list, so the line rolls up.
        void roll(event.clientY < box.top + box.height / 2 ? -1 : 1);
      }}
      onFocus={(event) => {
        if (!event.currentTarget.matches(":focus-visible")) return;
        const from = event.relatedTarget?.getBoundingClientRect();
        const to = event.currentTarget.getBoundingClientRect();
        void roll(from && from.top > to.top ? 1 : -1);
      }}
      className={`flex min-h-16 items-center type-mega [font-size:min(var(--type-display-mega-size),10.5dvh)] transition-colors hover:text-fg-max focus-visible:text-fg-max ${active ? "text-fg-max" : "text-fg-2"}`}
    >
      <span
        className="block overflow-hidden"
        style={{ paddingBlock: `${SLOT_BLEED_EM}em`, marginBlock: `-${SLOT_BLEED_EM}em` }}
      >
        <span ref={scope} className="relative block">
          <Line number={number} label={label} />
          <span
            className="absolute inset-x-0"
            style={{ bottom: `calc(100% + ${SLOT_BLEED_EM * 2}em)` }}
            aria-hidden
          >
            <Line number={number} label={label} />
          </span>
          <span
            className="absolute inset-x-0"
            style={{ top: `calc(100% + ${SLOT_BLEED_EM * 2}em)` }}
            aria-hidden
          >
            <Line number={number} label={label} />
          </span>
        </span>
      </span>
    </Link>
  );
}
