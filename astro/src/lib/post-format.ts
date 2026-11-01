import type { Post, PostParagraph } from "./posts";

export const POST_TLDR_ID = "tldr";
export const POST_TLDR_LABEL = "TL;DR";
export const POST_FAQ_LABEL = "FAQs";

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
    `## ${POST_TLDR_LABEL}`,
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
    `## ${POST_FAQ_LABEL}`,
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
