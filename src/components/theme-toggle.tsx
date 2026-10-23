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

export function ThemeToggle({ className, iconClassName }: { className?: string; iconClassName?: string }) {
  const dark = useSyncExternalStore(subscribe, isDark, () => true);

  function toggle() {
    const next = dark ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("emmaki-theme", next);
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Dark mode"
      aria-pressed={dark}
      className={cn("grid size-11 place-items-center text-fg-2 transition-colors hover:text-fg", className)}
    >
      <Sun className={cn("size-4 dark:hidden", iconClassName)} aria-hidden />
      <Moon className={cn("hidden size-4 dark:block", iconClassName)} aria-hidden />
    </button>
  );
}
