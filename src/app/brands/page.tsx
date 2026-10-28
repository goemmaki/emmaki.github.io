import { BrandWall } from "@/components/brand-wall";
import { PageClosing } from "@/components/page-closing";
import { PageCover } from "@/components/page-cover";
import { BRANDS } from "@/lib/content";

// The note is a draft for the owner, written to name who emmaki is, who it writes for, what it does
// and that these are its clients, for readers and search alike. The intro is the owner's.
export default function BrandsPage() {
  return (
    <>
      <PageCover
        word="Brands"
        ink={2.973}
        intro="I’m Emmaki, a B2B copywriter and AI content strategist with 20+ years’ experience turning complex ideas into simple messages for brands around the world."
      />
      <BrandWall
        brands={BRANDS}
        note={
          <>
            <section className="flex flex-col gap-2">
              <h2 className="type-meta text-fg-max">Select clients</h2>
              <p>
                I work with brands whose products are smarter than their messaging. I turn what you do into a
                message your buyers understand, remember, and repeat to whoever signs off.
              </p>
            </section>
            <section className="flex flex-col gap-2">
              <h2 className="type-meta text-fg-max">Industries</h2>
              <p>
                I mostly work with B2B brands in technology, cybersecurity, fintech and media. After 20+ years,
                there’s a good chance I’ve written for your industry too.
              </p>
            </section>
          </>
        }
      />
      <PageClosing />
    </>
  );
}
