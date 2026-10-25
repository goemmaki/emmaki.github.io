import { HomeHero } from "@/components/home-hero";
import { NibSection } from "./nib-section";

export const metadata = { robots: { index: false } };

// The home hero with the nib section under it, while the nib is still being worked out.
export default function HeroLab() {
  return (
    <>
      <HomeHero />
      <NibSection />
    </>
  );
}
