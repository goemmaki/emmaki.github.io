import { PageClosing } from "@/components/page-closing";
import { PageCover } from "@/components/page-cover";

// Placeholders until the owner writes the intro, the closing line and the button label.
export default function ProofPage() {
  return (
    <>
      <PageCover
        word="Proof"
        ink={2.28}
        intro="Owner’s intro: one or two lines on what this page is and who it’s for."
      />
      <PageClosing line="Owner’s closing line: the ask, in one sentence." cta="Owner’s CTA label" />
    </>
  );
}
