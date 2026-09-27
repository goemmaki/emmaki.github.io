import type { Metadata } from "next";
import { Kicker, Section } from "@/components/layout";
import { Mark } from "@/components/glyphs/mark";
import { Reveal } from "@/components/reveal";
import { WorkList } from "@/components/work-list";
import { projects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Work",
  description: "Positioning, launch copy, AI content strategy, and workflow builds.",
};

export default function WorkPage() {
  return (
    <>
      <section className="shell pb-e1 pt-e2 lg:px-[calc(var(--gutter)+var(--space-editorial-52))] lg:pt-e3">
        <Reveal>
          <Kicker>Index — {projects.length} pieces</Kicker>
          <h1 className="mt-6 flex items-center gap-[0.25em] type-mega text-fg-max">
            Work
            <Mark name="dash" className="h-[0.1em] w-[1.4em] text-fg-muted" />
          </h1>
          <p className="mt-8 max-w-[52ch] type-lead text-fg-2">
            Writing that makes complex offers obvious, and the systems that keep it consistent at
            scale.
          </p>
        </Reveal>
      </section>
      <Section label="All work" innerClassName="lg:py-e2">
        <WorkList projects={projects} />
      </Section>
    </>
  );
}
