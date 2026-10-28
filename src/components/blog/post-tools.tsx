"use client";

import { postMarkdown } from "@/lib/post-format";
import type { Post } from "@/lib/posts";
import { PageTools } from "@/components/page-tools";

export function PostTools({ post }: { post: Post }) {
  return <PageTools title={post.title} markdown={(url) => postMarkdown(post, url)} aiQuestion={post.aiQuestion} />;
}
