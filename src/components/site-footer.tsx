import { Bot } from "lucide-react";
import { CopyrightYears } from "@/components/copyright-years";
import { FooterWordmark } from "@/components/footer-wordmark";
import { TooltipLink } from "@/components/tooltip-link";

export function SiteFooter() {
  return (
    <footer>
      <FooterWordmark>
        <div className="shell flex h-full items-center justify-end gap-2 type-meta">
          <p>© <CopyrightYears /> emmaki | all rights reserved</p>
          <TooltipLink href="/agents.md" label="View as agent" className="icon-action -my-1">
            <Bot className="size-[18px]" aria-hidden />
          </TooltipLink>
        </div>
      </FooterWordmark>
    </footer>
  );
}
