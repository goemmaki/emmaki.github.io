import { BrandWall, type Brand } from "@/components/brand-wall";
import { PageClosing } from "@/components/page-closing";
import { PageCover } from "@/components/page-cover";

// The owner's clients, in alphabetical order; the owner adds to them.
// Colours are each brand's accent from
// Brandfetch (2026-10-27), except Harvard's (its crimson) and TV Tropes' (its blue: the accent is a
// yellow too close to emmaki's); never fetch anything from Fiverr itself. Every client here
// is confirmed (owner, 2026-10-27).
const brands: Brand[] = [
  { name: "Accredible", color: "#5B4DFC" },
  { name: "Arc4dia", color: "#317DB3" },
  { name: "Compoundly", color: "#0EB400" },
  { name: "Design Bundles", color: "#4CC5FB" },
  { name: "Fiverr", color: "#1DBF73" },
  { name: "HackerRank", color: "#1BA94C" },
  { name: "Harvard University", color: "#A51C30" },
  { name: "Marco Polo", color: "#1DA2C7" },
  { name: "MHC Digital Group", color: "#AB5DE3" },
  { name: "Quartile", color: "#FF9900" },
  { name: "SellersFi", color: "#FCB337" },
  { name: "Spectral Core", color: "#17B3D0" },
  { name: "Tenity", color: "#993744" },
  { name: "TV Tropes", color: "#006BB1" },
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
