/** A run of paragraph text, or an inline link. */
export type PostInline = string | { text: string; href: string };
/** A paragraph: plain text, or runs with inline links. */
export type PostParagraph = string | PostInline[];
/** A paragraph, a subheading inside a section, or an image. */
export type PostBlock =
  | PostParagraph
  | { level: 3 | 4 | 5 | 6; text: string }
  | { image: string; width: number; height: number; alt: string; caption?: string };
export type PostSection = { heading: string; blocks: PostBlock[] };
export type PostFaq = { question: string; answer: string };

export type Post = {
  slug: string;
  title: string;
  category: string;
  author: string;
  published: string;
  /** Set only when the post was revised after publishing. */
  updated?: string;
  /** The question Ask AI opens with, about this page. */
  aiQuestion?: string;
  /** The action after the article. */
  cta: { label: string; href: string };
  intro: string;
  tldr: string[];
  sections: PostSection[];
  faqs: PostFaq[];
};

const placeholderParagraphs: PostParagraph[] = [
  "This is a placeholder paragraph for the article body. It gives the page enough text to show the reading measure, line spacing and rhythm without adding finished copy.",
  [
    "This is a second placeholder paragraph with ",
    { text: "a placeholder link", href: "/work" },
    " in it. Replace it with owner-written copy when the article is ready, keeping the same paragraph structure for the layout review.",
  ],
  "This is a third placeholder paragraph to show how the article continues down the page and how the section spacing feels in context.",
];

export const posts: Post[] = [
  {
    slug: "placeholder-post",
    title: "Placeholder post title that runs long enough to wrap onto a second line",
    category: "Category",
    author: "Emma Rawson",
    published: "2026-10-20",
    updated: "2026-10-25",
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
          {
            image: "/blog/placeholder-art-1.svg",
            width: 1400,
            height: 788,
            alt: "Placeholder art: a yellow square beside a gray circle",
            caption: "Placeholder caption for the first image.",
          },
          { level: 4, text: "Placeholder subheading (H4)" },
          placeholderParagraphs[2],
          { level: 5, text: "Placeholder subheading (H5)" },
          placeholderParagraphs[0],
          { level: 6, text: "Placeholder subheading (H6)" },
          placeholderParagraphs[1],
          {
            image: "/blog/placeholder-art-2.svg",
            width: 1400,
            height: 933,
            alt: "Placeholder art: a gray mountain shape under a black sun",
          },
          placeholderParagraphs[2],
        ],
      },
      ...[
      "Placeholder section heading two",
      "Placeholder section heading three",
      "Placeholder section heading four that runs much longer than the others",
      "Placeholder section heading five",
      ].map((heading) => ({ heading, blocks: placeholderParagraphs })),
    ],
    faqs: [
      {
        question: "Placeholder question one?",
        answer: "Placeholder answer one. It runs to two sentences so the open panel shows a real paragraph.",
      },
      {
        question: "Placeholder question two that runs long enough to wrap onto a second line on narrow screens?",
        answer: "Placeholder answer two.",
      },
      {
        question: "Placeholder question three?",
        answer:
          "Placeholder answer three. This one is longer, to show how a fuller answer sits under its question and how the panel opens to fit it. Replace it with owner-written copy.",
      },
      {
        question: "Placeholder question four?",
        answer: "Placeholder answer four. It runs to two sentences so the open panel shows a real paragraph.",
      },
      {
        question: "Placeholder question five?",
        answer: "Placeholder answer five.",
      },
    ],
  },
];

/** A paragraph as plain text. */
export function paragraphText(paragraph: PostParagraph) {
  return typeof paragraph === "string" ? paragraph : paragraph.map((run) => (typeof run === "string" ? run : run.text)).join("");
}

/** A paragraph as Markdown, links as [text](href). */
function paragraphMarkdown(paragraph: PostParagraph) {
  return typeof paragraph === "string"
    ? paragraph
    : paragraph.map((run) => (typeof run === "string" ? run : `[${run.text}](${run.href})`)).join("");
}

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
      ...blocks.map((block) =>
        typeof block === "string" || Array.isArray(block)
          ? paragraphMarkdown(block)
          : "image" in block
            ? `![${block.alt}](${block.image})`
            : `${"#".repeat(block.level)} ${block.text}`,
      ),
    ]),
    "## FAQs",
    ...post.faqs.flatMap(({ question, answer }) => [`### ${question}`, answer]),
  ].join("\n\n");
}

/** Whole minutes to read the post at 230 words a minute, at least 1. */
export function readingMinutes(post: Post) {
  const text = [
    post.title,
    post.intro,
    ...post.tldr,
    ...post.sections.flatMap(({ heading, blocks }) => [
      heading,
      ...blocks.map((block) =>
        typeof block === "string" || Array.isArray(block) ? paragraphText(block) : "image" in block ? (block.caption ?? "") : block.text,
      ),
    ]),
    ...post.faqs.flatMap(({ question, answer }) => [question, answer]),
  ].join(" ");
  return Math.max(1, Math.round(text.split(/\s+/).filter(Boolean).length / 230));
}

export function getPost(slug: string) {
  return posts.find((post) => post.slug === slug);
}
