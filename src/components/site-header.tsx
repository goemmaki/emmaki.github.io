"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

const nav = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/80 backdrop-blur-md">
      <div className="shell flex h-(--header-h) items-center justify-between">
        {/* TODO: swap for the supplied Emmaki SVG wordmark once it's in /public. */}
        <Link
          href="/"
          className="flex h-11 items-center gap-1 font-heading text-lg font-semibold tracking-tight text-fg-max"
        >
          emmaki<span className="text-fg-muted">;</span>
        </Link>

        <nav className="flex items-center gap-1">
          {nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-11 items-center rounded-sm px-3 type-secondary transition-colors hover:text-fg",
                  active ? "text-fg" : "text-fg-2",
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <span className="mx-2 h-4 w-px bg-line-strong" aria-hidden />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
