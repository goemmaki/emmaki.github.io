export type PostSection = { heading: string; paragraphs: string[] };

export type Post = {
  slug: string;
  title: string;
  category: string;
  author: string;
  published: string;
  /** The question Ask AI opens with, about this page. */
  aiQuestion?: string;
  intro: string;
  tldr: string[];
  sections: PostSection[];
};

const placeholderParagraphs = [
  "This is a placeholder paragraph for the article body. It gives the page enough text to show the reading measure, line spacing and rhythm without adding finished copy.",
  "This is a second placeholder paragraph. Replace it with owner-written copy when the article is ready, keeping the same paragraph structure for the layout review.",
  "This is a third placeholder paragraph to show how the article continues down the page and how the section spacing feels in context.",
];

export const posts: Post[] = [
  {
    slug: "placeholder-post",
    title: "Placeholder post title that runs long enough to wrap onto a second line",
    category: "Category",
    author: "Emma Rawson",
    published: "2026-10-25",
    aiQuestion: "Using this article, evaluate where AI-generated content could be damaging my brand.",
    intro:
      "This is the placeholder intro paragraph. It sits level with the top of the table of contents and runs ahead of the TL;DR.",
    tldr: ["Placeholder takeaway one…", "Placeholder takeaway two…", "Placeholder takeaway three…"],
    sections: [
      "Placeholder section heading one",
      "Placeholder section heading two",
      "Placeholder section heading three",
      "Placeholder section heading four that runs much longer than the others",
      "Placeholder section heading five",
    ].map((heading) => ({ heading, paragraphs: placeholderParagraphs })),
  },
];

/** "October 25, 2026" from an ISO date, the same on server and client. */
export function formatPublished(isoDate: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${isoDate}T00:00:00Z`));
}

/** URL fragment for a heading, e.g. "placeholder-section-heading-one". */
export function headingId(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

/** The post as Markdown, for "Copy as .md". */
export function postMarkdown(post: Post, url: string) {
  return [
    `# ${post.title}`,
    `${post.author} · ${formatPublished(post.published)} · ${post.category}`,
    url,
    "## TL;DR",
    post.tldr.map((item) => `- ${item}`).join("\n"),
    post.intro,
    ...post.sections.flatMap(({ heading, paragraphs }) => [`## ${heading}`, ...paragraphs]),
  ].join("\n\n");
}

export function getPost(slug: string) {
  return posts.find((post) => post.slug === slug);
}
