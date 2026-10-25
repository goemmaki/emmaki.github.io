import { ArrowRight } from "lucide-react";
import Link from "next/link";

/**
 * An outlined link button that floods brand yellow from the left on hover or
 * focus, while its arrow box floods black and the arrow slides through
 * (grafit.agency's button). Styles: "Flood button" in globals.css.
 */
export function FloodButton({
  href,
  external = false,
  children,
}: {
  href: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  const content = (
    <span className="flood-button__layout">
      <span className="flood-button__label">{children}</span>
      <span className="flood-button__icon" aria-hidden>
        <ArrowRight className="flood-button__arrow" />
        <ArrowRight className="flood-button__arrow flood-button__arrow--next" />
      </span>
    </span>
  );

  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="flood-button">
      {content}
    </a>
  ) : (
    <Link href={href} className="flood-button">
      {content}
    </Link>
  );
}
