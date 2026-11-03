# Session handoff: home sections (2026-11-03 evening)

Current handoff. It replaces [20261103-owner-round.md](20261103-owner-round.md) for what's next; that file keeps the round's detail.

## Owner goals and decisions

- h1: "I write copy for B2B tech and other hard sells, so people [get it], [want it], and [buy it]." Final.
- Services: kicker "Services", h2 "Get the brains without the payroll.", subheader beside it. The gig shelf stays; the owner will redesign the open-card effect later (now a green line, `--color-green-crisp`). Vercel-style light and shadow were rejected: don't bring them back.
- Page order (owner's): hero, logos, tape, Who I am, Services, case frame, Why me, My approach, logos, closing.
- My approach: the owner's copy, to be tightened by the owner; the h2 "I do the hard part by hand." is Claude's temporary title.
- Manifesto: stored only (`docs/copy/manifesto-and-approach.md`); the owner wants "judgment" in its last line.

## How the owner works

- "The skill that deslops" is Second Brain `skills/humanizer`; use the owner's own drafts as its voice sample.
- Accordions must stay searchable with Ctrl+F (`hidden="until-found"` plus `beforematch`).

## Current state and where things live

`design/h1-options-20261103` in `~/worktrees/fiverr-portfolio/overnight-20261103`, local only, on top of `review/overnight-20261103`. Dev server http://localhost:3004 from this worktree. Check and build pass. History: the journal entry "2026-11-03 (evening)".

- Home: `src/pages/index.astro` (statement links, gigs, approach copy, frame client).
- `src/components/GigCard.astro`, `GigShelf.astro`, `ApproachAccordion.astro`; `Statement.astro` for the h1.

## Open work (needs the owner)

1. Merge: fast-forward `design/foundation` to this branch and push?
2. Copy: My approach h2 and item edits; item 2 promises referrals and item 1 says "20 years" (the hero rule against twenty-years lines was hero-only, so confirm).
3. Gigs: real thumbnails, review counts (∞ now), links, and whether "Offers video consultations" belongs on every gig.
4. h1 links and the home case frame are placeholders (metrics, quote, client).
5. Carried from the owner round: About globe performance, logo strip without JavaScript, unused `cobe`, per-page titles and descriptions, new photos.

## Watch-outs and gotchas

- The test browser has no hover or fine pointer: copy the `pointer: fine` media rules into an injected style and dispatch `PointerEvent`s with `pointerType: 'mouse'` to test the shelf.
- `ApproachAccordion.astro` repeats the Faq's open/close mechanism; merge them into one helper if either changes.
- The second logo strip and the case frame each run their own scripts; `CaseFrame` assumes one instance per page.
- Not yet viewed in light mode: the green line and the accordion.

## How to resume

Read `AGENTS.md`, then this file; `git -C ~/worktrees/fiverr-portfolio/overnight-20261103 log --oneline -12`; open http://localhost:3004.
