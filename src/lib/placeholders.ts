import type { FaqItem } from "@/components/faq";
import type { Testimonial } from "@/components/testimonials";

// Placeholders for the owner's copy on Home and About, sized like the real thing. Replace, don't edit.
export const WHO_LEAD = "Owner’s statement: who I am and who I write for, in one or two lines.";
export const WHO_BODY =
  "Owner’s paragraph: why buyers hire me, what they get, and where AI carries the load and where 20+ years of judgment takes over. Three or four sentences, written for the buyer rather than as a life story.";

export const STEPS = [
  { title: "Brief", body: "Owner’s line: what the client sends and what I read first." },
  { title: "Questions", body: "Owner’s line: what I ask before writing a word." },
  { title: "Draft", body: "Owner’s line: what the first draft is and when it arrives." },
  { title: "Refine", body: "Owner’s line: how feedback works and what the client ends with." },
];

export const FIGURES = [
  { value: "20+", label: "Owner’s label: years writing" },
  { value: "000", label: "Owner’s label: Fiverr reviews" },
  { value: "0.0", label: "Owner’s label: Fiverr rating" },
];

export const QUOTES: Testimonial[] = [
  {
    quote: "Placeholder for a real Fiverr review: two or three sentences on what changed for the client after the work.",
    name: "Client name",
    role: "Role, Company",
  },
  {
    quote: "A shorter placeholder review, one sentence long.",
    name: "Client name",
    role: "Role, Company",
  },
  {
    quote: "A longer placeholder review, to show how the card copes with length: four sentences or so, the sort a happy client leaves after a big project, naming the result and how it felt to work together.",
    name: "Client name",
    role: "Role, Company",
  },
];

export const FAQS: FaqItem[] = [
  { question: "Placeholder question: can I message you before ordering?", answer: "Owner’s answer." },
  { question: "Placeholder question: what do you need from me to start?", answer: "Owner’s answer." },
  { question: "Placeholder question: do you use AI to write?", answer: "Owner’s answer." },
  { question: "Placeholder question: how do revisions work?", answer: "Owner’s answer, pointing to the Fiverr package." },
  { question: "Placeholder question: which industries do you write for?", answer: "Owner’s answer." },
];
