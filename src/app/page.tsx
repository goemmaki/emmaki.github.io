import { Services } from "@/components/services";

// Home is cleared for its new opening (owner, 2026-10-27); the hero poster moved to About. The
// services list is here for now (owner, 2026-10-28).
export default function Home() {
  return (
    <>
      <div className="shell py-24 text-center type-meta text-fg-2">Coming soon</div>
      <Services />
    </>
  );
}
