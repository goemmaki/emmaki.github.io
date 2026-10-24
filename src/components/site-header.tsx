"use client";

import { Dialog } from "@base-ui/react/dialog";
import { Menu, MessageCircle, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef, useState } from "react";
import { FIVERR_INBOX_URL, FIVERR_PROFILE_URL } from "@/lib/content";
import { FiverrLogo } from "@/components/fiverr-logo";
import { MenuRollLink } from "@/components/menu-roll-link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Wordmark } from "@/components/wordmark";

const nav = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/projects", label: "Projects" },
  { href: "/proof", label: "Proof" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

// Menu opening, in seconds. Yellow, grey and the panel slide in one after another, a beat apart,
// with a hard-decelerating ease (the reference menu's timings). Closing is instant.
const REVEAL_EASE = "cubic-bezier(0.65, 0.01, 0.05, 0.99)";
const REVEAL = {
  layer: 0.575,
  stagger: 0.12,
  backdrop: 0.7,
};
const slideIn = (step: number) => ({
  animation: `menu-slide-in ${REVEAL.layer}s ${REVEAL_EASE} ${step * REVEAL.stagger}s both`,
});

export function SiteHeader() {
  const pathname = usePathname();
  // The menu belongs to the page it was opened on, so any route change closes it.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const setOpen = (next: boolean) => setOpenOn(next ? pathname : null);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);
  const [closePosition, setClosePosition] = useState<{ top: number; right: number } | null>(null);
  useLayoutEffect(() => {
    if (!open) return;

    let frame = 0;
    const updateClosePosition = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => {
          const trigger = menuTriggerRef.current?.getBoundingClientRect();
          const panel = menuPanelRef.current?.getBoundingClientRect();
          if (!trigger || !panel) return;
          setClosePosition({ top: trigger.top - panel.top, right: panel.right - trigger.right });
        });
      });
    };

    updateClosePosition();
    window.addEventListener("resize", updateClosePosition);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", updateClosePosition);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 bg-bg/95 backdrop-blur-md">
      <div className="shell flex h-16 items-center justify-between">
        <Link href="/" aria-label="emmaki home" className="flex h-11 items-center">
          <Wordmark className="w-[88px] sm:w-[120px]" />
        </Link>

        <div className="flex items-center">
          <ThemeToggle />
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger
              ref={menuTriggerRef}
              aria-label="Open menu"
              className="grid size-11 place-items-center text-fg-2 transition-colors hover:text-fg-max focus-visible:text-fg-max"
            >
              <Menu className="size-5" aria-hidden />
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Backdrop
                className="fixed inset-0 z-[60] bg-black/55 backdrop-blur-sm dark:bg-black/30 transition-opacity data-[starting-style]:opacity-0"
                style={{ transitionDuration: `${REVEAL.backdrop}s`, transitionTimingFunction: REVEAL_EASE }}
              />
              {/* Opening: yellow, then grey, then the panel, each filling the menu's space. Closing is instant. */}
              <Dialog.Popup ref={menuPanelRef} className="fixed inset-y-0 right-0 z-[61] h-dvh w-full max-w-[720px] overflow-clip outline-none">
                <div
                  aria-hidden
                  className="absolute inset-0 bg-[#FFC300] motion-reduce:hidden"
                  style={slideIn(0)}
                />
                <div aria-hidden className="absolute inset-0 bg-fg-muted dark:bg-raised motion-reduce:hidden" style={slideIn(1)} />
                <div
                  className="relative flex h-full flex-col overflow-y-auto bg-bg dark:bg-bg-2 px-[var(--gutter)] pb-10 pt-3 shadow-2xl motion-reduce:[animation:none!important] sm:px-12"
                  style={slideIn(2)}
                >
                  <div className="flex h-11 items-center justify-between">
                    <Dialog.Title className="sr-only">Site menu</Dialog.Title>
                    <Link href="/" aria-label="emmaki home" onClick={() => setOpen(false)}>
                      <Wordmark className="w-[88px]" />
                    </Link>
                    <Dialog.Close
                      aria-label="Close menu"
                      className="absolute grid size-11 place-items-center text-fg-2 transition-colors hover:text-fg-max focus-visible:text-fg-max"
                      style={closePosition ?? undefined}
                    >
                      <X className="size-5" aria-hidden />
                    </Dialog.Close>
                  </div>
                  <div className="flex flex-1 flex-col justify-center gap-e2">
                    {/* Theme, Fiverr inbox, Fiverr profile. */}
                    <div className="flex items-center gap-8 [--menu-icon:clamp(2rem,3.5vw,3rem)]">
                      <ThemeToggle className="size-auto" iconClassName="size-(--menu-icon)" />
                      <a
                        href={FIVERR_INBOX_URL}
                        target="_blank"
                        rel="noopener"
                        aria-label="Message emmaki on Fiverr (opens in a new tab)"
                        className="text-fg-2 transition-colors hover:text-fg-max focus-visible:text-fg-max"
                      >
                        <MessageCircle className="size-(--menu-icon)" aria-hidden />
                      </a>
                      <a
                        href={FIVERR_PROFILE_URL}
                        target="_blank"
                        rel="noopener"
                        aria-label="emmaki on Fiverr (opens in a new tab)"
                        className="transition-[filter] dark:hover:brightness-125 dark:focus-visible:brightness-125 light:hover:brightness-85 light:focus-visible:brightness-85"
                      >
                        <FiverrLogo className="size-(--menu-icon)" />
                      </a>
                    </div>
                    <nav aria-label="Main menu">
                      <ul className="w-full space-y-1">
                        {nav.map(({ href, label }, index) => {
                          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
                          return (
                            <li key={href}>
                              <MenuRollLink
                                href={href}
                                label={label}
                                number={String(index + 1).padStart(2, "0")}
                                active={active}
                                onNavigate={() => setOpen(false)}
                              />
                            </li>
                          );
                        })}
                      </ul>
                    </nav>
                  </div>
                </div>
              </Dialog.Popup>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </header>
  );
}
