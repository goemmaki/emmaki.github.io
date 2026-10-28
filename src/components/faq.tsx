"use client";

import { Accordion } from "@base-ui/react/accordion";
import { Minus, Plus } from "lucide-react";

export type FaqItem = { question: string; answer: string };

// The site's FAQ (blog posts, About). After grafit.agency's article FAQs: hairline-divided rows, the
// question as an h3 button with the icon on the right, and the answer opening to its height. + opens,
// − closes. After bymonolog.com's FAQ: hovering, focusing or opening a question lights its row in
// reversed ink and steps the text in ("Faq" in globals.css). Closed answers stay in the page
// (hidden="until-found"), so find-in-page still reaches them.
export function Faq({ faqs, bodyText }: { faqs: FaqItem[]; bodyText: string }) {
  return (
    <Accordion.Root multiple hiddenUntilFound className="mt-2">
      {faqs.map(({ question, answer }) => (
        <Accordion.Item key={question} className="border-b border-line">
          <Accordion.Header>
            <Accordion.Trigger className="faq-trigger group flex w-full items-center justify-between gap-6 py-6 text-left font-heading text-lg font-normal leading-[1.4]">
              {question}
              <Plus className="size-6 shrink-0 group-data-[panel-open]:hidden" aria-hidden />
              <Minus className="hidden size-6 shrink-0 group-data-[panel-open]:block" aria-hidden />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel className="h-(--accordion-panel-height) overflow-hidden transition-[height] duration-300 ease-out data-[ending-style]:h-0 data-[starting-style]:h-0">
            <p className={`pt-4 pb-6 ${bodyText}`}>{answer}</p>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
