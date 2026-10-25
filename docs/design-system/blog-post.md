# Blog post page: design decisions

Status: a record of the decisions made while building `/blog/[slug]` (2026-10-25), kept as input for the next design-system audit. **Not authority:** where it differs from `DESIGN.md`, `DESIGN.md` wins until the owner promotes a rule into it. Those departures are listed under "Open against DESIGN.md" below.

Reference: grafit.agency's article page, studied for structure, tools, TOC behaviour and the flood button. Nothing was copied from it (code, text or assets); the brand comes from `DESIGN.md`.

Code: `src/app/blog/[slug]/page.tsx`, `src/components/blog/` (`post-tools.tsx`, `post-toc.tsx`, `post-faqs.tsx`, `ai-logos.ts`), `src/components/flood-button.tsx`, `src/lib/posts.ts`, and the "Flood button" and TOC tick blocks in `src/app/globals.css`.

"Owner" marks a decision the owner asked for or approved; the rest are implementation choices made to fit those decisions.

## Page structure

Top to bottom, in one 700px reading column:

1. Breadcrumb, with the page tools on the same row from 768px (md).
2. Title.
3. Author on the left; dates on the right.
4. Intro paragraph, level with the top of the TOC.
5. TL;DR box.
6. Article sections.
7. Flood button (the post's call to action).
8. FAQs.

From 1024px (lg) a TOC column sits to the left of the article: a 240px track with a 52px gap, then 288px and 84px from 1280px (xl). Below 1024px there is no TOC and the read time moves into the dates stack. The TOC used to start at xl and vanished on a half-width 32-inch window (about 1265px), so it starts at lg (owner).

Vertical rhythm uses the editorial scale only: 84px above the header and between header and body, 52px between sections and around the title (32px row gap plus 20px title margin), 84px before the CTA and before the FAQs, and 136px at the foot. The owner asked for more room in the header and for the author and dates to sit lower.

## Header

- **Breadcrumb (owner):** a home icon, then "Blog", then the category, with `>` chevrons rather than slashes. Ancestors are gray (`fg-2`) and the current page is `fg-max`. Meta type, uppercase. The current item truncates at 36ch.
- **Title (owner):** spans the column, sized for reading rather than selling: `clamp(2rem, 2.8vw, 2.5rem)`, Geist 400, leading 1.15, tracking -0.03em. No rule under it (owner removed it).
- **Author (owner):** "Emma Rawson" beside a 36px placeholder avatar ("ER"). A photo comes later.
- **Dates (owner):** US style with full month names ("October 20, 2026"). "Published" loses its label below 640px. "Updated <date>" appears under it only if the post was revised (`updated` is optional in `Post`).
- **Read time (owner):** "N min read" at 230 words a minute. It sits above the TOC from 1024px, with a clock icon, and in the dates stack below that.

## Page tools: Copy page, Share, Ask AI

The owner asked for grafit's three tools and everything in them.

- Outlined buttons, 44px square icon buttons on phones, 32px high with a label from 768px. The open state uses the surface fill.
- **Copy page:** "Copy link" and "Copy as .md" (the whole post as Markdown). A small status label floats under the buttons ("Link copied", "Markdown copied") for 2s. It's a polite live region and doesn't push the page down.
- **Share:** LinkedIn and X.
- **Ask AI (owner):** ChatGPT, Claude, Google AI, Grok and Perplexity, in that order. Each has its logo, grayscaled to `fg-2`. Logo sources: Simple Icons (CC0) and Lobe Icons (MIT, for Grok).
- **Per-page AI question (owner):** each page can set `aiQuestion`, a selling question such as "Using this article, evaluate where AI-generated content could be damaging my brand." The prompt becomes "Read <url>, then answer: <question>". Without one it falls back to "Read from <url> so I can ask questions about it". The owner's examples for other page types (services, case study, Fiverr guides) are in the session that built this. The services wording is still open.
- **Menus (owner):** no open or close animation. They are non-modal, so the page keeps scrolling with a menu open, and a click anywhere else closes it.

## Table of contents

- **Entries (owner):** TL;DR first, then each section heading, then FAQs.
- **Type:** 14px, 18px line, 18px gap.
- **Progress rail (owner):** a column of 12px × 1px notches, six per gap between headings, so every sixth notch sits level with an entry. Notch pitch (1px + 5px) × 6 = 36px, which matches the list's pitch. A lit cluster slides down the rail as the reader scrolls. Its notches brighten toward `fg-max` and widen up to 2×, with a cubic falloff over three notches either side.
- **Unlit notches (owner):** 10% ink, below 3:1 on purpose, because the lit cluster and the TOC text carry the position. Light mode mixes in oklab (`#dedede` on white). Dark mode mixes in sRGB (`#1a1a1a` on black), because an oklab mix toward white barely leaves black (`#030303`). History: 3.3:1 notches were "a barcode" in light mode and too faint in dark. The owner chose grafit's faintness over WCAG non-text contrast.
- **Text:** the nearest entry blends from `fg-2` toward `fg-max` and carries `aria-current="location"`.
- **Behaviour:** sticky 96px from the top. A click smooth-scrolls the heading to 112px from the top (instant under reduced motion), updates the URL hash and focuses the heading.

## Body

- **Type (owner):** body text 16px IBM Plex Sans, leading 1.625, gray (`fg-2`). Plex reads larger than grafit's Aeonik, so 16px matches their 18px. The owner asked for smaller body text than the first build, and for gray text under white headings.
- **Heading scale (owner asked for less weight; dark-mode white was "doing a lot of work"):** all Geist 400, `fg-max`.

  | Level | Size / leading | Notes |
  | --- | --- | --- |
  | H1 | clamp(2rem, 2.8vw, 2.5rem) / 1.15 | title only, -0.03em |
  | H2 | the shared H3 type role | section headings, TOC targets |
  | H3 | 20px / 1.3 | -0.01em |
  | H4 | 18px / 1.35 | |
  | H5 | 16px / 1.4 | also the TL;DR heading |
  | H6 | 14px / 1.43 | uppercase, 0.04em |

- **TL;DR box (owner):** a bordered surface box, 2px radius, 24px padding. It has a checklist icon and an H5 "TL;DR" heading (owner: the box needs its own heading). The list is 14px, smaller than the body. It's the only container on the page, which fits "containers are punctuation".
- **Images (owner):** in the text column at full column width, 2px radius, 32px above and below. Captions are optional, 14px `fg-2`, centred so they read as captions (owner).

## Flood button (owner)

The call to action after the article, built after grafit's button but in emmaki colours.

- **Shape:** 40px high, 1px `line` border, 2px radius, 16px label, and a 32px arrow box at the right.
- **Arrow box:** inverse ink, so a white box with a black arrow in dark mode and black with white in light. The owner's rule: the arrow is never the page colour.
- **Hover or focus:** yellow (`#FFC300`) floods the button from the left over 0.6s (`cubic-bezier(0.22, 0.61, 0.36, 1)`; grafit-slow, by owner request), the border turns yellow and the label turns black. At the same time the arrow box floods with the page colour, so box and arrow swap colours. **No yellow on the arrow box** (owner). The up-right arrow (owner) leaves up-right as a second arrives from the lower left. Leaving snaps back.
- **Label (owner):** set per post in `cta.label`, worded as the conversion action ("See my X work"), not "Read other articles".
- Yellow appears only as the flood, a rare splash in `DESIGN.md` terms.

## Text links (owner)

After vercel.com's article links: a link keeps the colour of the text around it and is marked by a 1px underline, 4px below the text, in `fg-muted`. On hover or focus the underline turns `fg-max` (whiter in dark mode, darker in light); the text doesn't change. No blue or purple, and no yellow (`DESIGN.md`).

- One rule: the `text-link` utility in `globals.css`, used through `src/components/text-link.tsx`. Post paragraphs can hold inline links (`PostParagraph` in `posts.ts`); "Copy as .md" writes them as `[text](href)`.
- **Accessibility:** the underline, not colour, marks the link (WCAG 1.4.1). Underline against the page: 5.85:1 dark, 4.12:1 light. Focus also gets the site's focus ring.

## FAQs (owner)

After grafit's article FAQs, with the owner's change: **+ opens and − closes**, instead of a rotating arrow. Five placeholder questions for now (`faqs` in `Post`).

- **Rows:** a Base UI accordion. Each question is an h3 holding a full-width button: Geist 400, 18px, leading 1.4, `fg-max`, 24px above and below, with a 24px lucide plus or minus at the right. A 1px `line` hairline divides the rows. The answer is body text with 24px under it.
- **Behaviour:** any number of answers can be open at once. Answers open and close to their height over 300ms, ease-out (cut under reduced motion). Closed answers stay in the page as `hidden="until-found"`, so find-in-page opens them.
- **Accessibility:** question and icon 21:1 in both themes, answers at body contrast, 73px rows. The button carries `aria-expanded` and, while open, `aria-controls`; the answer is a region labelled by its question. The hairlines are decorative: the question and icon identify each control.
- The FAQs are in "Copy as .md" and count towards the read time.

## Site-wide changes made alongside

- **Gutter (owner: "copy grafit's"):** fluid, `clamp(16px, 100vw × 32/1120 + 6.857px, 48px)`, replacing the stepped 1600/960/400 media queries. The shell is 1440px plus gutters. The hero still fits.
- **Theme toggle (owner):** the new theme grows out of the button as a circle, a View Transition with a 400ms clip-path reveal after Magic UI's animated theme toggler. Skipped under reduced motion.
- **Header menu (owner):** the hover roll removed. The slide-in layers were removed too, then restored the same day on opening only (owner: it opened too abruptly).
- **Skip link:** its target (`main#content`) is focusable.

## Accessibility (2026-10-25)

- **Lighthouse accessibility:** 100 in both themes, with a menu open.
- **Reflow:** passes at 320px.
- **Text contrast:** gray body 8.0:1 (dark) and 8.5:1 (light), headings 21:1, yellow on black 13:1.
- **Accepted exception:** unlit TOC notches, as above.
- **Focus order:** on phones the tools come before the title in DOM and screen-reader order but sit beside the dates visually. This was kept: WCAG 2.4.3 asks for an order that preserves meaning and operability, not one that mirrors the layout, and grafit uses the same order.
- **Codex audit:** a read-only source audit (2026-10-25) found no other failures.

## Rejected or dropped

- A blurred page with a circular scroll selector for the menu (a Jitter template). Too fussy for a menu.
- Full-screen colourful page transitions (geniusdivision.com). Dropped; plain page transitions for now.
- Menu open and close animations (the tool menus; the header menu's opening slide-in was restored).
- A yellow arrow box on hover.
- A TL;DR heading on the TOC itself (a misread). TL;DR is a TOC entry instead.

## Open against DESIGN.md

These need the owner's decision before the audit promotes or reverses them:

- **Headings:** article headings use their own lighter sizes and weights, and H4–H6 have no `DESIGN.md` role.
- **Body text:** gray (`fg-2`) rather than primary text.
- **Unlit notches:** below 3:1 non-text contrast.
- **Yellow:** a full-button yellow flood on hover, a larger splash than usual.
- **From the hero session:** the serif italic "vituperative".

## Not designed yet

The "add me as a preferred information provider" button (same style as the flood button), the `/blog` index, and a TOC for screens below 1024px.
