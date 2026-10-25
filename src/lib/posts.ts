/** A paragraph, or a subheading inside a section. */
export type PostBlock = string | { level: 3 | 4 | 5 | 6; text: string };
export type PostSection = { heading: string; blocks: PostBlock[] };

export type Post = {
  slug: string;
  title: string;
  category: string;
  author: string;
  published: string;
  /** The question Ask AI opens with, about this page. */
  aiQuestion?: string;
  /** The action after the article. */
  cta: { label: string; href: string };
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
    cta: { label: "See my X work", href: "/work" },
    intro:
      "This is the placeholder intro paragraph. It sits level with the top of the table of contents and runs ahead of the TL;DR.",
    tldr: ["Placeholder takeaway one…", "Placeholder takeaway two…", "Placeholder takeaway three…"],
    sections: [
      {
        // Every heading level, for reviewing the hierarchy.
        heading: "Placeholder section heading one (H2)",
        blocks: [
          placeholderParagraphs[0],
          { level: 3, text: "Placeholder subheading (H3)" },
          placeholderParagraphs[1],
          { level: 4, text: "Placeholder subheading (H4)" },
          placeholderParagraphs[2],
          { level: 5, text: "Placeholder subheading (H5)" },
          placeholderParagraphs[0],
          { level: 6, text: "Placeholder subheading (H6)" },
          placeholderParagraphs[1],
        ],
      },
      ...[
      "Placeholder section heading two",
      "Placeholder section heading three",
      "Placeholder section heading four that runs much longer than the others",
      "Placeholder section heading five",
      ].map((heading) => ({ heading, blocks: placeholderParagraphs })),
    ],
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
    ...post.sections.flatMap(({ heading, blocks }) => [
      `## ${heading}`,
      ...blocks.map((block) => (typeof block === "string" ? block : `${"#".repeat(block.level)} ${block.text}`)),
    ]),
  ].join("\n\n");
}

export function getPost(slug: string) {
  return posts.find((post) => post.slug === slug);
}
