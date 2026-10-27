import { BrandWall, type Brand } from "@/components/brand-wall";
import { PageClosing } from "@/components/page-closing";
import { PageCover } from "@/components/page-cover";

// The brands already named on the Fiverr sales-copy gig's "select clients" image, plus Fiverr itself,
// in alphabetical order. A starter list; the owner adds to it. Logos (public/brands/) and colours
// (each brand's accent) come from Brandfetch, 2026-10-27, except MHC's logo, from its own site header
// (Brandfetch's is an icon on white). Spectral Core's is an icon on a filled tile, which can't be
// recoloured, so its card sets the name. Downloaded while the site isn't live; hotlink before launch.
// Never fetch anything from Fiverr: its logo came through Brandfetch too.
const brands: Brand[] = [
  { name: "Accredible", logo: "/brands/accredible.png", color: "#5B4DFC" },
  { name: "Arc4dia", logo: "/brands/arc4dia.png", color: "#317DB3" },
  { name: "Compoundly", logo: "/brands/compoundly.svg", color: "#0EB400" },
  { name: "Design Bundles", logo: "/brands/design-bundles.svg", color: "#4CC5FB" },
  { name: "Fiverr", logo: "/brands/fiverr.svg", color: "#1DBF73" },
  { name: "HackerRank", logo: "/brands/hackerrank.svg", color: "#1BA94C" },
  { name: "Marco Polo", logo: "/brands/marco-polo.png", color: "#1DA2C7" },
  { name: "MHC Digital Group", logo: "/brands/mhc-digital-group.svg", color: "#AB5DE3" },
  { name: "SellersFi", logo: "/brands/sellersfi.svg", color: "#FCB337" },
  { name: "Spectral Core", color: "#17B3D0" },
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
