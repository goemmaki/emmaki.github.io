// Classes for long-form MDX bodies, one set per collection. The page chrome and
// collection-sections.ts read the same values, so a style change happens here once.

export const headingStyle = {
  1: "font-heading font-normal text-[clamp(2rem,2.8vw,2.5rem)] leading-[1.15] tracking-[-0.03em]",
  2: "font-heading font-normal text-(length:--type-heading-h3-size) leading-(--type-heading-h3-leading) tracking-(--type-heading-h3-tracking)",
  3: "font-heading font-normal text-xl leading-[1.3] tracking-[-0.01em]",
  4: "font-heading font-normal text-lg leading-[1.35]",
  5: "font-heading font-normal text-base leading-[1.4]",
  6: "font-heading font-normal text-sm leading-[1.43] uppercase tracking-[0.04em]",
} as const;

export const bodyText = "font-sans text-base leading-[1.625] text-fg-2";
export const tocTarget = "scroll-mt-28";
export const sectionHeadingClass = `${headingStyle[2]} text-fg-max ${tocTarget}`;

export type ProseStyle = {
  /** Every section after the first; `first` overrides it for the first. */
  section: string;
  firstSection?: string;
  sectionBody: string;
  h2: string;
  subheading: (level: 3 | 4 | 5 | 6) => string;
  link: string;
  figure: string;
  image: string;
  caption: string;
};

export const PROSE: Record<"blog" | "work", ProseStyle> = {
  blog: {
    section: "mt-e1",
    sectionBody: `mt-6 space-y-6 ${bodyText}`,
    h2: sectionHeadingClass,
    subheading: (level) => `!mt-8 ${headingStyle[level]} text-fg-max`,
    link: "text-link",
    figure: "!my-8",
    image: "w-full rounded-sm",
    caption: "mt-3 text-center font-sans text-sm text-fg-2",
  },
  work: {
    section: "mt-e2",
    firstSection: "",
    sectionBody: `mt-6 space-y-6 ${bodyText}`,
    h2: `${headingStyle[2]} text-fg-max`,
    subheading: (level) => `!mt-8 ${headingStyle[level]} text-fg-max`,
    link: "text-link",
    figure: "!my-8",
    image: "w-full rounded-sm",
    caption: "mt-3 text-center font-sans text-sm text-fg-2",
  },
};
