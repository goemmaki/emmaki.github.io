import { FIGURES } from "@/lib/placeholders";

// The owner's figures set huge in the covers' Geist 600 ("Figures" in globals.css), value over label.
export function Figures() {
  return (
    <dl className="grid border-t border-line sm:grid-cols-3">
      {FIGURES.map((f) => (
        <div
          key={f.label}
          className="flex flex-col-reverse gap-2 border-b border-line py-6 sm:border-b-0 sm:border-r sm:px-6 sm:first:pl-0 sm:last:border-r-0"
        >
          <dt className="type-secondary text-fg-2">{f.label}</dt>
          <dd className="figures-value text-fg-max">{f.value}</dd>
        </div>
      ))}
    </dl>
  );
}
