import { ArrowUp, Bot } from "lucide-react";
import { CopyrightYears } from "@/components/copyright-years";
import { FiverrLogo } from "@/components/fiverr-logo";
import { FooterWordmark } from "@/components/footer-wordmark";
import { TooltipLink } from "@/components/tooltip-link";
import { FIVERR_PROFILE_URL } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer>
      <FooterWordmark>
        <div className="shell flex h-full flex-wrap content-center items-center gap-x-2 type-meta">
          {/* #content is focusable, so keyboard focus goes back up with the page. */}
          <a href="#content" className="quiet-link -my-1 mr-auto flex h-11 items-center gap-1.5">
            <ArrowUp className="size-4" aria-hidden />
            Back to top
          </a>
          {/* Below 640px the © line takes a second row. */}
          <p className="max-sm:order-last max-sm:basis-full max-sm:text-right">© <CopyrightYears /> emmaki | all rights reserved</p>
          <TooltipLink href={FIVERR_PROFILE_URL} label="emmaki on Fiverr" newTab className="icon-action -my-1">
            <FiverrLogo className="size-[18px]" />
          </TooltipLink>
          <TooltipLink href="/agents.md" label="View as agent" className="icon-action -my-1">
            <Bot className="size-[18px]" aria-hidden />
          </TooltipLink>
        </div>
      </FooterWordmark>
    </footer>
  );
}
