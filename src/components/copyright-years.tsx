"use client";

import { useSyncExternalStore } from "react";

const FIRST_YEAR = 2026;
const BUILD_YEAR = new Date().getFullYear();
const noSubscription = () => () => {};

// The static build prints its own year; the browser swaps in today's.
const useYear = () => useSyncExternalStore(noSubscription, () => new Date().getFullYear(), () => BUILD_YEAR);

/** "2026", then "2026–2027" and on. */
export function CopyrightYears() {
  const now = useYear();
  return <>{now > FIRST_YEAR ? `${FIRST_YEAR}–${now}` : FIRST_YEAR}</>;
}

/** Years since `year`, counted by calendar year, so it goes up every January 1. */
export function YearsSince({ year }: { year: number }) {
  return <>{useYear() - year}</>;
}
