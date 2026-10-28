import { ClientSlots } from "@/components/client-slots";
import { PageClosing } from "@/components/page-closing";
import { PageCover } from "@/components/page-cover";
import { ProcessSteps } from "@/components/process-steps";
import { SectionRow } from "@/components/section-row";
import { Services } from "@/components/services";
import { Testimonials } from "@/components/testimonials";
import { QUOTES } from "@/lib/placeholders";

// Home, a proposal for the owner's review: who (the cover), proof at once (the client strip), what
// (services), how a job runs, what clients say, then how to start. Text marked "Owner's" is a placeholder.
export default function Home() {
  return (
    <>
      <PageCover
        word="emmaki"
        ink={3.367}
        intro="Owner’s intro: who I am and what I write, in one or two lines for a Fiverr buyer."
      />
      <section className="shell py-e2">
        <ClientSlots />
      </section>
      <Services />
      <SectionRow n="01" label="Owner’s label: how it works">
        <ProcessSteps />
      </SectionRow>
      <SectionRow n="02" label="Owner’s label: what clients say">
        <Testimonials items={QUOTES} className="max-w-[48rem]" />
      </SectionRow>
      <PageClosing />
    </>
  );
}
