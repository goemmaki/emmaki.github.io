# Overnight review and cleanup, 2026-11-03

First run of `docs/checks/overnight-review.md`. Codex reviewed and fixed; Claude integrated, triaged and verified. This records what was measured and changed, not a WCAG conformance claim.

## What was reviewed

`review/overnight-20261103` (local, not pushed): `design/case-study-20261102` (which already contains `proto/globedots-20261102`, the proof index and post-migration work) plus `design/hero-poster-20261102`, merged at `ddb31438`. Two conflicts: both journal entries kept; the header halo became one rule on `[data-clear]`, which covers About's globe and the Home hero. Uncommitted experiments in the globedots worktree (a "Far side" opacity slider, a Starwind popover) are in no branch and were not reviewed.

## How it was run

- **Claude:** install, check, build, dev server (3006) and static server (3021), Lighthouse before and after (Chrome, 7 routes, desktop and mobile, light and dark).
- **Phase A, Codex `gpt-6.1-sol` high, read-only:** Astro dev-toolbar audit on 8 routes in both themes (102 items), 120 axe scans (0 violations), keyboard on every route/theme/viewport, 92 contrast capture pairs, focus rings, reduced motion, image-blocked and short-viewport resilience, review of all 74 `src/` files, context7 for Astro docs. 20 findings: 11 FIX-SAFE, 2 FIX-VISUAL, 4 DECIDE, 3 INFO. Report: `runtime/overnight/a-report.md`, evidence `runtime/overnight/a/`.
- **Phase B, Claude:** checked the FIX-SAFE findings in source; 11 items went to `runtime/overnight/fix-list.md`. Held back: server-rendering the logo strip (risk to the roll fixed in `36c7b571`), removing the unused `cobe` dependency (lockfile change), the globe's live reduced-motion response (no GPU to test).
- **Phase C, Codex `gpt-6-luna` medium:** 11 commits, `143ecedd`..`2a64e2ff`, each with check and build passing and a Firefox verification. About 360K tokens.
- **Phase D, Claude:** read every diff; Chrome test of the Tab fix (Tab moves to the next trigger, Shift+Tab to the previous element); confirmed none of the deleted CSS classes has a consumer; before/after full-page screenshots of 7 routes x 2 widths x 2 themes under reduced motion: 26 of 28 pixel-identical, the other two differ by about 25 pixels on the edge of About's fixed review switcher (capture anti-aliasing; no commit touches it).

## Fixes (commits)

| Commit | Fix |
|---|---|
| `143ecedd` | Page-tools menus: Tab and Shift+Tab leave the menu (were swallowed) |
| `b4e346c9` | FAQ: open panels release their fixed height, so resizing no longer clips them |
| `277b881f` | About globe without WebGL: no slider role, tab stop or value attributes |
| `67e5a174` | "Copy as .md": post images point at the built asset URLs (were 404s) |
| `d7421967` | Blog posts without a cover keep a real h1 |
| `32a8b7f0` | Footer tooltips stay open while hovered and close on Escape (WCAG 1.4.13) |
| `c467cc78` | Testimonials: valid figure/figcaption structure (Astro audit structure items) |
| `3df1852e` | About 120 lines of dead React-era CSS removed |
| `acced4b2` | AI-provider URLs from one mapping (`src/lib/ai-providers.ts`) |
| `285c8ec2` | ASCII image decode failures are logged, not swallowed |
| `2a64e2ff` | Client logo roll stops and resumes when reduced motion changes mid-visit |
| `f2e34c51` | (Claude) Home hero: skip a portrait draw while the canvas has no size; Phase D's screenshot run caught an `IndexSizeError` from tonight's hero code |

## Lighthouse (built site, Chrome, before -> after)

Accessibility 1.0 and best practices 1.0 on every route, both runs. Home performance 0.87–0.94 -> 0.88–0.94; About 0.66–0.70 -> 0.66–0.70 (the globe; Codex measured 132–148 s of total blocking time in headless Chrome without a GPU, so it needs profiling on real hardware); `/proof/placeholder` 0.93–1.0 -> 1.0 (run noise); every other route 1.0. `/proof/placeholder` SEO 0.63 in both: its deliberate `noindex`. JSON: `runtime/overnight/lighthouse-before/` and `lighthouse-after/`.

## Agent and tooling notes

- Codex couldn't commit from a linked worktree until the shared git directory (`~/fiverr-portfolio/.git`) was added as a sandbox writable root.
- Astro 7's `astro dev` detaches itself; stop it with `astro dev stop`.
- Playwright 1.64.1's request interception doesn't match the cached Firefox; Codex used the installed 1.61.1 client for those runs.
- Codex's first audit runners failed on its own over-broad selectors and were rerun; recorded in its report.

## Not tested

WebKit, real screen readers, real devices, GPU globe rendering, production hosting.
