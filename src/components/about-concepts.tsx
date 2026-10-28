"use client";

import { useSyncExternalStore } from "react";
import { ClientSlots } from "@/components/client-slots";
import { Faq, type FaqItem } from "@/components/faq";
import { Testimonials, type Testimonial } from "@/components/testimonials";

// About-page layout concepts under review (owner, 2026-10-28): /about?v=ledger|split|statement. The
// switcher in the corner is for review only and goes once the owner picks one. Every line of text
// here is a placeholder for the owner's copy, sized like the real thing.
const CONCEPTS = {
  ledger: "Ledger",
  split: "Split",
  statement: "Statement",
} as const;
type Concept = keyof typeof CONCEPTS;
const EVENT = "about-concept";
const subscribe = (onChange: () => void) => {
  addEventListener(EVENT, onChange);
  return () => removeEventListener(EVENT, onChange);
};
const read = (): Concept => {
  const v = new URLSearchParams(location.search).get("v");
  return v && v in CONCEPTS ? (v as Concept) : "ledger";
};
const choose = (v: Concept) => {
  const url = new URL(location.href);
  url.searchParams.set("v", v);
  history.replaceState(history.state, "", url);
  dispatchEvent(new Event(EVENT));
};

const WHO_LEAD = "Owner’s statement: who I am and who I write for, in one or two lines.";
const WHO_BODY =
  "Owner’s paragraph: why buyers hire me, what they get, and where AI carries the load and where 20+ years of judgment takes over. Three or four sentences, written for the buyer rather than as a life story.";
const STEPS = [
  { title: "Brief", body: "Owner’s line: what the client sends and what I read first." },
  { title: "Questions", body: "Owner’s line: what I ask before writing a word." },
  { title: "Draft", body: "Owner’s line: what the first draft is and when it arrives." },
  { title: "Refine", body: "Owner’s line: how feedback works and what the client ends with." },
];
const FIGURES = [
  { value: "20+", label: "years writing" },
  { value: "000", label: "Fiverr reviews (owner’s figure)" },
  { value: "0.0", label: "Fiverr rating (owner’s figure)" },
];
const QUOTES: Testimonial[] = [
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
    quote: "A longer placeholder review, to show how the block copes with length: four sentences or so, the sort a happy client leaves after a big project, naming the result and how it felt to work together.",
    name: "Client name",
    role: "Role, Company",
  },
];
const FAQS: FaqItem[] = [
  { question: "Placeholder question: can I message you before ordering?", answer: "Owner’s answer." },
  { question: "Placeholder question: what do you need from me to start?", answer: "Owner’s answer." },
  { question: "Placeholder question: do you use AI to write?", answer: "Owner’s answer." },
  { question: "Placeholder question: how do revisions work?", answer: "Owner’s answer, pointing to the Fiverr package." },
  { question: "Placeholder question: which industries do you write for?", answer: "Owner’s answer." },
];

const Label = ({ n, children }: { n?: string; children: string }) => (
  <h2 className="type-meta text-fg-2">
    {n && <span className="text-fg-max">{n} </span>}
    {children}
  </h2>
);

const Portrait = ({ className }: { className?: string }) => (
  <div className={`grid aspect-[4/5] place-items-center border border-line type-meta text-fg-2 ${className ?? ""}`}>
    Portrait (owner’s photo)
  </div>
);

// The figures, value above label. big: the covers' Geist 600, set huge ("about-figure" in globals.css).
const Figures = ({ big = false }: { big?: boolean }) => (
  <dl className="grid border-t border-line sm:grid-cols-3">
    {FIGURES.map((f) => (
      <div
        key={f.label}
        className="flex flex-col-reverse gap-2 border-b border-line py-6 sm:border-b-0 sm:border-r sm:px-6 sm:first:pl-0 sm:last:border-r-0"
      >
        <dt className="type-secondary text-fg-2">{f.label}</dt>
        <dd className={big ? "about-figure text-fg-max" : "type-h2 text-fg-max"}>{f.value}</dd>
      </div>
    ))}
  </dl>
);

const BODY = "type-editorial text-fg-2";

export function AboutConcepts() {
  const concept = useSyncExternalStore(subscribe, read, () => "ledger" as const);

  return (
    <>
      {concept === "ledger" && (
        // A ledger: every section is one ruled row, its mono label in columns 1-3 and its content
        // from column 4. The client strip runs the full width between the intro and the rest.
        <>
          <section className="shell py-e2">
            <ClientSlots />
          </section>
          {[
            {
              n: "01",
              label: "Who I am",
              body: (
                <div className="flex flex-col gap-6">
                  <p className="type-h3 text-fg-max">{WHO_LEAD}</p>
                  <p className={`max-w-[60ch] ${BODY}`}>{WHO_BODY}</p>
                </div>
              ),
            },
            {
              n: "02",
              label: "How I work",
              body: (
                <ol className="grid gap-x-(--gutter) gap-y-8 sm:grid-cols-2">
                  {STEPS.map((s, i) => (
                    <li key={s.title} className="flex flex-col gap-2">
                      <span className="type-meta text-fg-2">{String(i + 1).padStart(2, "0")}</span>
                      <h3 className="type-h3 text-fg-max">{s.title}</h3>
                      <p className={BODY}>{s.body}</p>
                    </li>
                  ))}
                </ol>
              ),
            },
            {
              n: "03",
              label: "Proof",
              body: (
                <div className="flex flex-col gap-e1">
                  <Figures />
                  <Testimonials items={QUOTES} className="max-w-[60ch]" />
                </div>
              ),
            },
            { n: "04", label: "Questions", body: <Faq faqs={FAQS} bodyText={BODY} /> },
          ].map((row) => (
            <section key={row.n} className="shell">
              <div className="grid grid-cols-12 gap-x-(--gutter) gap-y-6 border-t border-line py-e1">
                <div className="col-span-12 lg:col-span-3">
                  <Label n={row.n}>{row.label}</Label>
                </div>
                <div className="col-span-12 lg:col-span-9">{row.body}</div>
              </div>
            </section>
          ))}
        </>
      )}

      {concept === "split" && (
        // Two columns, after bymonolog.com: on the left a sticky column with the portrait and the
        // quotes on their timer; on the right everything else scrolls past. Narrow screens stack.
        <>
          <section className="shell grid gap-e1 py-e2 lg:grid-cols-[1fr_2fr]">
            <aside className="flex flex-col gap-e1 lg:sticky lg:top-24 lg:self-start">
              <Portrait className="max-w-80" />
              <Testimonials items={QUOTES} />
            </aside>
            <div className="flex flex-col gap-e2">
              <div className="flex flex-col gap-6">
                <Label n="01">Who I am</Label>
                <p className="type-h2 text-fg-max">{WHO_LEAD}</p>
                <p className={`max-w-[60ch] ${BODY}`}>{WHO_BODY}</p>
              </div>
              <div className="flex flex-col gap-6">
                <Label n="02">How I work</Label>
                <ol className="border-t border-line">
                  {STEPS.map((s, i) => (
                    <li key={s.title} className="grid grid-cols-[4rem_1fr] gap-x-6 border-b border-line py-6 sm:grid-cols-[4rem_12rem_1fr]">
                      <span className="type-meta text-fg-2">{String(i + 1).padStart(2, "0")}</span>
                      <h3 className="type-h3 text-fg-max">{s.title}</h3>
                      <p className={`col-start-2 sm:col-start-3 ${BODY}`}>{s.body}</p>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="flex flex-col gap-6">
                <Label n="03">Proof</Label>
                <Figures />
              </div>
              <div className="flex flex-col gap-2">
                <Label n="04">Questions</Label>
                <Faq faqs={FAQS} bodyText={BODY} />
              </div>
            </div>
          </section>
          <section className="shell pb-e2">
            <ClientSlots />
          </section>
        </>
      )}

      {concept === "statement" && (
        // Big type carries it: the who in the closing's two tones, the figures set huge, the steps
        // in four columns, one large quote at a time, then the questions beside their heading.
        <>
          <section className="shell py-e2">
            <p className="type-h2 max-w-[24ch] text-balance">
              <span className="text-fg-2">Owner’s setup line, in gray. </span>
              <span className="text-fg-max">{WHO_LEAD}</span>
            </p>
            <p className={`mt-e1 max-w-[60ch] ${BODY}`}>{WHO_BODY}</p>
          </section>
          <section className="shell pb-e2">
            <Figures big />
          </section>
          <section className="shell pb-e2">
            <ClientSlots />
          </section>
          <section className="shell pb-e2">
            <Label>How I work</Label>
            <ol className="mt-6 grid gap-x-(--gutter) gap-y-8 border-t border-line pt-8 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((s, i) => (
                <li key={s.title} className="flex flex-col gap-2">
                  <span className="type-h2 text-fg-2">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="type-h3 text-fg-max">{s.title}</h3>
                  <p className={BODY}>{s.body}</p>
                </li>
              ))}
            </ol>
          </section>
          <section className="shell pb-e2">
            <Testimonials items={QUOTES} size="lg" className="max-w-[48ch]" />
          </section>
          <section className="shell grid grid-cols-12 gap-x-(--gutter) gap-y-6 pb-e2">
            <h2 className="col-span-12 type-h2 text-fg-max lg:col-span-4">Questions</h2>
            <div className="col-span-12 lg:col-span-8">
              <Faq faqs={FAQS} bodyText={BODY} />
            </div>
          </section>
        </>
      )}

      <nav
        aria-label="About layout concepts (review only)"
        className="fixed right-4 bottom-4 z-50 flex gap-1 rounded-full border border-line bg-bg p-1 font-mono text-xs"
      >
        {(Object.keys(CONCEPTS) as Concept[]).map((v) => (
          <button
            key={v}
            type="button"
            aria-pressed={v === concept}
            onClick={() => choose(v)}
            className="rounded-full px-3 py-2 aria-pressed:bg-fg-max aria-pressed:text-bg"
          >
            {CONCEPTS[v]}
          </button>
        ))}
      </nav>
    </>
  );
}
