export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="shell flex flex-col gap-2 py-8 type-meta text-fg-muted sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} Emmaki</span>
        <span>Senior copy &amp; AI content strategy</span>
        <span>Set in Geist &amp; IBM Plex</span>
      </div>
    </footer>
  );
}
