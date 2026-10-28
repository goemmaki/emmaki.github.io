"use client";

import { PageTools } from "@/components/page-tools";

type Fact = { label: string; value: string };
type Section = { heading: string; paragraphs: string[] };

/** The case study as Markdown, for "Copy as .md". */
function caseStudyMarkdown(title: string, facts: Fact[], sections: Section[], url: string) {
  return [
    `# ${title}`,
    url,
    facts.map(({ label, value }) => `- ${label}: ${value}`).join("\n"),
    ...sections.flatMap(({ heading, paragraphs }) => [`## ${heading}`, ...paragraphs]),
  ].join("\n\n");
}

// Copy page and Share, with the assistants as badges beneath, for a case study's sticky column.
export function CaseStudyTools({ title, facts, sections, aiQuestion }: { title: string; facts: Fact[]; sections: Section[]; aiQuestion?: string }) {
  return (
    <PageTools
      title={title}
      markdown={(url) => caseStudyMarkdown(title, facts, sections, url)}
      aiQuestion={aiQuestion}
      ai="badges"
    />
  );
}
