import { PageTools } from '@/components/page-tools';
import type { Post } from '@/lib/posts';

export function PostTools({ post, markdown }: { post: Post; markdown: string }) {
  return <PageTools title={post.title} markdown={url => markdown.replace('__PAGE_URL__', url)} aiQuestion={post.aiQuestion} />;
}
