import { SERVICES } from "@/lib/content";

// What the owner can help with, after bymonolog.com's services list (without its pictures): a mono
// kicker, then the services set huge, dimmed until the pointer lights one. Styles: "Services" in
// globals.css. Unmounted since 2026-10-28: a killed darling, kept for a revival elsewhere (the owner
// found it too big for Home; see docs/site-plan.md). Don't delete it.
export function Services() {
  return (
    <section className="shell py-e2">
      <h2 className="type-meta text-fg-2">What I can help with</h2>
      <ul className="services-list mt-8">
        {SERVICES.map((s) => (
          <li key={s}>
            <span className="services-name">{s}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
