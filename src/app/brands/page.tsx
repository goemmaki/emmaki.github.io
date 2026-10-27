import { PageClosing } from "@/components/page-closing";
import { PageCover } from "@/components/page-cover";

// The brands already named on the Fiverr sales-copy gig's "select clients" image, in alphabetical order.
// A starter list; the owner adds to it.
const brands = [
  "accredible",
  "arc4dia",
  "compoundly",
  "design bundles",
  "hackerrank",
  "marco polo",
  "mhc digital group",
  "sellersfi",
  "spectral core",
];

// Placeholders until the owner writes the intro, the closing line and the button label.
export default function BrandsPage() {
  return (
    <>
      <PageCover
        word="Brands"
        ink={2.973}
        intro="Owner’s intro: one or two lines on what this page is and who it’s for."
      />
      <section className="shell py-32">
        <ul className="brand-list">
          {brands.map((brand) => (
            <li key={brand}>{brand}</li>
          ))}
        </ul>
      </section>
      <PageClosing line="Owner’s closing line: the ask, in one sentence." cta="Owner’s CTA label" />
    </>
  );
}
