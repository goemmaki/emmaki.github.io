// Sätteri HAST plugin (Astro 7's Markdown engine; unified rehype plugins are ignored)
// for collection MDX bodies (src/content/<collection>/). Each `##`
// heading starts a <section> labelled by it; the content up to the next `##`
// goes in a body <div>. Headings, links and lone images get their collection's
// classes from PROSE. Content before the first `##` is not allowed.
import type { HastPluginDefinition } from "satteri";
import { fileURLToPath } from "node:url";
import { headingId } from "./post-format";
import { PROSE, type ProseStyle } from "./prose";

type Node = { type: string; tagName?: string; name?: string; value?: string; properties?: Record<string, unknown>; attributes?: { type: string; name: string; value?: unknown }[]; children?: Node[] };

const el = (tagName: string, properties: Record<string, unknown>, children: Node[]): Node => ({ type: "element", tagName, properties: Object.fromEntries(Object.entries(properties).filter(([, value]) => value !== "")), children });
const text = (node: Node): string => node.value ?? (node.children ?? []).map(text).join("");
const isImage = (node: Node) => (node.type === "element" && node.tagName === "img") || (node.type.startsWith("mdxJsx") && node.name === "__AstroImage__");
const blank = (node: Node) => node.type === "text" && !node.value?.trim();

function addClass(node: Node, className: string) {
  if (node.type === "element") node.properties = { ...node.properties, className };
  else (node.attributes ??= []).push({ type: "mdxJsxAttribute", name: "class", value: className });
}

function attr(node: Node, name: string) {
  return node.type === "element" ? node.properties?.[name] : node.attributes?.find((a) => a.name === name)?.value;
}

function styleBlock(node: Node, style: ProseStyle): Node {
  if (node.type !== "element") return node;
  const level = Number(node.tagName?.match(/^h([3-6])$/)?.[1]);
  if (level) addClass(node, style.subheading(level as 3 | 4 | 5 | 6));
  const content = (node.children ?? []).filter((child) => !blank(child));
  if (node.tagName === "p" && content.length === 1 && isImage(content[0])) {
    const image = content[0], caption = attr(image, "title");
    addClass(image, style.image);
    if (image.type === "element") delete image.properties?.title;
    else image.attributes = image.attributes?.filter((a) => a.name !== "title");
    return el("figure", { className: style.figure }, [image, ...(caption ? [el("figcaption", { className: style.caption }, [{ type: "text", value: String(caption) }])] : [])]);
  }
  const visit = (n: Node) => { if (n.type === "element" && n.tagName === "a") addClass(n, style.link); n.children?.forEach(visit); };
  visit(node);
  return node;
}

function sectionTree(tree: Node, file: { path?: string }) {
  {
    const collection = file.path?.match(/src\/content\/(blog|work)\//)?.[1] as keyof typeof PROSE | undefined;
    if (!collection) return null;
    const style = PROSE[collection];
    const sections: Node[] = [];
    const rest: Node[] = [];
    for (const node of tree.children ?? []) {
      if (node.type === "element" && node.tagName === "h2") {
        const id = String(node.properties?.id ?? headingId(text(node)));
        node.properties = { ...node.properties, id, tabIndex: -1, className: style.h2 };
        const first = sections.length === 0;
        sections.push(el("section", { ariaLabelledBy: id, className: first && style.firstSection !== undefined ? style.firstSection : style.section }, [node, el("div", { className: style.sectionBody }, [])]));
      } else if (sections.length === 0) {
        if (node.type === "element") throw new Error(`${file.path}: content before the first ## heading`);
        rest.push(node);
      } else if (!blank(node)) {
        sections.at(-1)!.children![1].children!.push(styleBlock(node, style));
      }
    }
    return { ...tree, children: [...rest, ...sections] };
  }
}

const sectionsPlugin = {
  name: "collection-sections",
  before(root, ctx) {
    const path = ctx.fileURL && fileURLToPath(ctx.fileURL);
    // Plain copies: the visitor tree is frozen and lazily read.
    const next = sectionTree(JSON.parse(JSON.stringify(root)), { path });
    if (next) ctx.replaceNode(root, next as never);
  },
} satisfies HastPluginDefinition;

export default sectionsPlugin;
