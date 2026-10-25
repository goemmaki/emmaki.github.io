import { Bot } from "lucide-react";
import { FooterWordmark } from "@/components/footer-wordmark";
import { TooltipLink } from "@/components/tooltip-link";

export function SiteFooter() {
  return (
    <footer className="overflow-hidden">
      <FooterWordmark />
      <div className="shell flex items-center justify-end gap-2 py-4 type-meta text-fg-2">
        <span>© emmaki {new Date().getFullYear()}</span>
        <TooltipLink
          href="/agents.md"
          label="View as agent"
          className="icon-action"
        >
          <Bot className="size-[18px]" aria-hidden />
        </TooltipLink>
      </div>
    </footer>
  );
}
