import { SparklesText } from "@/components/ui/sparkles-text";
import { RectFit } from "./rect-fit";

export const metadata = { robots: { index: false } };

// Hello runs the height of the block; the question on two lines and the H1 fitted beside it close the rectangle.
export default function HeroLab() {
  return (
    <section className="shell flex min-h-[calc(100svh-4rem-1px)] flex-col justify-center py-e1">
      <RectFit />
      <div className="hero-lab-frame">
        <div className="hero-lab-poster font-heading text-fg-max">
          <p className="hero-lab-hello">Hello!</p>
          <p className="hero-lab-headline">
            <span className="block">Anti-slop</span>
            <span className="block">ops here.</span>
          </p>
          <div className="hero-lab-bottom">
            <p className="hero-lab-question">
              <span className="block">How can I</span>
              <span className="block">help you?</span>
            </p>
            <h1 className="hero-lab-copy">
              I’m a B2B copywriter, AI content strategist, automation consultant, and{" "}
              <SparklesText
                colors={{ first: "var(--sparkle-first)", second: "var(--sparkle-second)" }}
                sparklesCount={5}
                className="inline font-[family-name:var(--nf-source-serif)] text-[length:inherit] font-light italic"
              >
                vituperative
              </SparklesText>{" "}
              Luddite.
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}
