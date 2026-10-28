import { PageClosing } from "@/components/page-closing";
import { PageCover } from "@/components/page-cover";
import { ProofIndex } from "@/components/proof-index";

export default function ProofPage() {
  return (
    <>
      <PageCover
        word="Proof."
        ink={2.371}
        intro="Select copy and AI/automation work for clients, myself, and fun."
      />
      <ProofIndex />
      <PageClosing />
    </>
  );
}
