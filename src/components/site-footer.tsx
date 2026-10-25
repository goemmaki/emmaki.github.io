import { Bot } from "lucide-react";
import { CopyrightYears } from "@/components/copyright-years";
import { FooterWordmark } from "@/components/footer-wordmark";
import { TooltipLink } from "@/components/tooltip-link";

export function SiteFooter() {
  return (
    <footer className="overflow-hidden">
      <FooterWordmark />
      <div className="footer-bar">
        <div className="shell flex items-center justify-end gap-2 py-4 type-meta">
          <p>
            © <CopyrightYears /> emmaki | all rights reserved
          </p>
          <TooltipLink href="/agents.md" label="View as agent" className="icon-action">
            <Bot className="size-[18px]" aria-hidden />
          </TooltipLink>
        </div>
      </div>
    </footer>
  );
}
