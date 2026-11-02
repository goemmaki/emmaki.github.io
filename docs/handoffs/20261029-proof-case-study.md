# Session handoff: Proof, the case-study template and Home (2026-10-29)

**Case-study template: superseded by [20261102-case-study.md](20261102-case-study.md).** The Home items below stay current.

Supersedes `20261028-home-why-me.md` (deleted; in Git history at `76e36820`). `20261028-site.md` stays current for branches, checks and open accessibility items. The session record is the journal entry "2026-10-29 — Case frame, AI badges, Home logo hover" in `docs/journal/20260924-20261026-history.md`.

## Owner goals and decisions

- **Settled:** Home's "Who I am" and "Why me" (for now), and the Proof index (rules, 4rem names, noisy gradient, dot screen, 0.2s in and 0.5s out, no cards, no parallax). See `docs/site-plan.md`, Home section 4 and "Proof".
- **Case-study template** `/proof/placeholder`: a black frame with Harvard's noisy crimson gradient, results, and a testimonial signed by a photo, "Name Surname" over "Role", and the client's logo at the two lines' height, right-aligned to the quote's longest line. A sticky column with Client, Service (icons), Length, Company size and Annual revenue (made-up values), then the global "Message me" button and the gray AI badges. See the site plan's "Case study template".
- **Next targets after the case study:** polishing Home and About, "the two most important pages".

## How the owner works

- They review in Chrome at http://192.168.20.5:3003, including phone and iPad mini widths in dev tools.
- They judge by eye. Look at every change in the browser yourself before reporting it, especially Codex's work.

## What happened

All on 2026-10-29, branch `design/a11y-20261028`:

- Codex built the case frame in three rounds (`0fca6740`). Its second round lost the person's photo; Claude fixed the attribution in `c8432265`.
- The blog's Copy page / Share / Ask AI became the global `PageTools` (`src/components/page-tools.tsx`). Case studies use only its `AiBadges`, which take a per-page question.
- Codex's Home logo hover fix (`073ef9ba`) still flickered and changed the logos' heights; it was reverted in `16458aba`.

## Current state and where things live

- **Worktree:** `~/worktrees/fiverr-portfolio/a11y-20261028`, clean at `76e36820`, 11 commits ahead of `origin/design/foundation` (`8e89e93b`). Not pushed or fast-forwarded.
- **Checks on 2026-10-29:** type-check, lint and build passed. Chrome only, at 1440×900 in the dark theme. No Lighthouse or end-of-day checks (the owner skipped them).
- **Files:** `src/components/case-frame.tsx` with the "Case frame" CSS block in `src/app/globals.css`; `src/app/proof/placeholder/page.tsx`; `src/components/proof-index.tsx`; `src/components/breadcrumb.tsx`.

## Open work

Owned by `docs/site-plan.md` and Second Brain `TODO/emmaki.md` ("Develop the goemmaki portfolio website"):

- **Tomorrow, 2026-10-30:** the case-study items under "Next" in the site plan's "Case study template": a smaller logo and a quieter sticky column.
- **Next week:** the Home logo hover flicker, in the site plan's open questions, saved for the planned sweep where Opus at high effort fixes the site's odd behaviors together.
- **Still to ask the owner:**
  - Delete Home's old "Why me" placeholder section?
  - Move `hero.tsx` and `services.tsx` into `darlings/`?
  - Update Second Brain's `proof.md` with the Tel Aviv year (2018) and the order and client counts?
  - Fast-forward `design/foundation`? Only when the owner says "merge".
- The AI badges' per-page question is unwritten. The owner writes it.

## Watch-outs and gotchas

- The devtools browser has no fine pointer. To test hover, stub `matchMedia` for `pointer: fine` and dispatch pointer events.
- The local branch `design/foundation` (checked out in `~/fiverr-portfolio`) is stale; `origin/design/foundation` is the real one.
- `tsc` includes `runtime/`, so backups there must not end in `.ts` or `.tsx`.
- Codex can't run `next build` in its sandbox; run it yourself afterward.

## How to resume

1. Read `AGENTS.md`, this file, then the site plan's "Case study template".
2. Run `git -C ~/worktrees/fiverr-portfolio/a11y-20261028 status --short`; expect it clean at `76e36820`.
3. Open http://192.168.20.5:3003/proof/placeholder and look at the frame and the sticky column before changing anything.
