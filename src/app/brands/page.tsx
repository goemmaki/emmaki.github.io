import { BrandConcepts } from "@/components/brand-concepts";
import { PageClosing } from "@/components/page-closing";
import { PageCover } from "@/components/page-cover";

// The brands already named on the Fiverr sales-copy gig's "select clients" image, plus Fiverr itself,
// in alphabetical order. A starter list; the owner adds to it.
const brands = [
  "Accredible",
  "Arc4dia",
  "Compoundly",
  "Design Bundles",
  "Fiverr",
  "HackerRank",
  "Marco Polo",
  "MHC Digital Group",
  "SellersFi",
  "Spectral Core",
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
      <BrandConcepts brands={brands} />
      <PageClosing line="Owner’s closing line: the ask, in one sentence." cta="Owner’s CTA label" />
    </>
  );
}
