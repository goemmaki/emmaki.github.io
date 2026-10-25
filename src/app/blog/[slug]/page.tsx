import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Clock, House, ListChecks } from "lucide-react";
import { FloodButton } from "@/components/flood-button";
import { PostCover } from "@/components/blog/post-cover";
import { PostFaqs } from "@/components/blog/post-faqs";
import { PostToc } from "@/components/blog/post-toc";
import { TextLink } from "@/components/text-link";
import { StripedPattern } from "@/components/ui/striped-pattern";
import { PostTools } from "@/components/blog/post-tools";
import { formatPublished, getPost, headingId, posts, readingMinutes, POST_FAQ_LABEL, POST_TLDR_ID, POST_TLDR_LABEL } from "@/lib/posts";

export const dynamicParams = false;

export function generateStaticParams() {
  return posts.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  return { title: { absolute: post?.title ?? "Not found" } };
}

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
// From lg a TOC track sits left of the article (240px, then 288px at xl); below lg the TOC is hidden.
// The headline area and the body share it.
const postGrid =
  "shell lg:grid lg:grid-cols-[240px_minmax(0,700px)] lg:gap-x-e1 xl:grid-cols-[288px_minmax(0,700px)] xl:gap-x-e2";
// Plex Sans reads larger than grafit's Aeonik at the same size, so 16px matches their 18px.
const bodyText = "font-sans text-base leading-[1.625] text-fg-2";

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const minutes = readingMinutes(post);
  const toc = [
    { id: POST_TLDR_ID, text: POST_TLDR_LABEL },
    ...[...post.sections.map(({ heading }) => heading), POST_FAQ_LABEL].map((text) => ({ id: headingId(text), text })),
  ];

  return (
    <article className="overflow-x-clip">
      {/* With a cover photo, the title (the page's one H1) goes on it, full screen and cinematic; the
          breadcrumb, tools and byline follow below it, with a visual repeat of the title. */}
      {post.cover && (
        <PostCover src={post.cover}>
          <h1 className="max-w-[18ch] font-heading text-[clamp(2.75rem,7vw,7.5rem)] font-semibold leading-[0.92] tracking-[-0.045em] text-fg-max text-balance">
            {post.title}
          </h1>
        </PostCover>
      )}
      {/* The article as one card. Under a cover it slides up over the pinned, darkening
          cover (globals.css, "Post cover"); data-covers-media tells the site header when it has
          covered the photo. */}
      <div data-covers-media className="post-card relative z-10 bg-bg">
        {/* The headline area has its own grid, matching the body's so the columns line up. */}
        <div className={`pt-e2 pb-e2 ${postGrid}`}>
          {/* Phones: breadcrumb, title, author, then dates and tools on one row. md+: tools share the breadcrumb row. 52px around the title. */}
          <header
            className={`relative isolate grid max-w-[700px] grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-8 [grid-template-areas:'breadcrumb_breadcrumb'_'title_title'_'author_author'_'date_tools'] md:gap-x-4 md:[grid-template-areas:'breadcrumb_tools'_'title_title'_'meta_meta'] lg:col-start-2`}
          >
            {/* Diagonal stripes lit around the title and fading out into the page, kept within the
                headline column and just past the author line: texture, not light (owner, 2026-10-25).
                Light mode shows them at half strength with a softer fade, dark mode at 70% so they
                don't compete with the title (owner, 2026-10-26). */}
            <div aria-hidden className="pointer-events-none absolute -inset-x-e1 -inset-y-e1 -z-10 [mask-image:radial-gradient(ellipse_closest-side_at_50%_45%,rgb(0_0_0/0.85)_15%,transparent)] opacity-70 light:opacity-50 light:[mask-image:radial-gradient(ellipse_closest-side_at_50%_45%,rgb(0_0_0/0.85),transparent)]">
              <StripedPattern className="stroke-[0.75] text-fg-muted" />
            </div>
            <nav aria-label="Breadcrumb" className="type-meta uppercase text-fg-2 [grid-area:breadcrumb]">
              <ol className="flex min-w-0 items-center gap-2">
                <li className="flex shrink-0">
                  <Link href="/" aria-label="Home" className="quiet-link">
                    <House className="size-3.5" aria-hidden />
                  </Link>
                </li>
                <li aria-hidden="true"><ChevronRight className="size-3.5" /></li>
                <li className="shrink-0">
                  <Link href="/blog" className="quiet-link">Blog</Link>
                </li>
                <li aria-hidden="true"><ChevronRight className="size-3.5" /></li>
                <li aria-current="page" className="min-w-0 max-w-[36ch] truncate text-fg-max">{post.category}</li>
              </ol>
            </nav>

            <div className="justify-self-end [grid-area:tools]">
              <PostTools post={post} />
            </div>

            {post.cover ? (
              // The H1 is on the cover; this repeat is visual only, so screen readers skip it.
              <p aria-hidden className={`my-5 ${headingStyle[1]} text-fg-max text-pretty [grid-area:title]`}>
                {post.title}
              </p>
            ) : (
              <h1 className={`my-5 ${headingStyle[1]} text-fg-max text-pretty [grid-area:title]`}>{post.title}</h1>
            )}

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
        </div>

        <div className={`pb-e3 ${postGrid}`}>
          {/* pt-1 centres the read time on the intro's first line. */}
          <aside aria-labelledby="toc-title" className="hidden pt-1 lg:col-start-1 lg:row-start-1 lg:block">
            <div className="sticky top-24">
              <p className="mb-8 flex items-center gap-2 type-meta text-fg-2">
                <Clock className="size-3.5" aria-hidden />
                {minutes} min read
              </p>
              <h2 id="toc-title" className="sr-only">On this page</h2>
              <PostToc entries={toc} />
            </div>
          </aside>

          <div className="max-w-[700px] lg:col-start-2 lg:row-start-1">
            <p className={bodyText}>{post.intro}</p>

            <section aria-labelledby={POST_TLDR_ID} className="mt-e1 rounded-sm border border-line bg-surface p-6">
              <div className="mb-4 flex items-center gap-2">
                <ListChecks className="size-4 text-fg-2" aria-hidden />
                <h2 id={POST_TLDR_ID} tabIndex={-1} className={`${headingStyle[5]} text-fg-max ${tocTarget}`}>{POST_TLDR_LABEL}</h2>
              </div>
              <ul className="list-disc space-y-2 pl-5 font-sans text-sm leading-normal text-fg-2">
                {post.tldr.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </section>

            {post.sections.map(({ heading, blocks }) => (
              <section key={heading} aria-labelledby={headingId(heading)} className="mt-e1">
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

            <div className="mt-e2">
              <FloodButton href={post.cta.href}>{post.cta.label}</FloodButton>
            </div>

            <section aria-labelledby={headingId(POST_FAQ_LABEL)} className="mt-e2">
              <h2 id={headingId(POST_FAQ_LABEL)} tabIndex={-1} className={sectionHeadingClass}>{POST_FAQ_LABEL}</h2>
              <PostFaqs faqs={post.faqs} bodyText={bodyText} />
            </section>
          </div>
        </div>
      </div>
    </article>
  );
}
