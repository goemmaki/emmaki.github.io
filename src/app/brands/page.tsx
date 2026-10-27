import { BrandWall, type Brand } from "@/components/brand-wall";
import { PageClosing } from "@/components/page-closing";
import { PageCover } from "@/components/page-cover";

// The brands already named on the Fiverr sales-copy gig's "select clients" image, plus Fiverr itself,
// in alphabetical order. A starter list; the owner adds to it. Logos (public/brands/) are the ones each
// brand's own site header shows, saved 2026-10-27; colours were sampled from those, except Fiverr's
// (its known brand green: never fetch anything from Fiverr). Brandfetch replaces both once the owner
// has a client ID.
const brands: Brand[] = [
  { name: "Accredible", logo: "/brands/accredible.webp", color: "#5546F2" },
  { name: "Arc4dia", logo: "/brands/arc4dia.png", color: "#1F5F9A" },
  { name: "Compoundly", color: "#0EB400" },
  { name: "Design Bundles", logo: "/brands/design-bundles.svg", color: "#4A3241" },
  { name: "Fiverr", color: "#1DBF73" },
  { name: "HackerRank", logo: "/brands/hackerrank.svg", color: "#05C770" },
  { name: "Marco Polo" },
  { name: "MHC Digital Group", logo: "/brands/mhc-digital-group.svg", color: "#7B00D3" },
  { name: "SellersFi" },
  { name: "Spectral Core", color: "#2394D4" },
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
      <BrandWall brands={brands} />
      <PageClosing line="Owner’s closing line: the ask, in one sentence." cta="Owner’s CTA label" />
    </>
  );
}
