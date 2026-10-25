"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

// Every toggle reads the theme from <html data-theme>, so copies stay in sync.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}
const isDark = () => document.documentElement.dataset.theme !== "light";

const THEME_REVEAL_MS = 400;

export function ThemeToggle({ className, iconClassName }: { className?: string; iconClassName?: string }) {
  const dark = useSyncExternalStore(subscribe, isDark, () => true);

  function toggle(event: React.MouseEvent<HTMLButtonElement>) {
    const root = document.documentElement;
    const next = dark ? "light" : "dark";
    const apply = () => {
      root.dataset.theme = next;
      try {
        localStorage.setItem("emmaki-theme", next);
      } catch {}
    };

    if (
      typeof document.startViewTransition !== "function" ||
      root.dataset.themeVt ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      apply();
      return;
    }

    // The new theme grows out of the button as a circle (Magic UI's animated theme toggler).
    // Percentages, not px: Chrome misplaces px clip-paths on fractional display scales.
    const { top, left, width, height } = event.currentTarget.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const radius = Math.hypot(Math.max(x, vw - x), Math.max(y, vh - y));
    const at = `at ${(x / vw) * 100}% ${(y / vh) * 100}%`;
    const from = `circle(0% ${at})`;
    const to = `circle(${(radius / (Math.hypot(vw, vh) / Math.SQRT2)) * 100}% ${at})`;

    root.dataset.themeVt = "active";
    root.style.setProperty("--theme-vt-clip-from", from); // holds the circle shut until the animation starts
    const transition = document.startViewTransition(apply);
    transition.ready
      .then(() =>
        root.animate(
          { clipPath: [from, to] },
          { duration: THEME_REVEAL_MS, easing: "ease-in-out", fill: "forwards", pseudoElement: "::view-transition-new(root)" },
        ),
      )
      .catch(() => {});
    transition.finished
      .finally(() => {
        delete root.dataset.themeVt;
        root.style.removeProperty("--theme-vt-clip-from");
      })
      .catch(() => {});
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Dark mode"
      aria-pressed={dark}
      className={cn("grid size-11 place-items-center text-fg-2 transition-colors hover:text-fg-max focus-visible:text-fg-max", className)}
    >
      <Sun className={cn("size-4 dark:hidden", iconClassName)} aria-hidden />
      <Moon className={cn("hidden size-4 dark:block", iconClassName)} aria-hidden />
    </button>
  );
}
