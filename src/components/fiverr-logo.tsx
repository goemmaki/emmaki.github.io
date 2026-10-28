import { useId } from "react";

/**
 * Fiverr's round "fi" mark: the "fi" letters from Simple Icons (CC0-1.0) cut out of a circle.
 * Monochrome in currentColor, so it matches the icons beside it instead of Fiverr's bright green.
 */
export function FiverrLogo({ className }: { className?: string }) {
  const mask = useId();
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <mask id={mask}>
        <circle cx="12" cy="12" r="12" fill="#FFFFFF" />
        <g fill="#000000" transform="translate(7.6 -6.67) scale(1.565)">
          <path d="M.908 15.44H2.51v-3.558h1.524v3.558h1.591v-4.874H2.51v-.302c0-.332.235-.536.606-.536h.918V8.412H2.85c-1.162 0-1.943.712-1.943 1.755v.4H0v1.316h.908v3.558z" />
          <circle cx="4.85" cy="9.15" r=".78" />
        </g>
      </mask>
      <circle cx="12" cy="12" r="12" fill="currentColor" mask={`url(#${mask})`} />
    </svg>
  );
}
