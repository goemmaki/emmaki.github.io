# Session handoff: case study template revision (2026-11-02)

Supersedes the case-study parts of `20261029-proof-case-study.md` (its Home items stay current there).

## Owner goals and decisions

- The page design for `/proof/placeholder` is recorded in `docs/site-plan.md`, "Case study template", including what was tried and rejected today. The owner said "we done here" at the end of the session.
- Settled: the results arrow stays Geist's `→`; no reveal text and no TL;DR box on case studies; no TOC below 1024px (as on blog posts); the shared closing (Open for work, Message me, Ask AI) is in `Base` on every page except the blog's and the 404, which the owner called exceptions; the opening's text has 1.5 line height.

## What happened

- Journal entry "2026-11-02 (evening) — Case study template: facts in the frame, 'Long story short…', contents and FAQs" in `docs/journal/20260924-20261026-history.md`.

## Current state and where things live

- Branch `design/case-study-20261102`, worktree `~/worktrees/fiverr-portfolio/case-study-20261102`, based on `design/proof-index-20261102` (`d57c9e00`). Code `7d9b2321`, `be27d5eb`, `ab6f6afd` (closing in `Base`) and `cc7674f9` (line height), plus docs. Committed only: not pushed, not fast-forwarded into any other branch.
- Review server: `astro dev` on 3012 from this worktree (http://192.168.20.5:3012/proof/placeholder). The 3011 server serves `design/post-migration-20261101` and does not show this work.
- Code: `src/layouts/CaseStudy.astro` (order, TOC, "Long story short…", FAQs), `src/components/CaseFrame.astro` and the "Case frame" CSS block (testimonial, logo size, company facts row), `src/components/PageClosing.astro` (Ask AI) rendered from `src/layouts/Base.astro` (`closing`, `aiQuestion` props), `src/content.config.ts` (`industry`, `headquarters`, `aiQuestion`, `opening`, `faqs` on work entries), `pageReadingMinutes` in `src/lib/post-format.ts`.
- Placeholders still in the entry: metrics, opening, FAQs and company facts are lorem or made up; the testimonial is Brett Smith's real quote standing in.

## Open work

- Site work is owned by Second Brain `TODO/emmaki.md` ("Develop the goemmaki portfolio website") and `docs/site-plan.md`.
- Owner to write: each page's Ask AI question (`aiQuestion`) and the real case-study copy.
- Merging waits for the owner's "merge" (fast-forward `design/foundation`, never `main`); this branch sits on two other unmerged branches (`design/proof-index-20261102` on `design/post-migration-20261101`).

## Watch-outs and gotchas

- After changing `src/content.config.ts`, the dev server can keep a stale content store: stop it, delete `.astro/data-store.json` (ignored) and restart.
- An Astro component's `<script>` renders in place, so sibling selectors (`+`, `nextElementSibling`) across a component boundary can hit the script tag.
- `services` and `length` are still in the work schema and the placeholder entry but no longer shown anywhere.
- The test Chrome has no fine pointer; hover-only rules need injecting to test.

## How to resume

1. Read `AGENTS.md`, this handoff and the site plan's "Case study template".
2. `git -C ~/worktrees/fiverr-portfolio/case-study-20261102 log --oneline -4`; expect the docs commit on top of `cc7674f9`.
3. If 3012 isn't running: `pnpm exec astro dev --host 0.0.0.0 --port 3012` in the worktree, then open `/proof/placeholder`.
