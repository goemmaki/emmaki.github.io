import type { ReactNode } from "react";
import { ClientSlots } from "@/components/client-slots";
import { Faq } from "@/components/faq";
import { Figures } from "@/components/figures";
import { PageClosing } from "@/components/page-closing";
import { PageCover } from "@/components/page-cover";
import { ProcessSteps } from "@/components/process-steps";
import { SectionRow } from "@/components/section-row";
import { Testimonials } from "@/components/testimonials";
import { Variants } from "@/components/variants";
import { FAQS, QUOTES, WHO_BODY, WHO_LEAD } from "@/lib/placeholders";

const BODY = "type-editorial text-fg-2";

const Portrait = ({ className = "" }: { className?: string }) => (
  <div className={`grid aspect-[4/5] place-items-center border border-line p-6 text-center type-meta text-fg-2 ${className}`}>
    Portrait (owner’s photo)
  </div>
);

// About, two directions for the owner's review (?v=), on the same ruled rows as Home. Text marked
// "Owner's" is a placeholder. Rows: the person, the figures, how they work, proof, questions.
// Profile: a sticky column holds the portrait and the testimonial card while the rest scrolls past.
const OPTIONS: Record<string, { name: string; node: ReactNode }> = {
  rows: {
    name: "Rows",
    node: (
      <>
        <SectionRow n="01" label="Owner’s label: who I am">
          <div className="grid gap-e1 md:grid-cols-9 md:gap-x-(--gutter)">
            <Portrait className="max-w-64 md:col-span-3 md:max-w-80" />
            <div className="flex flex-col gap-6 md:col-span-6">
              <p className="type-h2 text-fg-max">{WHO_LEAD}</p>
              <p className={`max-w-[60ch] ${BODY}`}>{WHO_BODY}</p>
            </div>
          </div>
        </SectionRow>
        <section className="shell pb-e2">
          <Figures />
        </section>
        <SectionRow n="02" label="Owner’s label: how I work">
          <ProcessSteps />
        </SectionRow>
        <SectionRow n="03" label="Owner’s label: proof">
          <div className="flex flex-col gap-e2">
            <ClientSlots />
            <Testimonials items={QUOTES} className="max-w-[48rem]" />
          </div>
        </SectionRow>
        <SectionRow n="04" label="Owner’s label: questions">
          <Faq faqs={FAQS} bodyText={BODY} />
        </SectionRow>
      </>
    ),
  },
  profile: {
    name: "Profile",
    node: (
      <>
        <section className="shell">
          <div className="grid gap-e1 border-t border-line py-e2 lg:grid-cols-12 lg:gap-x-(--gutter)">
            <aside className="flex flex-col gap-e1 lg:sticky lg:top-24 lg:col-span-5 lg:self-start">
              <Portrait className="max-w-64 lg:max-w-none" />
              <Testimonials items={QUOTES} />
            </aside>
            <div className="flex flex-col gap-e2 lg:col-span-6 lg:col-start-7">
              <div className="flex flex-col gap-6">
                <h2 className="type-meta text-fg-2">Owner’s label: who I am</h2>
                <p className="type-h2 text-fg-max">{WHO_LEAD}</p>
                <p className={BODY}>{WHO_BODY}</p>
              </div>
              <Figures />
              <div className="flex flex-col gap-6">
                <h2 className="type-meta text-fg-2">Owner’s label: how I work</h2>
                <ProcessSteps />
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="type-meta text-fg-2">Owner’s label: questions</h2>
                <Faq faqs={FAQS} bodyText={BODY} />
              </div>
            </div>
          </div>
        </section>
        <section className="shell pb-e2">
          <ClientSlots />
        </section>
      </>
    ),
  },
};

export default function AboutPage() {
  return (
    <>
      <PageCover
        word="About"
        ink={2.613}
        intro="Owner’s intro: one or two lines on what this page is and who it’s for."
      />
      <Variants label="About directions" options={OPTIONS} />
      <PageClosing />
    </>
  );
}
