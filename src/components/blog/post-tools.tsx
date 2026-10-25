"use client";

import { useEffect, useState } from "react";
import { Menu } from "@base-ui/react/menu";
import { Bot, Copy, FileText, Link2, Share2 } from "lucide-react";
import { formatPublished, type Post } from "@/lib/posts";

const itemClass =
  "flex min-h-8 cursor-default items-center gap-1.5 rounded-sm px-1.5 py-1 font-sans text-sm text-fg outline-none data-[highlighted]:bg-surface";

type ToolLink = { label: string; href: string; brand?: "linkedin" | "x" };

function MenuItemLink({ label, href }: ToolLink) {
  return (
    <Menu.LinkItem
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={itemClass}
    >
      {brandMark(label)}
      {label}
    </Menu.LinkItem>
  );
}

function brandMark(label: string) {
  if (label === "Share on LinkedIn") {
    return <svg viewBox="0 0 16 16" className="size-4 shrink-0 text-fg-2" aria-hidden="true" fill="currentColor"><path d="M3.4 5.8H1V15h2.4V5.8ZM2.2 4.6a1.4 1.4 0 1 0 0-2.8 1.4 1.4 0 0 0 0 2.8ZM15 9.7c0-2.8-1.5-4.1-3.5-4.1-1.6 0-2.3.9-2.7 1.5V5.8H6.4V15h2.4v-5c0-1.3.3-2.5 1.8-2.5s1.6 1.4 1.6 2.6V15H15V9.7Z" /></svg>;
  }
  if (label === "Share on X") {
    return <svg viewBox="0 0 16 16" className="size-4 shrink-0 text-fg-2" aria-hidden="true" fill="currentColor"><path d="M12.6 1.5H15l-5.3 6.1L15.9 14h-4.8l-3.8-4.9L3 14H.6l5.7-6.6L.2 1.5h4.9l3.4 4.5 4.1-4.5Zm-.8 11.2h1.3L4.3 2.7H3L11.8 12.7Z" /></svg>;
  }
  return null;
}

function ToolMenu({
  label,
  icon: Icon,
  onOpen,
  children,
}: {
  label: string;
  icon: typeof Copy;
  onOpen: () => void;
  children: React.ReactNode;
}) {
  return (
    <Menu.Root onOpenChange={(open) => open && onOpen()}>
      <Menu.Trigger className="flex size-11 items-center justify-center gap-2 rounded-sm border border-line bg-transparent px-2.5 text-fg hover:bg-surface aria-expanded:bg-surface md:h-8 md:w-auto">
        <Icon className="size-4 shrink-0" aria-hidden />
        <span className="sr-only md:not-sr-only font-sans text-sm font-medium">{label}</span>
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner side="bottom" sideOffset={4} align="start" className="z-[70]">
          <Menu.Popup className="min-w-40 rounded-sm border border-line bg-bg p-1 text-fg shadow-lg dark:bg-bg-2">
            {children}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}

export function PostTools({ post }: { post: Post }) {
  const [pageUrl, setPageUrl] = useState("");
  const [copyStatus, setCopyStatus] = useState("");

  useEffect(() => {
    if (!copyStatus) return;
    const timer = window.setTimeout(() => setCopyStatus(""), 2000);
    return () => window.clearTimeout(timer);
  }, [copyStatus]);

  async function copyText(value: string, success: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopyStatus(success);
    } catch {
      setCopyStatus("Couldn't copy");
    }
  }

  function markdown() {
    return [
      `# ${post.title}`,
      `${post.author} · ${formatPublished(post.published)} · ${post.category}`,
      pageUrl,
      "## TL;DR",
      ...post.tldr.map((item) => `- ${item}`),
      ...post.body,
    ].join("\n\n");
  }

  const prompt = pageUrl ? `Read from ${pageUrl} so I can ask questions about it` : "";
  const aiLinks: ToolLink[] = prompt ? [
    { label: "ChatGPT", href: `https://chatgpt.com/?q=${encodeURIComponent(prompt)}` },
    { label: "Google AI", href: `https://www.google.com/search?q=${encodeURIComponent(prompt)}&udm=50` },
    { label: "Grok", href: `https://grok.com/?q=${encodeURIComponent(prompt)}` },
    { label: "Perplexity", href: `https://www.perplexity.ai/search/?q=${encodeURIComponent(prompt)}` },
    { label: "Claude", href: `https://claude.ai/new?q=${encodeURIComponent(prompt)}` },
  ] : [];
  const shareLinks: ToolLink[] = pageUrl ? [
    { label: "Share on LinkedIn", href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(pageUrl)}&title=${encodeURIComponent(post.title)}` },
    { label: "Share on X", href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(post.title)}` },
  ] : [];

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <ToolMenu label="Copy page" icon={Copy} onOpen={() => setPageUrl(window.location.href)}>
          <Menu.Item onClick={() => void copyText(window.location.href, "Link copied")} className={itemClass}>
            <Link2 className="size-4 shrink-0 text-fg-2" aria-hidden />
            Copy link
          </Menu.Item>
          <Menu.Item onClick={() => void copyText(markdown(), "Markdown copied")} className={itemClass}>
            <FileText className="size-4 shrink-0 text-fg-2" aria-hidden />
            Copy as .md
          </Menu.Item>
        </ToolMenu>
        <ToolMenu label="Share" icon={Share2} onOpen={() => setPageUrl(window.location.href)}>
          {shareLinks.map((link) => <MenuItemLink key={link.label} {...link} />)}
        </ToolMenu>
        <ToolMenu label="Ask AI" icon={Bot} onOpen={() => setPageUrl(window.location.href)}>
          {aiLinks.map((link) => <MenuItemLink key={link.label} {...link} />)}
        </ToolMenu>
      </div>
      {/* Floats under the buttons so showing it doesn't move the page. */}
      <div
        role="status"
        aria-live="polite"
        className={copyStatus ? "absolute left-0 top-full mt-2 whitespace-nowrap rounded-sm bg-raised px-2 py-1 type-meta text-fg" : "sr-only"}
      >
        {copyStatus}
      </div>
    </div>
  );
}
