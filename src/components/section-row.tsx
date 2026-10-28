import type { ReactNode } from "react";

// One ruled row of the 12-column grid: a mono label on columns 1-3, the content on 4-12 (stacked
// below lg). Shared by Home and About so their sections line up the same way.
export function SectionRow({ n, label, children }: { n: string; label: string; children: ReactNode }) {
  return (
    <section className="shell">
      <div className="grid grid-cols-12 gap-x-(--gutter) gap-y-8 border-t border-line py-e2">
        <h2 className="col-span-12 type-meta text-fg-2 lg:col-span-3">
          <span className="text-fg-max">{n}</span> {label}
        </h2>
        <div className="col-span-12 lg:col-span-9">{children}</div>
      </div>
    </section>
  );
}
