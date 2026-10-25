import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, House, ListChecks } from "lucide-react";
import { FloodButton } from "@/components/flood-button";
import { PostToc } from "@/components/blog/post-toc";
import { PostTools } from "@/components/blog/post-tools";
import { formatPublished, getPost, headingId, posts } from "@/lib/posts";

export const dynamicParams = false;

export function generateStaticParams() {
  return posts.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  return { title: { absolute: post?.title ?? "Not found" } };
}

const FAQ_HEADING = "FAQs";

// Section headings: targets for the TOC, which lands them 112px from the top.
const headingClass = "type-h3 text-fg-max scroll-mt-28";

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const toc = [...post.sections.map(({ heading }) => heading), FAQ_HEADING].map((text) => ({
    id: headingId(text),
    text,
  }));

  return (
    // From lg a TOC track sits left of the article (240px, then 288px at xl); below lg the TOC is hidden.
    <article className="shell pt-[84px] pb-[136px] lg:grid lg:grid-cols-[240px_minmax(0,700px)] lg:gap-x-[52px] xl:grid-cols-[288px_minmax(0,700px)] xl:gap-x-[84px]">
      {/* Phones: breadcrumb, title, author, then date and tools on one row. md+: tools share the breadcrumb row. */}
      <header className="grid max-w-[700px] grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-6 [grid-template-areas:'breadcrumb_breadcrumb'_'title_title'_'author_author'_'date_tools'] md:gap-x-4 md:[grid-template-areas:'breadcrumb_tools'_'title_title'_'meta_meta'] lg:col-start-2">
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

        <h1 className="type-h1 text-fg-max text-pretty [grid-area:title]">{post.title}</h1>

        <div className="contents md:flex md:items-center md:justify-between md:gap-8 md:border-t md:border-line md:pt-6 md:[grid-area:meta]">
          <div className="flex items-center gap-3 border-t border-line pt-6 [grid-area:author] md:border-0 md:pt-0">
            <div aria-label="Author avatar placeholder" className="grid size-9 place-items-center rounded-sm bg-raised font-heading text-sm text-fg">
              ER
            </div>
            <span className="font-sans text-sm font-medium text-fg-max">{post.author}</span>
          </div>
          <time dateTime={post.published} className="type-meta text-fg-2 [grid-area:date]">
            <span className="hidden sm:inline">Published </span>{formatPublished(post.published)}
          </time>
        </div>
      </header>

      {/* pt-1 centres the TOC's first line on the intro's first line. */}
      <aside className="mt-[52px] hidden pt-1 lg:col-start-1 lg:row-start-2 lg:block">
        <div className="sticky top-24">
          <PostToc entries={toc} />
        </div>
      </aside>

      <div className="mt-[52px] max-w-[700px] lg:col-start-2 lg:row-start-2">
        <p className="type-editorial text-fg-2">{post.intro}</p>

        <section aria-labelledby="tldr-title" className="mt-[52px] rounded-sm border border-line bg-surface p-6">
          <div className="mb-4 flex items-center gap-2">
            <ListChecks className="size-4 text-fg-2" aria-hidden />
            <h2 id="tldr-title" className="type-meta uppercase text-fg-2">TL;DR</h2>
          </div>
          <ul className="list-disc space-y-2 pl-5 type-editorial text-fg-2">
            {post.tldr.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </section>

        {post.sections.map(({ heading, paragraphs }) => (
          <section key={heading} aria-labelledby={headingId(heading)} className="mt-[52px]">
            <h2 id={headingId(heading)} tabIndex={-1} className={headingClass}>{heading}</h2>
            <div className="mt-6 space-y-6 type-editorial text-fg-2">
              {paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            </div>
          </section>
        ))}

        <div className="mt-[84px]">
          <FloodButton href={post.cta.href}>{post.cta.label}</FloodButton>
        </div>

        <section aria-labelledby={headingId(FAQ_HEADING)} className="mt-[84px]">
          <h2 id={headingId(FAQ_HEADING)} tabIndex={-1} className={headingClass}>{FAQ_HEADING}</h2>
        </section>
      </div>
    </article>
  );
}
