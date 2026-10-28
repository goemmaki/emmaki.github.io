import { FIGURES } from "@/lib/placeholders";

// The owner's figures set huge in the covers' Geist 600 ("Figures" in globals.css), value over label;
// three across once their own column is wide enough, since they sit in columns of different widths.
export function Figures() {
  return (
    <div className="@container">
      <dl className="grid border-t border-line @xl:grid-cols-3">
        {FIGURES.map((f) => (
          <div
            key={f.label}
            className="flex flex-col-reverse gap-2 border-b border-line py-6 last:border-b-0 @xl:border-b-0 @xl:border-r @xl:px-6 @xl:first:pl-0 @xl:last:border-r-0"
          >
            <dt className="type-secondary text-balance text-fg-2">{f.label}</dt>
            <dd className="figures-value text-fg-max">{f.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
