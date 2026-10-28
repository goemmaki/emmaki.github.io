import { ClientSlots } from "@/components/client-slots";
import { Faq } from "@/components/faq";
import { Figures } from "@/components/figures";
import { PageClosing } from "@/components/page-closing";
import { PageCover } from "@/components/page-cover";
import { ProcessSteps } from "@/components/process-steps";
import { SectionRow } from "@/components/section-row";
import { Testimonials } from "@/components/testimonials";
import { FAQS, QUOTES, WHO_BODY, WHO_LEAD } from "@/lib/placeholders";

// About, a proposal for the owner's review: the person, the figures, how they work, proof and
// questions, on the same ruled rows as Home. Text marked "Owner's" is a placeholder.
export default function AboutPage() {
  return (
    <>
      <PageCover
        word="About"
        ink={2.613}
        intro="Owner’s intro: one or two lines on what this page is and who it’s for."
      />
      <SectionRow n="01" label="Owner’s label: who I am">
        <div className="grid gap-e1 md:grid-cols-9 md:gap-x-(--gutter)">
          <div className="grid aspect-[4/5] max-w-64 place-items-center md:max-w-80 border border-line p-6 text-center type-meta text-fg-2 md:col-span-3">
            Portrait (owner’s photo)
          </div>
          <div className="flex flex-col gap-6 md:col-span-6">
            <p className="type-h2 text-fg-max">{WHO_LEAD}</p>
            <p className="max-w-[60ch] type-editorial text-fg-2">{WHO_BODY}</p>
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
        <Faq faqs={FAQS} bodyText="type-editorial text-fg-2" />
      </SectionRow>
      <PageClosing />
    </>
  );
}
