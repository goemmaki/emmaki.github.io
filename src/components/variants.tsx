"use client";

import { type ReactNode, useSyncExternalStore } from "react";

// Review only: renders one of a page's design directions, picked by ?v= or the switcher in the
// corner. The first option is the default. Goes once the owner picks a direction.
const EVENT = "design-variant";
const subscribe = (onChange: () => void) => {
  addEventListener(EVENT, onChange);
  addEventListener("popstate", onChange);
  return () => {
    removeEventListener(EVENT, onChange);
    removeEventListener("popstate", onChange);
  };
};

export function Variants({ label, options }: { label: string; options: Record<string, { name: string; node: ReactNode }> }) {
  const keys = Object.keys(options);
  const current = useSyncExternalStore(
    subscribe,
    () => {
      const v = new URLSearchParams(location.search).get("v");
      return v && v in options ? v : keys[0];
    },
    () => keys[0],
  );
  const choose = (v: string) => {
    const url = new URL(location.href);
    url.searchParams.set("v", v);
    history.replaceState(history.state, "", url);
    dispatchEvent(new Event(EVENT));
  };

  return (
    <>
      {options[current].node}
      <nav
        aria-label={`${label} (review only)`}
        className="fixed right-4 bottom-4 z-50 flex gap-1 rounded-full border border-line bg-bg p-1 font-mono text-xs"
      >
        {keys.map((v) => (
          <button
            key={v}
            type="button"
            aria-pressed={v === current}
            onClick={() => choose(v)}
            className="rounded-full px-3 py-2 aria-pressed:bg-fg-max aria-pressed:text-bg"
          >
            {options[v].name}
          </button>
        ))}
      </nav>
    </>
  );
}
