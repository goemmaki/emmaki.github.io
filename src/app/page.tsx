import type { ReactNode } from "react";
import { ClientSlots } from "@/components/client-slots";
import { PageClosing } from "@/components/page-closing";
import { PageCover } from "@/components/page-cover";
import { ProcessSteps } from "@/components/process-steps";
import { SectionRow } from "@/components/section-row";
import { Services } from "@/components/services";
import { Testimonials } from "@/components/testimonials";
import { Variants } from "@/components/variants";
import { QUOTES } from "@/lib/placeholders";

const INTRO = "Owner’s intro: who I am and what I write, in one or two lines for a Fiverr buyer.";

// What follows either opening: how a job runs, what clients say, then how to start.
const Rest = () => (
  <>
    <SectionRow n="01" label="Owner’s label: how it works">
      <ProcessSteps />
    </SectionRow>
    <SectionRow n="02" label="Owner’s label: what clients say">
      <Testimonials items={QUOTES} className="max-w-[48rem]" />
    </SectionRow>
    <PageClosing />
  </>
);

// Home, two directions for the owner's review (?v=). Text marked "Owner's" is a placeholder.
// Name: the brand word as the cover, as on the other main pages, then proof (the client strip) and
// services. Services: the services themselves are the first screen, the intro beside them, and the
// client strip follows; the brand word is left to the footer.
const OPTIONS: Record<string, { name: string; node: ReactNode }> = {
  name: {
    name: "Name",
    node: (
      <>
        <PageCover word="emmaki" ink={3.367} intro={INTRO} />
        {/* No bottom padding: the services' own top padding is the gap, so it isn't doubled. */}
        <section className="shell pt-e1">
          <ClientSlots />
        </section>
        <Services />
        <Rest />
      </>
    ),
  },
  services: {
    name: "Services",
    node: (
      <>
        <div className="-mt-16 flex min-h-svh flex-col justify-end pt-16">
          <h1 className="sr-only">emmaki</h1>
          <div className="shell grid grid-cols-12 gap-x-(--gutter) pt-e1">
            <p className="col-span-12 max-w-[36ch] type-lead text-fg-2 md:col-span-4 md:col-start-9">{INTRO}</p>
          </div>
          <Services />
        </div>
        <section className="shell pb-e2">
          <ClientSlots />
        </section>
        <Rest />
      </>
    ),
  },
};

export default function Home() {
  return <Variants label="Home directions" options={OPTIONS} />;
}
