import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ListChecks } from "lucide-react";
import { PostTools } from "@/components/blog/post-tools";
import { formatPublished, getPost, posts } from "@/lib/posts";

export const dynamicParams = false;

export function generateStaticParams() {
  return posts.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  return { title: { absolute: post?.title ?? "Not found" } };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const date = formatPublished(post.published);

  return (
    <article className="shell pt-[84px] pb-[136px]">
      <div className="max-w-[700px]">
        <nav aria-label="Breadcrumb" className="type-meta uppercase text-fg-2">
          <ol className="flex min-w-0 items-center gap-2">
            <li className="shrink-0">
              <Link href="/blog" className="hover:text-fg-max focus-visible:text-fg-max">Blog</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="min-w-0 max-w-[36ch] truncate">{post.category}</li>
          </ol>
        </nav>

        <h1 className="mt-4 type-h1 text-fg-max text-balance">{post.title}</h1>

        <div className="mt-6 flex flex-wrap justify-between gap-x-8 gap-y-3 border-t border-line pt-6">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <div className="flex items-center gap-3">
              <div aria-label="Author avatar placeholder" className="grid size-9 place-items-center rounded-sm bg-raised font-heading text-lg text-fg">
                e
              </div>
              <span className="font-sans text-sm font-medium text-fg">{post.author}</span>
            </div>
            <time dateTime={post.published} className="type-meta text-fg-2">
              <span className="hidden md:inline">Published </span>{date}
            </time>
          </div>
          <PostTools post={post} />
        </div>

        <section aria-labelledby="tldr-title" className="mt-[52px] rounded-sm border border-line bg-surface p-6">
          <div className="mb-4 flex items-center gap-2">
            <ListChecks className="size-4 text-fg-2" aria-hidden />
            <h2 id="tldr-title" className="type-meta uppercase text-fg-2">TL;DR</h2>
          </div>
          <ul className="list-disc space-y-2 pl-5 type-editorial text-fg">
            {post.tldr.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </section>

        <div className="mt-[52px] space-y-6 type-editorial text-fg">
          {post.body.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        </div>
      </div>
    </article>
  );
}
