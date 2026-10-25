import { Bot } from "lucide-react";
import { BackToTop } from "@/components/back-to-top";
import { CopyrightYears } from "@/components/copyright-years";
import { FiverrLogo } from "@/components/fiverr-logo";
import { FooterWordmark } from "@/components/footer-wordmark";
import { TooltipLink } from "@/components/tooltip-link";
import { FIVERR_PROFILE_URL } from "@/lib/content";

// 36px icon targets, closer together than the header's 44px (WCAG 2.5.8 asks for 24px).
const ICON = "icon-action size-9";

export function SiteFooter() {
  return (
    <footer>
      <FooterWordmark>
        <div className="shell flex h-full items-center justify-between gap-2 type-meta">
          <p>© <CopyrightYears /> emmaki | all rights reserved</p>
          <div className="-mr-2 flex">
            <TooltipLink href={FIVERR_PROFILE_URL} label="@emmaki on Fiverr" newTab className={ICON}>
              <FiverrLogo className="size-[18px]" />
            </TooltipLink>
            <TooltipLink href="/agents.md" label="View as agent" className={ICON}>
              <Bot className="size-[18px]" aria-hidden />
            </TooltipLink>
            <BackToTop className={ICON} />
          </div>
        </div>
      </FooterWordmark>
    </footer>
  );
}
