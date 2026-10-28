import { SparklesText } from "@/components/ui/sparkles-text";
import { RectFit } from "@/components/rect-fit";
import { MotionProvider } from "@/components/motion-provider";

// Kept as a snippet, mounted nowhere: the owner took the poster off About on 2026-10-28 and saved it
// for a "killing your darlings" piece (journal). It ran on Home until 2026-10-27, then on About.
// Hello runs the height of the block. The question on two lines and the justified H1 beside it close the
// rectangle on lines the headline draws; rect-fit.tsx does the measuring.
export function Hero() {
  return (
    <section className="shell flex min-h-svh flex-col justify-center py-e1">
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
            <p className="hero-copy">
              Easily startled copywriter by day,{" "}
              <MotionProvider>
                <SparklesText
                  colors={{
                    first: "var(--sparkle-first)",
                    second: "var(--sparkle-second)",
                  }}
                  sparklesCount={5}
                  className="inline font-[family-name:var(--nf-source-serif)] text-[length:inherit] font-light italic"
                >
                  vituperative
                </SparklesText>
              </MotionProvider>{" "}
              Luddite fighting Skynet’s patterns by night.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
