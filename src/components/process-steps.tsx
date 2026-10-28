import { STEPS } from "@/lib/placeholders";

// How a job runs, in four ruled columns, two or one as its own width narrows (it sits in columns of
// different widths), numbers in the secondary ink.
export function ProcessSteps() {
  return (
    <div className="@container">
      <ol className="grid gap-x-(--gutter) gap-y-e1 @lg:grid-cols-2 @4xl:grid-cols-4">
        {STEPS.map((s, i) => (
          <li key={s.title} className="flex flex-col gap-3 border-t border-line pt-6">
            <span className="type-h2 text-fg-2">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="type-h3 text-fg-max">{s.title}</h3>
            <p className="type-editorial text-fg-2">{s.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
