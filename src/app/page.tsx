import { SparklesText } from "@/components/ui/sparkles-text";

export default function Home() {
  return (
    <section className="shell py-e3">
      <p className="type-mega max-w-[18ch] text-fg-max">
        Hello. Anti-slop ops here.{" "}
        <span className="text-[#FFC300] light:text-fg-max">How can I help you?</span>
      </p>
      <h1 className="type-h3 mt-e1 max-w-[40ch] text-fg-2">
        Emmaki ships as a B2B copywriter, AI content strategist, automation consultant, and{" "}
        <SparklesText
          colors={{ first: "#FFC300", second: "#FFE38A" }}
          sparklesCount={5}
          className="inline font-[family-name:var(--nf-source-serif)] text-[length:inherit] font-light italic"
        >
          vituperative
        </SparklesText>{" "}
        Luddite.
      </h1>
    </section>
  );
}
