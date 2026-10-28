import type { ReactNode } from "react";
import type { Testimonial } from "@/lib/content";
import { Halftone } from "./why-me/halftone";

// A shared ink language: cropped solids, hairlines, and open paper around the existing type.
function Poster({ index }: { index: number }) {
  if (index === 2) return <Halftone />;

  return (
    <span className={`why-me-poster why-me-poster-${index + 1}`} aria-hidden="true">
      <svg viewBox="0 0 320 320" preserveAspectRatio="xMidYMid slice" fill="none">
        {index === 0 && (
          <>
            <g className="why-me-disc">
              <circle cx="254" cy="22" r="132" fill="currentColor" />
              <circle cx="254" cy="22" r="87" fill="var(--color-yellow-splash)" />
              <circle cx="254" cy="22" r="59" stroke="var(--color-yellow-splash)" strokeWidth="2" />
              <path d="M254 -115V155M117 22H390" stroke="var(--color-yellow-splash)" strokeWidth="2" />
            </g>
            <path d="M-40 128H200M-40 140H160M-40 152H120" stroke="currentColor" strokeOpacity=".5" />
            <path className="why-me-slash" d="M273 114L211 208" stroke="currentColor" strokeWidth="26" />
          </>
        )}
        {index === 1 && (
          <>
            <g className="why-me-moire-base" stroke="currentColor" strokeOpacity=".65">
              {Array.from({ length: 92 }, (_, n) => <path key={n} d={`M-180 ${n * 7 - 160}H500`} />)}
            </g>
            <g className="why-me-moire-slide" stroke="currentColor" strokeOpacity=".85">
              {Array.from({ length: 92 }, (_, n) => <path key={n} d={`M-180 ${n * 7 - 160}H500`} />)}
            </g>
          </>
        )}
        {index === 3 && (
          <g className="why-me-rings" stroke="currentColor">
            {[38, 66, 94, 122, 150, 178, 206, 234, 262, 290, 318, 346, 374, 402].map((r, n) => (
              <circle key={r} cx="318" cy="318" r={r} strokeWidth={n === 4 ? 22 : n % 3 === 0 ? 3 : 1} strokeOpacity={n % 3 === 0 || n === 4 ? 1 : .45} />
            ))}
          </g>
        )}
        {index === 4 && (
          <g transform="rotate(32 160 160)">
            <path d="M-70 -100V440M-58 -100V440M340 -100V440" stroke="currentColor" strokeOpacity=".45" />
            {[18, 142, 266].map((x, n) => (
              <rect key={x} className={`why-me-stripe why-me-stripe-${n}`} x={x} y="-160" width={n === 1 ? 72 : 38} height="640" fill="currentColor" />
            ))}
          </g>
        )}
        {index === 5 && (
          <>
            <path d="M0 0H320V320H0ZM64 0V320M128 0V320M192 0V320M256 0V320M0 64H320M0 128H320M0 192H320M0 256H320" stroke="currentColor" strokeOpacity=".35" />
            {[4, 8, 0, 19, 21, 12, 23, 6].map((cell, n) => (
              <rect key={cell} className={`why-me-module why-me-module-${n}`} x={cell % 5 * 64} y={Math.floor(cell / 5) * 64} width="64" height="64" fill="currentColor" fillOpacity={n % 3 === 0 ? 1 : .3} />
            ))}
          </>
        )}
        {index === 6 && (
          <>
            <defs>
              <mask id="why-me-quote-reveal" maskUnits="userSpaceOnUse" x="0" y="0" width="420" height="400">
                <path className="why-me-quote-stroke" d="M185 126V231Q185 293 111 324M331 126V231Q331 293 257 324" pathLength="1" stroke="white" strokeWidth="116" />
              </mask>
            </defs>
            <g mask="url(#why-me-quote-reveal)" fill="currentColor">
              <path d="M128 108H242V226Q242 317 138 366L108 310Q174 278 174 232H128ZM274 108H388V226Q388 317 284 366L254 310Q320 278 320 232H274Z" />
            </g>
            <path d="M112 96H254V227M258 96H400V227" stroke="currentColor" strokeOpacity=".4" />
          </>
        )}
      </svg>
    </span>
  );
}

// A box in the credibility grid. figure: a figure, in numbers or words, with a mono label. note: a
// sentence with a mono label. quote: a client's words with their photo and who they are. accent: the
// box that takes the brand yellow on hover.
export type Credibility = { accent?: boolean } & (
  | { kind: "figure"; figure: ReactNode; label: string }
  | { kind: "note"; text: string; label: string }
  | { kind: "quote"; testimonial: Testimonial }
);

// Why me (owner, 2026-10-28): the kicker, then a grid of credibility boxes on one-pixel rules, after
// grafit.agency's "Why Us": four squares, then three wider boxes. Each figure and its label stay
// together as one block, including on hover. Scale, weight and block placement give the grid variety;
// the composition is in "Why me" in globals.css, box by box. The testimonial box, the reveal text and the
// benefit cards that sat around the grid were cut the same evening and kept in components/darlings.
export function WhyMe({ kicker, credibility }: { kicker: string; credibility: Credibility[] }) {
  return (
    <section className="shell">
      <h2 className="type-meta text-fg-2 uppercase">{kicker}</h2>
      <ul className="why-me-proof">
        {credibility.map((c, i) => (
          <li key={i} className="why-me-proof-box" data-accent={c.accent || undefined}>
            <Poster index={i} />
            {c.kind === "quote" ? (
              <figure className="why-me-proof-quote">
                <blockquote className="why-me-proof-value">“{c.testimonial.quote}”</blockquote>
                <figcaption className="why-me-proof-by">
                  {c.testimonial.photo && (
                    // eslint-disable-next-line @next/next/no-img-element -- a 168px headshot in a static export
                    <img
                      src={`/testimonials/${c.testimonial.photo}`}
                      alt=""
                      width={56}
                      height={56}
                      className="why-me-proof-photo"
                    />
                  )}
                  <span className="flex flex-col">
                    <span className="why-me-proof-name">{c.testimonial.name}</span>
                    <span>{c.testimonial.role}</span>
                    <span>{c.testimonial.company}</span>
                  </span>
                </figcaption>
              </figure>
            ) : (
              <div className="why-me-proof-block">
                <p className="why-me-proof-value">{c.kind === "note" ? c.text : c.figure}</p>
                <p className="why-me-proof-label type-meta uppercase">{c.label}</p>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
