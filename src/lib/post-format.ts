import type { CollectionEntry } from "astro:content";

type Post = CollectionEntry<"blog">;

const postImages = import.meta.glob('../content/blog/*/*.{avif,gif,jpeg,jpg,png,svg,webp}', {
  eager: true,
  query: '?url&no-inline',
  import: 'default',
}) as Record<string, string>;

export const POST_TLDR_ID = "tldr";
export const POST_TLDR_LABEL = "TL;DR";
export const POST_FAQ_LABEL = "FAQs";

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

/** The MDX body without comments or ESM lines. */
function stripMdx(body: string) {
  return body.replace(/\{\/\*[\s\S]*?\*\/\}\n?/g, "").replace(/^(import|export) .*\n/gm, "").trim();
}

/** The MDX body as plain Markdown; image titles (captions) removed. */
function bodyMarkdown(body: string) {
  return stripMdx(body).replace(/(!\[[^\]]*\]\([^)\s]+) "[^"]*"\)/g, "$1)");
}

function emittedImageUrls(post: Post, body: string) {
  const folder = post.id.split('/')[0];
  const prefix = `../content/blog/${folder}/`;
  return body.replace(/(!\[[^\]]*\]\()\.\/([^\s)]+)(\))/g, (_match, start: string, file: string, end: string) => {
    const assetUrl = postImages[`${prefix}${file}`];
    if (!assetUrl) throw new Error(`Missing imported post image URL for ${post.id}: ${file}`);
    return `${start}${assetUrl}${end}`;
  });
}

/** The post as Markdown, for "Copy as .md". */
export function postMarkdown(post: Post, url: string) {
  const { data, body = "" } = post;
  return [
    `# ${data.title}`,
    `${data.author} · ${formatPublished(data.published)} · ${data.category}`,
    url,
    `## ${POST_TLDR_LABEL}`,
    data.tldr.map((item) => `- ${item}`).join("\n"),
    data.intro,
    emittedImageUrls(post, bodyMarkdown(body)),
    `## ${POST_FAQ_LABEL}`,
    ...data.faqs.flatMap(({ question, answer }) => [`### ${question}`, answer]),
  ].join("\n\n");
}

/** Whole minutes to read the post at 230 words a minute, at least 1. Image alt text doesn't count; captions do. */
export function readingMinutes({ data, body = "" }: Post) {
  return pageReadingMinutes(body, [data.title, data.intro, ...data.tldr], data.faqs);
}

/** Minutes to read an MDX body plus a page's other text and FAQs, at 230 words a minute. */
export function pageReadingMinutes(body: string, extra: string[], faqs: { question: string; answer: string }[]) {
  const prose = stripMdx(body)
    .replace(/!\[[^\]]*\]\([^)\s]+(?: "([^"]*)")?\)/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^#+ /gm, "");
  const text = [...extra, prose, ...faqs.flatMap(({ question, answer }) => [question, answer])].join(" ");
  return Math.max(1, Math.round(text.split(/\s+/).filter(Boolean).length / 230));
}
