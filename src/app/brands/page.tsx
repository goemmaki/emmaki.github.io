import { BrandConcepts, type Brand } from "@/components/brand-concepts";
import { PageClosing } from "@/components/page-closing";
import { PageCover } from "@/components/page-cover";

// The brands already named on the Fiverr sales-copy gig's "select clients" image, plus Fiverr itself,
// in alphabetical order. A starter list; the owner adds to it. Logos (public/brands/) are the ones each
// brand's own site header shows, saved 2026-10-27; the rest wait for the owner.
const brands: Brand[] = [
  { name: "Accredible", logo: "/brands/accredible.webp" },
  { name: "Arc4dia", logo: "/brands/arc4dia.png" },
  { name: "Compoundly" },
  { name: "Design Bundles", logo: "/brands/design-bundles.svg" },
  { name: "Fiverr" },
  { name: "HackerRank", logo: "/brands/hackerrank.svg" },
  { name: "Marco Polo" },
  { name: "MHC Digital Group", logo: "/brands/mhc-digital-group.svg" },
  { name: "SellersFi" },
  { name: "Spectral Core" },
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
