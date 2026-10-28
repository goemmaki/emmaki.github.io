import type { Metadata } from "next";
import { Breadcrumb } from "@/components/breadcrumb";
import { PageClosing } from "@/components/page-closing";

export const metadata: Metadata = { title: "Placeholder", robots: { index: false } };

// The case-study template, blocked out to design from (owner, 2026-10-29), after grafit.agency's
// case studies: the breadcrumb and headline, then a frame of lines starting low in the first screen
// and running past it, to invite the scroll; then a sticky column of facts beside the write-up.
// Headings and body take the blog post's sizes. Placeholder copy only.
const sectionHeading =
  "font-heading font-normal text-(length:--type-heading-h3-size) leading-(--type-heading-h3-leading) tracking-(--type-heading-h3-tracking) text-fg-max";
const bodyText = "font-sans text-base leading-[1.625] text-fg-2";

const FACTS = ["Client", "Service", "Duration", "Year"];
const SECTIONS = ["Intro", "The brief", "The work", "Results"];
const LOREM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

export default function ProofPlaceholderPage() {
  return (
    <>
      <section className="shell pt-[clamp(8rem,20svh,11rem)]">
        <Breadcrumb trail={[{ label: "Case studies", href: "/proof" }]} current="Placeholder" />
        <h1 className="mt-8 max-w-[22ch] font-heading font-normal text-[clamp(2rem,2.8vw,2.5rem)] leading-[1.15] tracking-[-0.03em] text-fg-max text-pretty">
          Lorem ipsum dolor sit amet. Consectetur adipiscing elit, sed do eiusmod tempor.
        </h1>
        {/* Grafit's proportions: five columns of twelve in three rows, then seven, about half a
            screen tall. Lines only for now. */}
        <div aria-hidden className="case-frame mt-e2">
          <div /><div /><div /><div />
        </div>
      </section>

      <div className="shell mt-e3 grid gap-y-e1 lg:grid-cols-12">
        <aside className="lg:col-span-3 lg:self-start lg:sticky lg:top-28">
          <dl>
            {FACTS.map((label) => (
              <div key={label} className="border-b border-line py-4 first:pt-0">
                <dt className="type-meta uppercase text-fg-2">{label}</dt>
                <dd className="mt-2 font-sans text-base text-fg-max">Lorem ipsum</dd>
              </div>
            ))}
          </dl>
        </aside>
        <div className="max-w-[700px] lg:col-span-8 lg:col-start-5">
          {SECTIONS.map((heading, i) => (
            <section key={heading} className={i ? "mt-e2" : undefined}>
              <h2 className={sectionHeading}>{heading}</h2>
              <div className={`mt-6 space-y-6 ${bodyText}`}>
                <p>{LOREM}</p>
                <p>{LOREM}</p>
              </div>
            </section>
          ))}
        </div>
      </div>

      <PageClosing />
    </>
  );
}
