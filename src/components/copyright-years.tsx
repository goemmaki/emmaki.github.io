"use client";

import { useSyncExternalStore } from "react";

const FIRST_YEAR = 2026;
const BUILD_YEAR = new Date().getFullYear();
const noSubscription = () => () => {};

/** "2026", then "2026–2027" and on. The static build prints its own year; the browser swaps in today's. */
export function CopyrightYears() {
  const now = useSyncExternalStore(noSubscription, () => new Date().getFullYear(), () => BUILD_YEAR);
  return <>{now > FIRST_YEAR ? `${FIRST_YEAR}–${now}` : FIRST_YEAR}</>;
}
