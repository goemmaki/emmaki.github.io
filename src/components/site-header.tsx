"use client";

import { Dialog } from "@base-ui/react/dialog";
import { Menu, MessageCircle, X } from "lucide-react";
import { motion, type Variants } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FIVERR_INBOX_URL, FIVERR_PROFILE_URL } from "@/lib/content";
import { FiverrLogo } from "@/components/fiverr-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Wordmark } from "@/components/wordmark";

const nav = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

const menuItems: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.055, delayChildren: 0.04 } },
};

const menuItem: Variants = {
  hidden: { opacity: 0, x: 12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.22, ease: "easeOut" } },
};

export function SiteHeader() {
  const pathname = usePathname();
  // The menu belongs to the page it was opened on, so any route change closes it.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const setOpen = (next: boolean) => setOpenOn(next ? pathname : null);

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
              aria-label="Open menu"
              className="grid size-11 place-items-center text-fg-2 transition-colors hover:text-fg"
            >
              <Menu className="size-5" aria-hidden />
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Backdrop className="fixed inset-0 z-[60] bg-black/55 backdrop-blur-sm dark:bg-black/30 transition-opacity duration-200 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0" />
              <Dialog.Popup className="fixed inset-y-0 right-0 z-[61] flex h-dvh w-full max-w-[720px] flex-col bg-bg dark:bg-bg-2 px-[var(--gutter)] pb-10 pt-3 shadow-2xl outline-none transition-transform duration-300 ease-out data-[starting-style]:translate-x-full data-[ending-style]:translate-x-full motion-reduce:transition-none sm:px-12">
                <div className="flex h-11 items-center justify-between">
                  <Dialog.Title className="sr-only">Site menu</Dialog.Title>
                  <Link href="/" aria-label="emmaki home" onClick={() => setOpen(false)}>
                    <Wordmark className="w-[88px]" />
                  </Link>
                  <Dialog.Close
                    aria-label="Close menu"
                    className="grid size-11 place-items-center text-fg-2 transition-colors hover:text-fg"
                  >
                    <X className="size-5" aria-hidden />
                  </Dialog.Close>
                </div>
                <div className="flex flex-1 flex-col justify-center gap-e2">
                  {/* Icons at half the size of the menu type. */}
                  <div className="flex items-center gap-8 [--menu-icon:clamp(2rem,3.5vw,3rem)]">
                    <a
                      href={FIVERR_INBOX_URL}
                      target="_blank"
                      rel="noopener"
                      aria-label="Message emmaki on Fiverr (opens in a new tab)"
                      className="text-fg-2 transition-colors hover:text-fg-max"
                    >
                      <MessageCircle className="size-(--menu-icon)" aria-hidden />
                    </a>
                    <a
                      href={FIVERR_PROFILE_URL}
                      target="_blank"
                      rel="noopener"
                      aria-label="emmaki on Fiverr (opens in a new tab)"
                      className="transition-opacity hover:opacity-80"
                    >
                      <FiverrLogo className="size-(--menu-icon)" />
                    </a>
                    <ThemeToggle className="size-auto" iconClassName="size-(--menu-icon)" />
                  </div>
                  <nav aria-label="Main menu">
                    <motion.ul
                      variants={menuItems}
                      initial="hidden"
                      animate="visible"
                      className="w-full space-y-1"
                    >
                      {nav.map(({ href, label }) => {
                        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
                        return (
                          <motion.li key={href} variants={menuItem}>
                            <Link
                              href={href}
                              aria-current={active ? "page" : undefined}
                              onClick={() => setOpen(false)}
                              className={`flex min-h-16 items-center type-mega transition-colors hover:text-fg-max ${active ? "text-fg-max" : "text-fg-2"}`}
                            >
                              {label}
                            </Link>
                          </motion.li>
                        );
                      })}
                    </motion.ul>
                  </nav>
                </div>
              </Dialog.Popup>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </header>
  );
}
