import { FloodButton } from "@/components/flood-button";

// A main page's close: the owner's one-sentence ask and the Fiverr button.
export function PageClosing({ line, cta }: { line: string; cta: string }) {
  return (
    <section className="shell flex flex-col items-start gap-8 py-32">
      <p className="type-h2 max-w-[20ch] text-fg-max">{line}</p>
      <FloodButton href="https://www.fiverr.com/emmaki" external>
        {cta}
      </FloodButton>
    </section>
  );
}
