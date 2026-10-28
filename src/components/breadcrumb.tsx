import Link from "next/link";
import { Fragment } from "react";
import { ChevronRight, House } from "lucide-react";

// The trail from Home to the current page, as on blog posts: a house icon for Home, chevrons between,
// the current page last in full ink and cut short if long.
export function Breadcrumb({ trail, current, className = "" }: { trail: { label: string; href: string }[]; current: string; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={`type-meta uppercase text-fg-2 ${className}`}>
      <ol className="flex min-w-0 items-center gap-2">
        <li className="flex shrink-0">
          <Link href="/" aria-label="Home" className="quiet-link">
            <House className="size-3.5" aria-hidden />
          </Link>
        </li>
        {trail.map(({ label, href }) => (
          <Fragment key={href}>
            <li aria-hidden="true"><ChevronRight className="size-3.5" /></li>
            <li className="shrink-0">
              <Link href={href} className="quiet-link">{label}</Link>
            </li>
          </Fragment>
        ))}
        <li aria-hidden="true"><ChevronRight className="size-3.5" /></li>
        <li aria-current="page" className="min-w-0 max-w-[36ch] truncate text-fg-max">{current}</li>
      </ol>
    </nav>
  );
}
