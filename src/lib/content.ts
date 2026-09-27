import type { MarkName } from "@/components/glyphs/mark";

/*
 * Portfolio content. Every project below is a PLACEHOLDER — replace with real,
 * sourced work before publishing. Never invent clients, metrics, or results.
 */

export type Register = "authored" | "machine";

export type Project = {
  slug: string;
  title: string;
  kind: string;
  year: string;
  mark: MarkName;
  register: Register;
  summary: string;
  placeholder: boolean;
  scope: string[];
  stack?: string[];
};

export const projects: Project[] = [
  {
    slug: "positioning-rebuild",
    title: "Positioning rebuild for a technical B2B product",
    kind: "Positioning & messaging",
    year: "2026",
    mark: "semicolon",
    register: "authored",
    summary:
      "Finding the one commercial angle a crowded category had missed, then carrying it through site, deck, and sales narrative.",
    placeholder: true,
    scope: ["Messaging framework", "Homepage", "Sales narrative"],
  },
  {
    slug: "launch-narrative",
    title: "Launch narrative for a complex platform release",
    kind: "Launch copy",
    year: "2026",
    mark: "colon",
    register: "authored",
    summary:
      "A launch story that let buyers understand a multi-part release in one read, from announcement to product pages.",
    placeholder: true,
    scope: ["Launch page", "Announcement", "Email sequence"],
  },
  {
    slug: "content-engine",
    title: "Knowledge-grounded content engine",
    kind: "AI content strategy",
    year: "2025",
    mark: "dash",
    register: "machine",
    summary:
      "An editorial system that drafts from verified source material and routes every piece through human review before it ships.",
    placeholder: true,
    scope: ["Content strategy", "Voice system", "Editorial QA"],
    stack: ["Claude Code", "n8n"],
  },
  {
    slug: "research-to-draft",
    title: "Research-to-draft automation",
    kind: "Workflow build",
    year: "2025",
    mark: "pilcrow",
    register: "machine",
    summary:
      "A pipeline that turns scattered research into structured first drafts, leaving the judgment calls to an editor.",
    placeholder: true,
    scope: ["Workflow design", "Prompt architecture", "Handoff docs"],
    stack: ["Make", "Codex"],
  },
  {
    slug: "sales-page-system",
    title: "Sales-page system for a service business",
    kind: "Conversion copy",
    year: "2025",
    mark: "period",
    register: "authored",
    summary:
      "A reusable page structure and copy library so every new offer launches with the same clarity.",
    placeholder: true,
    scope: ["Sales pages", "Copy library", "Offer framing"],
  },
];

export const services = [
  {
    title: "Positioning & messaging",
    body: "Find the sharp commercial angle, then say it so buyers get it the first time.",
    register: "authored" as Register,
  },
  {
    title: "Web, launch & sales copy",
    body: "Pages, launches, and sales narratives for offers that are hard to explain.",
    register: "authored" as Register,
  },
  {
    title: "AI content strategy",
    body: "Voice systems, knowledge-grounded workflows, and editorial QA so AI output still sounds like you.",
    register: "machine" as Register,
  },
  {
    title: "Automation builds",
    body: "Claude Code, Codex, n8n, and Make pipelines with an experienced editor in the loop.",
    register: "machine" as Register,
  },
];

export const process: { step: string; note: string; register: Register }[] = [
  { step: "Brief", note: "Stakes, buyer, offer", register: "authored" },
  { step: "Angle", note: "The one thing to say", register: "authored" },
  { step: "Research", note: "Sources, gathered at scale", register: "machine" },
  { step: "Draft", note: "Written with judgment", register: "authored" },
  { step: "Scale", note: "Variants, formats, systems", register: "machine" },
  { step: "Edit", note: "Nothing ships unread", register: "authored" },
];

export const tools = ["Claude Code", "Codex", "n8n", "Make"];
