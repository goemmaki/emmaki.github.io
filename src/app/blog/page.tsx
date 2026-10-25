import BlogPostPage, { generateMetadata as postMetadata } from "./[slug]/page";
import { posts } from "@/lib/posts";

// Until the blog index is designed, /blog shows the placeholder post (the first in posts).
const params = Promise.resolve({ slug: posts[0].slug });

export function generateMetadata() {
  return postMetadata({ params });
}

export default function BlogPage() {
  return <BlogPostPage params={params} />;
}
