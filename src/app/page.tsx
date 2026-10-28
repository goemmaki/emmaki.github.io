import { ClientSlots } from "@/components/client-slots";
import { FloodButton } from "@/components/flood-button";
import { PageClosing } from "@/components/page-closing";
import { FIVERR_PROFILE_URL } from "@/lib/content";

// Home: a first screen holding only the button (owner, 2026-10-28: no giant word here), so the client
// strip starts right at the fold and shows within the first few pixels of scrolling; then the closing
// every main page shares. The planned sections: docs/site-plan.md. The button label and the strip's
// line are placeholders for the owner's copy.
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
      <PageClosing />
    </>
  );
}
