import { Section } from "@/components/layout";
import { Reveal } from "@/components/reveal";
import { RegisterDot } from "@/components/register-dot";
import { services } from "@/lib/content";

/**
 * The colon introduces what follows. Its two counters double as the legend:
 * authored work (yellow) above, machine-assisted work (green) below.
 */
export function Services() {
  return (
    <Section label="Services">
      <div className="grid gap-e1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="lg:sticky lg:top-[calc(var(--header-h)+var(--space-editorial-52))] lg:self-start">
          <div className="flex items-start gap-8">
            <h2 className="type-h1 text-fg-max">What I do</h2>
            <svg viewBox="0 0 60 220" className="mt-3 h-[clamp(7rem,14vw,12rem)] w-auto shrink-0" aria-hidden>
              <rect x="0" y="0" width="60" height="60" rx="2" style={{ fill: "var(--color-brand-yellow-active)", stroke: "var(--color-border-emphasized)" }} vectorEffect="non-scaling-stroke" />
              <rect x="0" y="160" width="60" height="60" rx="2" style={{ fill: "var(--color-system-green-active)", stroke: "var(--color-border-emphasized)" }} vectorEffect="non-scaling-stroke" />
            </svg>
          </div>
          <dl className="mt-8 flex flex-col gap-2 type-meta text-fg-muted">
            <div className="flex items-center gap-3">
              <RegisterDot register="authored" />
              <dt>Authored</dt>
              <dd className="sr-only">Led and written by hand</dd>
            </div>
            <div className="flex items-center gap-3">
              <RegisterDot register="machine" />
              <dt>Machine-assisted</dt>
              <dd className="sr-only">Systems built, with an editor in the loop</dd>
            </div>
          </dl>
        </div>

        <ol className="border-t border-line">
          {services.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 0.05} className="grid grid-cols-[3rem_minmax(0,1fr)] gap-x-4 border-b border-line py-8">
              <span className="pt-2 type-meta text-fg-muted">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <div className="flex items-center justify-between gap-4">
                  <h3 className="type-h3 text-fg">{s.title}</h3>
                  <RegisterDot register={s.register} />
                </div>
                <p className="mt-3 max-w-[52ch] text-fg-2">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </Section>
  );
}
