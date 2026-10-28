import { STEPS } from "@/lib/placeholders";

// How a job runs, in four ruled columns (two on tablets, one on phones), numbers in the secondary ink.
export function ProcessSteps() {
  return (
    <ol className="grid gap-x-(--gutter) gap-y-e1 sm:grid-cols-2 xl:grid-cols-4">
      {STEPS.map((s, i) => (
        <li key={s.title} className="flex flex-col gap-3 border-t border-line pt-6">
          <span className="type-h2 text-fg-2">{String(i + 1).padStart(2, "0")}</span>
          <h3 className="type-h3 text-fg-max">{s.title}</h3>
          <p className="type-editorial text-fg-2">{s.body}</p>
        </li>
      ))}
    </ol>
  );
}
