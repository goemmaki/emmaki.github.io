# Session handoff: Home redesign, "Who I am" and "Why me" (2026-10-28 evening)

For everything else about the site (branches, checks, open accessibility items), `20261028-site.md` stays current. Home's plan is `docs/site-plan.md`. The session record is the journal entry "2026-10-28 evening" in `docs/journal/20260924-20261026-history.md`.

## Status, 2026-10-29

This handoff is partly superseded. The "Why me" section is settled for now: the testimonial box, reveal text and benefit cards were cut to `src/components/darlings/`, and the grid holds the owner's real figures with hover posters (owner: accepted "for now"). Its current design is `docs/site-plan.md`, Home section 4. The Proof index and the case-study template (`/proof/placeholder`) were designed the same night and are settled (site plan, "Proof" and "Case study template"). All of it was committed on 2026-10-29.

The owner's next targets: polishing Home and About, "the two most important pages". Still open from 2026-10-28:

- Delete the old "Why me" placeholder section in `page.tsx`?
- Move `hero.tsx` and `services.tsx` into `darlings/`?
- Update Second Brain's `proof.md` with the Tel Aviv year (2018) and the order and client counts?

## Owner goals and decisions

- **Home order now:** button-only first screen, client strip, "Who I am", "Why me", the old "Why me" placeholder (see Open work), closing.
- **"Who I am" (`statement.tsx`):** the positioning line with case studies inside it, after grafit.agency's "Who we are". Placeholder copy "I help X and Y to A, B, C, without FGH." The owner hasn't objected to it.
- **"Why me" is the section being designed.** What the owner has asked for, across the evening:
  - **Kicker:** "Why me", small, in the mono kicker style (like "Who I am"). No "What I value" kicker or headline.
  - **Testimonial box:** a photo, then name, role and company each on their own line with no commas. Then ONE mono line on who the client is (the owner gave two options; use one). The box keeps one height whichever quote shows ("keep the box relatively samey"), so nothing below moves when the quote changes.
  - **Reveal text** beside the testimonial, after bymonolog.com: letters brighten as the visitor scrolls. Smaller than h2, and its top aligned with the testimonial box. Lorem placeholder, ONE paragraph.
  - **Credibility grid** under that: the boxes from grafit.agency's "Why Us" (four squares, then three wider boxes, on one-pixel rules). Different credibility from the testimonial. Monochrome placeholder text, with "our hover color trick" on hover.
  - **Benefit cards** under the grid: a sideways scroll like 21st.dev's uilayout "horizontal-scroll". Large, the first two in view on arrival, no numbers. Yellow for now only so the owner can see them. The cards are about benefits to the client, not "values".
- **Rejected this evening:**
  - The bymonolog-style grid of four tall value cards. The owner never asked for the side-scroll to go; Claude misread "no sidescrolling needed here".
  - Tall, narrow cards, and a 21rem testimonial column stretched to the longest quote ("the long long").
  - Two who-is-this lines, and two lorem paragraphs.
  - The "Why me" kicker in h3, and the reveal text at h1 and h2 sizes.
  - Cards that moved whenever the quote changed.
- **Latest verdict on the current build (verbatim):** "the testimonial box is now far too fucking wide and the reveal text barely works. and there's no need to sticky it over the new grid".

## How the owner works

- They give terse directions about references. Change only the part they name. Ask before removing anything ("no X needed here" didn't mean deleting X).
- Check every change against `docs/design-system/DESIGN.md` before showing it: kicker style, type sizes, the 4/8/12/16/24/32 and 52/84/136 spacing, 2px corners, and "containers are punctuation".
- Show one change at a time and verify it in the browser at the owner's sizes. The owner judged this evening's rounds as getting worse; slow down rather than stack changes.

## What happened

All on 2026-10-28, in `~/worktrees/fiverr-portfolio/a11y-20261028`. Nothing from this evening is committed.

1. "Who I am" was built with grafit-style chips and a preview card that trails the mouse.
2. The values side-scroll was built, then given the first real testimonial with a photo.
3. The bymonolog round replaced the side-scroll by mistake. The side-scroll was restored with big cards (two in view), then replaced at the owner's request by the 21st.dev-style run under a pinned head.
4. Last round: a sticky head (kicker, wide testimonial, reveal text) over the grafit-style grid and the yellow card run.

## Current state and where things live

- **Branch:** `design/a11y-20261028` at `8e89e93b`, the same commit as `design/foundation`. Served on port 3003.
- **Uncommitted:**
  - `src/app/page.tsx`: placeholders `PROOF_LINKS`, `BENEFITS`, `CREDIBILITY`, `STATEMENT_LOREM`.
  - `src/components/statement.tsx`
  - `src/components/why-me.tsx`
  - `src/components/shading-text.tsx`: the reveal text. With `external`, a parent sets `--p`.
  - `src/components/testimonials.tsx`: the fixed-height quote stack, photo, role and company lines, and the `about` line.
  - `src/lib/content.ts`: `Testimonial` gains `company`, `photo` and `about`. It holds `TESTIMONIALS` (one real quote) and `PLACEHOLDER_QUOTES`, now shared with `about-concepts.tsx`.
  - `src/app/globals.css`: the "Statement", "Testimonials", "Why me" and "Shading text" blocks.
  - `public/testimonials/brett-smith.webp`
  - `docs/site-plan.md`, Home section 4.
- **Deleted, never committed:** `values-scroll.tsx`, the side-scroll beside a pinned column. It can be recovered from this session's transcript if the owner wants it back.
- **Checks:** type-check, lint and build passed on the last round (2026-10-28, about 17:51 UTC). Layout was checked at 1440×900, 1280×800 and 375×667 in dark mode. No Lighthouse or accessibility run this evening.

## Open work

Owned by Second Brain `TODO/emmaki.md` ("Develop the goemmaki portfolio website") and `docs/site-plan.md`.

1. **Fix "Why me" per the latest verdict:**
   - Narrow the testimonial box: it's 7fr of the shell now and far too wide. It must stay a fixed height.
   - Unpin the head: the grid should not scroll under a sticky testimonial.
   - Make the reveal visibly work. When it was self-driven, it lit letters as they crossed 70% of the window height (formula in `shading-text.tsx`). That version showed a clear wave in screenshots. The pinned version lights it over 60% of a screen as soon as the head sticks, and the owner says it barely works.
2. **Ask the owner:**
   - Delete the old "Why me" placeholder section in `page.tsx`?
   - The header covers the kicker when it returns on scroll up. Does that still matter once the head stops sticking?
   - Brett's long quote: keep the full text or use an excerpt? Asked three times with no answer; the owner said to keep the box height.
   - Commit, and fast-forward `design/foundation`?
3. **Not started:** real credibility and benefits content (owner), and the hover color on the credibility boxes. Right now boxes fill white like the "Who I am" chips, and the two accent boxes fill yellow. Confirm this is the trick the owner meant.

## Watch-outs and gotchas

- tsc includes `runtime/`, so backups there must not end in `.ts` or `.tsx`.
- `offsetLeft` inside a translated track is relative to the track (`will-change: translate` makes it the offset parent). Use widths, not offsets.
- The site header hides on scroll down and returns on scroll up, over anything sticky at `top: 0`.
- Brett's quote at full length is about 660px tall in a 21rem column and 350px in a wide box. Any pinned layout has to budget for it.
- Never copy reference code, text or assets. grafit, bymonolog and 21st.dev were studied for behavior only.

## How to resume

1. Read `AGENTS.md`, this file, then `docs/site-plan.md` Home section 4 and `docs/design-system/DESIGN.md`.
2. `cd ~/worktrees/fiverr-portfolio/a11y-20261028 && git status --short`: expect this evening's uncommitted files.
3. Open http://192.168.20.5:3003 and scroll to "Why me" before changing anything.
4. Make the three fixes in Open work 1 one at a time, showing each to the owner.
