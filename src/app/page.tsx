import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/home/hero";
import { Services } from "@/components/home/services";
import { Process } from "@/components/home/process";
import { FullStop } from "@/components/home/full-stop";
import { Kicker, Section } from "@/components/layout";
import { Mark } from "@/components/glyphs/mark";
import { WorkList } from "@/components/work-list";
import { projects } from "@/lib/content";

export default function Home() {
  return (
    <>
      <Hero />
      <Services />

      <Section label="Selected work">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <Kicker>Selected work</Kicker>
            <h2 className="mt-4 flex items-center gap-6 type-h1 text-fg-max">
              The work
              <Mark name="dash" className="h-[0.12em] w-[1.1em] text-fg-muted" />
            </h2>
          </div>
          <Link
            href="/work"
            className="group flex h-11 items-center gap-2 rounded-sm type-secondary text-fg-2 transition-colors hover:text-fg"
          >
            All work
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
          </Link>
        </div>
        <div className="mt-e1">
          <WorkList projects={projects.slice(0, 4)} />
        </div>
      </Section>

      <Process />
      <FullStop />
    </>
  );
}
