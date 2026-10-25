export type Post = {
  slug: string;
  title: string;
  category: string;
  author: string;
  published: string;
  tldr: string[];
  body: string[];
};

export const posts: Post[] = [
  {
    slug: "placeholder-post",
    title: "Placeholder post title that runs long enough to wrap onto a second line",
    category: "Category",
    author: "emmaki",
    published: "2026-10-25",
    tldr: [
      "Placeholder takeaway one…",
      "Placeholder takeaway two…",
      "Placeholder takeaway three…",
    ],
    body: [
      "This is a placeholder paragraph for the article body. It gives the page enough text to show the reading measure, line spacing and rhythm without adding finished copy.",
      "This is a second placeholder paragraph. Replace it with owner-written copy when the article is ready, keeping the same paragraph structure for the layout review.",
      "This is a third placeholder paragraph to show how the article continues down the page and how the section spacing feels in context.",
    ],
  },
];

/** "25 Oct 2026" from an ISO date, the same on server and client. */
export function formatPublished(isoDate: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${isoDate}T00:00:00Z`));
}

export function getPost(slug: string) {
  return posts.find((post) => post.slug === slug);
}
