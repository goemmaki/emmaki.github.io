import type { Metadata } from "next";
import { Kicker, PlaceholderTag, Section } from "@/components/layout";
import { PilcrowFrame } from "@/components/glyphs/pilcrow-frame";
import { Reveal } from "@/components/reveal";
import { tools } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description: "Senior copywriter and AI content strategist. Writer first, systems second.",
};

const paragraphs = [
  "I’m a senior copywriter for complex B2B offers: the products, platforms, and services that are hard to explain and expensive to get wrong. My job is to find the commercial angle buyers actually care about, then write it so they get it the first time.",
  "I also build the systems around the writing. With Claude Code, Codex, n8n, and Make, I set up content workflows grounded in real source material, with voice guides and review steps built in, so the output still sounds like the brand at volume.",
  "AI is part of how I work. It doesn’t make the calls. The strategy, the angle, and the final edit stay with an experienced writer.",
];

const principles = [
  ["Stakes before style", "Start with what the buyer stands to gain or lose. The words follow."],
  ["Clear beats clever", "Clever is welcome when it’s also clear. Never instead of it."],
  ["Proof or it doesn’t ship", "No invented numbers, logos, or claims. Ever."],
  ["Every system has an editor", "Automation handles volume. A person decides what goes out."],
];

export default function AboutPage() {
  return (
    <>
      <section className="shell pb-e2 pt-e2 lg:px-[calc(var(--gutter)+var(--space-editorial-52))] lg:pt-e3">
        <div className="grid gap-e1 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-start">
          <Reveal>
            <Kicker>About</Kicker>
            <h1 className="mt-6 type-mega text-fg-max">
              Writer first.
              <br />
              <span className="text-fg-muted">Systems second.</span>
            </h1>
            <div className="mt-e1 max-w-read space-y-6">
              {paragraphs.map((p, i) => (
                <p key={i} className="type-editorial text-fg-2 first:type-lead first:text-fg">
                  {p}
                </p>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.15} className="flex justify-center lg:justify-end">
            {/* Pass src="/portrait.jpg" once a real portrait is in /public. */}
            <PilcrowFrame className="h-[min(70svh,560px)] w-auto" />
          </Reveal>
        </div>
      </section>

      <Section label="Principles">
        <div className="grid gap-e1 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
          <h2 className="type-h2 text-fg-max">How I work:</h2>
          <ol className="border-t border-line">
            {principles.map(([title, body], i) => (
              <Reveal as="li" key={title} delay={i * 0.05} className="grid grid-cols-[3rem_minmax(0,1fr)] gap-x-4 border-b border-line py-6 lg:grid-cols-[3rem_minmax(0,1fr)_minmax(0,1fr)]">
                <span className="pt-1 type-meta text-fg-muted">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="type-h3 text-fg">{title}</h3>
                <p className="col-start-2 mt-2 text-fg-2 lg:col-start-auto lg:mt-0">{body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </Section>

      <Section label="Toolkit">
        <dl className="grid gap-e1 sm:grid-cols-3">
          <div>
            <dt className="type-meta text-fg-muted">Writing</dt>
            <dd className="mt-4 space-y-1 text-fg">
              <p>Positioning &amp; messaging</p>
              <p>Web &amp; launch copy</p>
              <p>Sales narratives</p>
            </dd>
          </div>
          <div>
            <dt className="type-meta text-fg-muted">Systems</dt>
            <dd className="mt-4 space-y-1 text-fg">
              {tools.map((t) => (
                <p key={t}>{t}</p>
              ))}
            </dd>
          </div>
          <div>
            <dt className="type-meta text-fg-muted">Experience</dt>
            <dd className="mt-4 space-y-3 text-fg-2">
              <PlaceholderTag />
              <p>Add real roles, sectors, and years here.</p>
            </dd>
          </div>
        </dl>
      </Section>
    </>
  );
}
