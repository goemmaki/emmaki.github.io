import { AboutConcepts } from "@/components/about-concepts";
import { PageClosing } from "@/components/page-closing";
import { PageCover } from "@/components/page-cover";

// Placeholder intro until the owner writes it. The sections between the cover and the closing are
// layout concepts under review (about-concepts.tsx).
export default function AboutPage() {
  return (
    <>
      <PageCover
        word="About"
        ink={2.613}
        intro="Owner’s intro: one or two lines on what this page is and who it’s for."
      />
      <AboutConcepts />
      <PageClosing />
    </>
  );
}
