import { SparklesText } from "@/components/ui/sparkles-text";
import { RectFit } from "@/components/rect-fit";

// Hello runs the height of the block. The question on two lines and the justified H1 beside it close the
// rectangle on lines the headline draws; rect-fit.tsx does the measuring.
export function HomeHero() {
  return (
    <section className="shell -mt-16 flex min-h-[calc(100svh-var(--peek))] flex-col justify-center pt-[calc(4rem+var(--spacing-e1))] pb-e1">
      <RectFit />
      <div className="hero-frame">
        <div className="hero-poster font-heading text-fg-max">
          <p className="hero-hello">Hello!</p>
          <p className="hero-headline">
            <span className="block">Anti-slop</span>
            <span className="block">ops here.</span>
          </p>
          <div className="hero-bottom">
            <p className="hero-question">
              <span className="block">How can I</span>
              <span className="block">help you?</span>
            </p>
            <h1 className="hero-copy">
              Easily startled copywriter by day,{" "}
              <SparklesText
                colors={{
                  first: "var(--sparkle-first)",
                  second: "var(--sparkle-second)",
                }}
                sparklesCount={5}
                className="inline font-[family-name:var(--nf-source-serif)] text-[length:inherit] font-light italic"
              >
                vituperative
              </SparklesText>{" "}
              Luddite fighting Skynet’s patterns by night.
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}
