import { ClientSlots } from "@/components/client-slots";
import { FloodButton } from "@/components/flood-button";
import { PageClosing } from "@/components/page-closing";
import { Statement } from "@/components/statement";
import { YearsSince } from "@/components/copyright-years";
import { type Credibility, WhyMe } from "@/components/why-me";
import { FIVERR_PROFILE_URL } from "@/lib/content";

// Home: a first screen holding only the button (owner, 2026-10-28: no giant word here), so the client
// strip starts right at the fold and shows within the first few pixels of scrolling; then who the owner
// is, with the case studies inside the line; then why me: a grid of credibility boxes; then the old
// why-me placeholder (kept until the owner says); then the closing every main page shares. The planned
// sections: docs/site-plan.md. All copy but the credibility is placeholder.
const PROOF_LINKS = [
  { text: "A", href: "/proof", metric: "00%", summary: "Placeholder: what changed for the client", client: "Client one" },
  { text: "B", href: "/proof", metric: "0 weeks", summary: "Placeholder: what was written, and for what", client: "Client two" },
  { text: "C", href: "/proof", metric: "000+", summary: "Placeholder: the result in one line", client: "Client three" },
];
// The owner's Fiverr record (owner, 2026-10-28: counts from the Fiverr profile that day; joined
// December 2013, so the years go up each January 1). The owner set the wording of the labels and the
// Tel Aviv line the same day.
const CREDIBILITY: Credibility[] = [
  { kind: "figure", figure: "Top Rated Seller", label: "On Fiverr since 2015", accent: true },
  { kind: "figure", figure: "4.8k", label: "Orders" },
  { kind: "figure", figure: "2.6k", label: "Clients" },
  { kind: "figure", figure: <YearsSince year={2013} />, label: "Years on Fiverr" },
  { kind: "figure", figure: "Pro Verified", label: "On Fiverr since 2017" },
  { kind: "note", text: "Selected to give feedback to Fiverr leadership in Tel Aviv", label: "In 2018" },
  {
    kind: "quote",
    testimonial: {
      quote: "She gets it. You won’t get a pile of AI slop masquerading as copy.",
      name: "Cannon Brooke",
      role: "Founder",
      company: "Brooke Solutions",
      photo: "cannon-brooke.webp",
    },
  },
];

export default function Home() {
  return (
    <>
      <h1 className="sr-only">emmaki</h1>
      {/* -mt-16/pt-16: the screen runs under the fixed header, as the page covers do. The button sits
          in the middle, clear of the bottom blur. */}
      <section className="shell -mt-16 flex min-h-svh items-center justify-center pt-16">
        <FloodButton href={FIVERR_PROFILE_URL} external>
          Lorem ipsum
        </FloodButton>
      </section>
      <section>
        <p className="shell mb-10 text-center type-meta text-fg-2 uppercase">Brands I’ve written for</p>
        <ClientSlots className="shell" />
      </section>
      <Statement kicker="Who I am" before="I help X and Y to" links={PROOF_LINKS} after=", without FGH." />
      <div className="mt-32">
        <WhyMe kicker="Why me" credibility={CREDIBILITY} />
      </div>
      {/* Why me: to be designed (owner, 2026-10-28). The closing's own top padding is the gap below. */}
      <section className="shell pt-32">
        <p className="type-meta text-fg-2 uppercase">Why me</p>
        <h2 className="mt-6 max-w-[26ch] type-h1 text-fg-max">Placeholder: why hire me, to be designed.</h2>
      </section>
      <PageClosing />
    </>
  );
}
