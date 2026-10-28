import type { Metadata } from "next";
import { Mail, PanelsTopLeft } from "lucide-react";
import { Breadcrumb } from "@/components/breadcrumb";
import { CaseFrame } from "@/components/case-frame";
import { FloodButton } from "@/components/flood-button";
import { AiBadges } from "@/components/page-tools";
import { PageClosing } from "@/components/page-closing";
import { BRANDS, FIVERR_PROFILE_URL } from "@/lib/content";

export const metadata: Metadata = { title: "Placeholder", robots: { index: false } };

// The case-study template, blocked out to design from (owner, 2026-10-29), after grafit.agency's
// case studies: the breadcrumb and headline, then a frame of lines starting low in the first screen
// and running past it, to invite the scroll; then a sticky column of facts beside the write-up.
// Headings and body take the blog post's sizes. Placeholder copy only.
const sectionHeading =
  "font-heading font-normal text-(length:--type-heading-h3-size) leading-(--type-heading-h3-leading) tracking-(--type-heading-h3-tracking) text-fg-max";
const bodyText = "font-sans text-base leading-[1.625] text-fg-2";

const LOREM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
const client = BRANDS.find((brand) => brand.name === "Harvard University");
if (!client?.color) throw new Error("Case study needs Harvard University's brand color");
const brandColor = client.color;
const clientName = client.name;
const TITLE = "Lorem ipsum dolor sit amet. Consectetur adipiscing elit, sed do eiusmod tempor.";
// Made-up facts for the layout (owner, 2026-10-29); services carry an icon each.
const SERVICE_ICONS = { "Website Copy": PanelsTopLeft, "Email Copy": Mail };
const FACTS = [
  { label: "Client", value: clientName },
  { label: "Service", services: ["Website Copy", "Email Copy"] as const },
  { label: "Length", value: "6 weeks" },
  { label: "Company size", value: "10,000+ employees" },
  { label: "Annual revenue", value: "$5B+" },
];
const SECTIONS = ["Intro", "The brief", "The work", "Results"].map((heading) => ({ heading, paragraphs: [LOREM, LOREM] }));

export default function ProofPlaceholderPage() {
  return (
    <>
      <section className="shell pt-[clamp(8rem,20svh,11rem)]">
        <Breadcrumb trail={[{ label: "Case studies", href: "/proof" }]} current="Placeholder" />
        <h1 className="mt-8 max-w-[22ch] font-heading font-normal text-[clamp(2rem,2.8vw,2.5rem)] leading-[1.15] tracking-[-0.03em] text-fg-max text-pretty">
          {TITLE}
        </h1>
        <CaseFrame brandColor={brandColor} clientName={clientName} />
      </section>

      <div className="shell mt-e3 grid gap-y-e1 lg:grid-cols-12">
        <aside className="lg:col-span-3 lg:self-start lg:sticky lg:top-28">
          <dl>
            {FACTS.map(({ label, value, services }) => (
              <div key={label} className="border-b border-line py-4 first:pt-0">
                <dt className="type-meta uppercase text-fg-2">{label}</dt>
                {services ? (
                  services.map((service) => {
                    const Icon = SERVICE_ICONS[service];
                    return (
                      <dd key={service} className="mt-2 flex items-center gap-2 font-sans text-base text-fg-max">
                        <Icon className="icon-muted" aria-hidden />
                        {service}
                      </dd>
                    );
                  })
                ) : (
                  <dd className="mt-2 font-sans text-base text-fg-max">{value}</dd>
                )}
              </div>
            ))}
          </dl>
          <div className="mt-8">
            <FloodButton href={FIVERR_PROFILE_URL} external>
              Message me
            </FloodButton>
          </div>
          <div className="mt-8">
            <AiBadges />
          </div>
        </aside>
        <div className="max-w-[700px] lg:col-span-8 lg:col-start-5">
          {SECTIONS.map(({ heading, paragraphs }, i) => (
            <section key={heading} className={i ? "mt-e2" : undefined}>
              <h2 className={sectionHeading}>{heading}</h2>
              <div className={`mt-6 space-y-6 ${bodyText}`}>
                {paragraphs.map((paragraph, j) => <p key={j}>{paragraph}</p>)}
              </div>
            </section>
          ))}
        </div>
      </div>

      <PageClosing />
    </>
  );
}
