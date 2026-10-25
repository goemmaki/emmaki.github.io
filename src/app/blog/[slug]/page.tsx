import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Clock, House, ListChecks } from "lucide-react";
import { FloodButton } from "@/components/flood-button";
import { PostFaqs } from "@/components/blog/post-faqs";
import { PostToc } from "@/components/blog/post-toc";
import { TextLink } from "@/components/text-link";
import { PostTools } from "@/components/blog/post-tools";
import { formatPublished, getPost, headingId, posts, readingMinutes } from "@/lib/posts";

export const dynamicParams = false;

export function generateStaticParams() {
  return posts.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  return { title: { absolute: post?.title ?? "Not found" } };
}

const TLDR_ID = "tldr";
const FAQ_HEADING = "FAQs";

// Heading levels on posts, sized for reading rather than selling (grafit.agency's article
// title is 38px). Lighter than the shared type roles; H4-H6 aren't in DESIGN.md yet.
const headingStyle = {
  1: "font-heading font-normal text-[clamp(2rem,2.8vw,2.5rem)] leading-[1.15] tracking-[-0.03em]",
  2: "font-heading font-normal text-(length:--type-heading-h3-size) leading-(--type-heading-h3-leading) tracking-(--type-heading-h3-tracking)",
  3: "font-heading font-normal text-xl leading-[1.3] tracking-[-0.01em]",
  4: "font-heading font-normal text-lg leading-[1.35]",
  5: "font-heading font-normal text-base leading-[1.4]",
  6: "font-heading font-normal text-sm leading-[1.43] uppercase tracking-[0.04em]",
} as const;

// Headings the TOC links to land 112px from the top.
const tocTarget = "scroll-mt-28";
const sectionHeadingClass = `${headingStyle[2]} text-fg-max ${tocTarget}`;
// Plex Sans reads larger than grafit's Aeonik at the same size, so 16px matches their 18px.
const bodyText = "font-sans text-base leading-[1.625] text-fg-2";

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const minutes = readingMinutes(post);
  const toc = [
    { id: TLDR_ID, text: "TL;DR" },
    ...[...post.sections.map(({ heading }) => heading), FAQ_HEADING].map((text) => ({ id: headingId(text), text })),
  ];

  return (
    // From lg a TOC track sits left of the article (240px, then 288px at xl); below lg the TOC is hidden.
    <article className="shell pt-[84px] pb-[136px] lg:grid lg:grid-cols-[240px_minmax(0,700px)] lg:gap-x-[52px] xl:grid-cols-[288px_minmax(0,700px)] xl:gap-x-[84px]">
      {/* Phones: breadcrumb, title, author, then dates and tools on one row. md+: tools share the breadcrumb row. 52px around the title. */}
      <header className="grid max-w-[700px] grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-8 [grid-template-areas:'breadcrumb_breadcrumb'_'title_title'_'author_author'_'date_tools'] md:gap-x-4 md:[grid-template-areas:'breadcrumb_tools'_'title_title'_'meta_meta'] lg:col-start-2">
        <nav aria-label="Breadcrumb" className="type-meta uppercase text-fg-2 [grid-area:breadcrumb]">
          <ol className="flex min-w-0 items-center gap-2">
            <li className="flex shrink-0">
              <Link href="/" aria-label="Home" className="hover:text-fg-max focus-visible:text-fg-max">
                <House className="size-3.5" aria-hidden />
              </Link>
            </li>
            <li aria-hidden="true"><ChevronRight className="size-3.5" /></li>
            <li className="shrink-0">
              <Link href="/blog" className="hover:text-fg-max focus-visible:text-fg-max">Blog</Link>
            </li>
            <li aria-hidden="true"><ChevronRight className="size-3.5" /></li>
            <li aria-current="page" className="min-w-0 max-w-[36ch] truncate text-fg-max">{post.category}</li>
          </ol>
        </nav>

        <div className="justify-self-end [grid-area:tools]">
          <PostTools post={post} />
        </div>

        <h1 className={`my-5 ${headingStyle[1]} text-fg-max text-pretty [grid-area:title]`}>{post.title}</h1>

        <div className="contents md:flex md:items-center md:justify-between md:gap-8 md:[grid-area:meta]">
          <div className="flex items-center gap-3 [grid-area:author]">
            <div aria-hidden className="grid size-9 place-items-center rounded-sm bg-raised font-heading text-sm text-fg">
              ER
            </div>
            <span className="font-sans text-sm font-medium text-fg-max">{post.author}</span>
          </div>
          <div className="flex flex-col gap-1 type-meta text-fg-2 [grid-area:date] md:items-end">
            <time dateTime={post.published}>
              <span className="hidden sm:inline">Published </span>{formatPublished(post.published)}
            </time>
            {post.updated && (
              <span>
                Updated <time dateTime={post.updated}>{formatPublished(post.updated)}</time>
              </span>
            )}
            {/* From lg the read time sits above the TOC instead. */}
            <span className="lg:hidden">{minutes} min read</span>
          </div>
        </div>
      </header>

      {/* pt-1 centres the read time on the intro's first line. */}
      <aside aria-labelledby="toc-title" className="mt-[84px] hidden pt-1 lg:col-start-1 lg:row-start-2 lg:block">
        <div className="sticky top-24">
          <p className="mb-8 flex items-center gap-2 type-meta text-fg-2">
            <Clock className="size-3.5" aria-hidden />
            {minutes} min read
          </p>
          <h2 id="toc-title" className="sr-only">On this page</h2>
          <PostToc entries={toc} />
        </div>
      </aside>

      <div className="mt-[84px] max-w-[700px] lg:col-start-2 lg:row-start-2">
        <p className={bodyText}>{post.intro}</p>

        <section aria-labelledby={TLDR_ID} className="mt-[52px] rounded-sm border border-line bg-surface p-6">
          <div className="mb-4 flex items-center gap-2">
            <ListChecks className="size-4 text-fg-2" aria-hidden />
            <h2 id={TLDR_ID} tabIndex={-1} className={`${headingStyle[5]} text-fg-max ${tocTarget}`}>TL;DR</h2>
          </div>
          <ul className="list-disc space-y-2 pl-5 font-sans text-sm leading-normal text-fg-2">
            {post.tldr.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </section>

        {post.sections.map(({ heading, blocks }) => (
          <section key={heading} aria-labelledby={headingId(heading)} className="mt-[52px]">
            <h2 id={headingId(heading)} tabIndex={-1} className={sectionHeadingClass}>{heading}</h2>
            <div className={`mt-6 space-y-6 ${bodyText}`}>
              {blocks.map((block, index) => {
                if (typeof block === "string") return <p key={index}>{block}</p>;
                if (Array.isArray(block)) {
                  return (
                    <p key={index}>
                      {block.map((run, i) =>
                        typeof run === "string" ? run : <TextLink key={i} href={run.href}>{run.text}</TextLink>,
                      )}
                    </p>
                  );
                }
                if ("image" in block) {
                  return (
                    <figure key={index} className="!my-8">
                      <Image src={block.image} width={block.width} height={block.height} alt={block.alt} className="w-full rounded-sm" />
                      {block.caption && <figcaption className="mt-3 text-center font-sans text-sm text-fg-2">{block.caption}</figcaption>}
                    </figure>
                  );
                }
                const Heading = `h${block.level}` as const;
                return (
                  <Heading key={index} className={`!mt-8 ${headingStyle[block.level]} text-fg-max`}>
                    {block.text}
                  </Heading>
                );
              })}
            </div>
          </section>
        ))}

        <div className="mt-[84px]">
          <FloodButton href={post.cta.href}>{post.cta.label}</FloodButton>
        </div>

        <section aria-labelledby={headingId(FAQ_HEADING)} className="mt-[84px]">
          <h2 id={headingId(FAQ_HEADING)} tabIndex={-1} className={sectionHeadingClass}>{FAQ_HEADING}</h2>
          <PostFaqs faqs={post.faqs} bodyText={bodyText} />
        </section>
      </div>
    </article>
  );
}
