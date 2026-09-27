import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Kicker, PlaceholderTag, Section } from "@/components/layout";
import { RegisterDot } from "@/components/register-dot";
import { Reveal } from "@/components/reveal";
import { Cover } from "@/components/work-list";
import { projects } from "@/lib/content";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  return project ? { title: project.title, description: project.summary } : {};
}

// Case-study skeleton. Each prompt tells you what the real section should prove.
const chapters = [
  { title: "The problem", prompt: "What the buyer couldn't understand, and what that was costing." },
  { title: "The angle", prompt: "The one commercial idea the work was built around, and why it beat the alternatives." },
  { title: "The work", prompt: "What was written or built. Show real excerpts, pages, or workflow screenshots." },
  { title: "What changed", prompt: "Only real, sourced outcomes. If there are no numbers, describe what the client could now do." },
];

export default async function CaseStudy({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();
  const project = projects[index];
  const next = projects[(index + 1) % projects.length];

  return (
    <>
      <section className="shell pb-e1 pt-e2 lg:px-[calc(var(--gutter)+var(--space-editorial-52))]">
        <Link
          href="/work"
          className="group -ml-1 inline-flex h-11 items-center gap-2 rounded-sm px-1 type-meta text-fg-muted transition-colors hover:text-fg"
        >
          <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" aria-hidden />
          All work
        </Link>
        <Reveal className="mt-e1 grid gap-e1 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-4">
              <Kicker>
                {project.kind} — {project.year}
              </Kicker>
              {project.placeholder && <PlaceholderTag />}
            </div>
            <h1 className="mt-6 type-h1 text-fg-max">{project.title}</h1>
          </div>
          <p className="type-lead text-fg-2">{project.summary}</p>
        </Reveal>
      </section>

      <div className="shell">
        <Reveal className="aspect-[16/9] w-full lg:aspect-[21/9]">
          <Cover project={project} />
        </Reveal>
      </div>

      <Section label="Details" className="mt-e2">
        <div className="grid gap-e1 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
          <dl className="grid grid-cols-2 content-start gap-x-8 gap-y-6 type-meta lg:sticky lg:top-[calc(var(--header-h)+var(--space-editorial-52))] lg:grid-cols-1">
            <div>
              <dt className="text-fg-muted">Scope</dt>
              {project.scope.map((s) => (
                <dd key={s} className="mt-1 text-fg">{s}</dd>
              ))}
            </div>
            {project.stack && (
              <div>
                <dt className="text-fg-muted">Stack</dt>
                {project.stack.map((s) => (
                  <dd key={s} className="mt-1 text-fg">{s}</dd>
                ))}
              </div>
            )}
            <div>
              <dt className="text-fg-muted">Register</dt>
              <dd className="mt-1 flex items-center gap-2 text-fg">
                <RegisterDot register={project.register} />
                {project.register === "authored" ? "Authored" : "Machine-assisted"}
              </dd>
            </div>
          </dl>

          <div className="max-w-read">
            {chapters.map((c, i) => (
              <Reveal key={c.title} className="border-t border-line py-e1 first:border-t-0 first:pt-0">
                <p className="type-meta text-fg-muted">¶ {String(i + 1).padStart(2, "0")}</p>
                <h2 className="mt-3 type-h2 text-fg">{c.title}</h2>
                <p className="mt-6 type-editorial text-fg-2">
                  <span className="text-fg-muted">[Placeholder]</span> {c.prompt}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      <Section label="Next project" innerClassName="lg:py-e2">
        <Link href={`/work/${next.slug}`} className="group grid gap-4 rounded-sm">
          <Kicker>Next</Kicker>
          <span className="flex items-center justify-between gap-8">
            <span className="type-h2 text-fg-2 transition-colors group-hover:text-fg-max">{next.title}</span>
            <ArrowRight className="size-8 shrink-0 text-fg-muted transition-transform group-hover:translate-x-2 group-hover:text-fg" aria-hidden />
          </span>
        </Link>
      </Section>
    </>
  );
}
