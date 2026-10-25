import { Bot } from "lucide-react";
import { BackToTop } from "@/components/back-to-top";
import { CopyrightYears } from "@/components/copyright-years";
import { FiverrLogo } from "@/components/fiverr-logo";
import { FooterWordmark } from "@/components/footer-wordmark";
import { TooltipLink } from "@/components/tooltip-link";
import { FIVERR_PROFILE_URL } from "@/lib/content";

// 36px icon targets (28px on phones), closer together than the header's 44px; WCAG 2.5.8 asks for 24px.
const ICON = "icon-action size-7 sm:size-9";

export function SiteFooter() {
  return (
    <footer>
      <FooterWordmark>
        <div className="shell flex h-full items-center justify-between gap-2 type-meta">
          <p className="footer-legal">© <CopyrightYears /> emmaki | all rights reserved</p>
          {/* -mr: the last glyph, not its target, sits on the gutter */}
          <div className="-mr-[5px] flex shrink-0 sm:-mr-[9px]">
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
