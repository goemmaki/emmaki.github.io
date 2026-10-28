import Link from "next/link";

/** A link inside running text: same color as the text, marked by its underline (the text-link utility). */
export function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-link">
      {children}
    </Link>
  );
}
