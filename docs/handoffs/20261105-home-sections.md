# Session handoff: Home sections (2026-11-05)

Current handoff for Home. It supersedes [20261104-overnight.md](20261104-overnight.md) and [20261103-home-sections.md](20261103-home-sections.md) for what's next. Their open items not listed here still stand.

## Owner goals and decisions

- Next session (owner, 2026-11-05): "up the fun and creativity" on Home.
  - Swap the gig cards (Services) for a cool interactive schema map.
  - Make Orwell-themed playing cards for the My approach hover stack, starting with "I like the complicated stuff".
- Settled tonight:
  - Why me bento is done: green only, plain light mode, radar fading toward the 13, black-and-white logos never change on hover.
  - The caution tape is breeze only.
  - The current approach cards (hover stack) are good. The scrolling story is deleted; don't bring it back.
- Placeholders the owner owns:
  - the Resources cards (lorem ipsum and empty image slots; they'll be tools, starting with the calculator)
  - the tape cut's details ("we'll refine this tomorrow, maybe it's a bit OTT")
- Copy is the owner's. The Luddite item is their two sentences only.

## How the owner works

- Codex executes site changes. Claude briefs, reviews live and commits. Claude edits inline only when the owner assigns the change to Claude.
- When the owner says a change is wrong: stop the run, revert, then do what they say next.
- Text and image placeholders: no AI-generated photos ("exorcise the AI-gen photos").

## What happened

2026-11-04 to 05: see the journal entry "2026-11-04 (afternoon to 2026-11-05 small hours)" in `docs/journal/20260924-20261026-history.md`.

## Current state and where things live

Branch `design/home-approach-20261104` in `~/worktrees/fiverr-portfolio/home-approach-20261104`, fast-forwarded into `design/foundation` and pushed. Dev server http://localhost:3004 from this worktree. Check, lint and build pass at `edc501f0`.

- Home order: hero, logos, tape, Who I am, Services (`GigShelf`), testimonial globe, Why me, My approach, cut tape, Resources, logos, closing.
- Home components:
  - `src/pages/index.astro`
  - `ApproachStack.astro`
  - `Resources.astro`
  - `TapeCut.astro` and `tape-cut.ts`; `CautionTape.astro` now handles several instances and has a `cuttable` prop
  - `WhyMe.astro`, with its CSS in `src/styles/globals.css`
  - `GigShelf.astro` and `GigCard.astro`
  - `TestimonialGlobe.astro`
- `ApproachAccordion.astro` is unused and can go once the owner agrees.

## Open work

The open items live in [visual-polish-backlog.md](../visual-polish-backlog.md) under "To do later":
- bottom blur height (owner to pick)
- client strip jump
- tape-cut gap and reduced motion
- hover stack edge overhang
- gig arrow placement

## Watch-outs and gotchas

- The software-rendered test browser takes a second or more per screenshot. Time animations with in-page timestamps, not screenshot sequences.
- Images on the dev server are encoded on first request, so they load late there. Judge image loading on the built site.
- The site blurs the bottom of the viewport. Scroll targets to the center before measuring.
- SVG arrow boxes exclude the stroke. Measure the drawn glyph, not the box.

## How to resume

1. Read `AGENTS.md`, this handoff, and the newest dated checks entry in `docs/journal/`. If none exists for 2026-11-05, fold in the quick-check report from that night's run, which was left running when the session closed.
2. `git -C ~/worktrees/fiverr-portfolio/home-approach-20261104 status`, then check http://localhost:3004 is up.
3. Brief Codex for the schema map and the Orwell cards. Look at both live before reporting.
