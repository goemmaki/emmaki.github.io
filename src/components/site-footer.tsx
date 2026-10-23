import { Bot } from "lucide-react";
import { TooltipLink } from "@/components/tooltip-link";

export function SiteFooter() {
  return (
    <footer>
      <div className="shell flex items-center justify-end gap-2 py-4 type-meta text-fg-2">
        <span>© emmaki {new Date().getFullYear()}</span>
        <TooltipLink
          href="/agents.md"
          label="View as agent"
          className="grid size-11 place-items-center text-fg-2 transition-colors hover:text-fg"
        >
          <Bot className="size-[18px]" aria-hidden />
        </TooltipLink>
      </div>
    </footer>
  );
}
