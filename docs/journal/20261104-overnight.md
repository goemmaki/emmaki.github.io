# Overnight checks and fixes, 2026-11-04

First run of the rewritten `docs/checks/end-of-day.md` in full mode, through `overnight-review.md`. This records what was measured and changed, not a WCAG conformance claim.

## What happened, candidly

- **Checklist rewrite (Claude):** `end-of-day.md` became one checklist with quick and full modes (three engines, 11 viewports, touch, Astro toolbar triage, HTML validity, security, copy QA, soak, visual regression); `lighthouse.cjs` gained `RUNS` with a median. Chromium and WebKit 26.5 were found to launch inside Codex's sandbox with the Playwright 1.61.1 client.
- **Phase A, Codex `gpt-6.1-sol` high, read-only:** about 1.23M tokens. 22 findings: 8 FIX-SAFE, 4 FIX-VISUAL, 6 DECIDE, 4 INFO. 576 full-page captures (new visual baseline), 206 toolbar items judged one by one, zero root overflow, 201 internal references resolved, no third-party requests. Report: `runtime/overnight/a-report.md`, evidence `runtime/overnight/a/`.
- **Agent choice was wrong:** the whole audit ran on Sol high because the old doc said so; the owner pointed out that measurement, judgment, code review and fixes should be separate runs on different models. The split was agreed but not yet written into `overnight-review.md`.
- **The night stalled:** Claude kept asking the owner questions after the owner had gone to bed, then stopped on the owner's "stop"; triage and the Codex fix phase (C) never ran. At 08:00 the owner said to abandon Claude's pending work. Claude then made the owner's chosen fixes inline in the morning.
- **Lighthouse script bug found by Codex (A-02):** the Node API ignores a `preset` flag, so every "desktop" Lighthouse result so far, including the 2026-11-03 numbers, used mobile settings. A fix was written, then dropped at the owner's word ("leave it"); the diff is in `runtime/abandoned-lighthouse-desktop-fix.diff`.

## Fixes (Claude, morning, owner-chosen)

| Commit | Fix |
|---|---|
| `2d83b217` | About globe: drag, zoom, keyboard and pause machinery removed (about 220 lines); on a software renderer the globe is one still frame facing Europe with Crete visible |
| `6a71c696` | Old Home hero-poster CSS removed (about 100 lines, no consumers) |
| `87c1908c` | Dark Reader opt-out meta gets `content=""` (Nu errors on all 8 pages gone) |
| `0b7c7c72` | Plex Mono 500 no longer preloaded on every page (about 10 KB) |
| `c6a26432` | Case-frame avatar lazy-loads and decodes async |
| `569cc67d` | Case-frame quote font failure is logged instead of an unhandled rejection |
| `7e88281f` | About's logo strip is Home's exactly (one gutter, not two); About's redundant logo-copy script removed |
| `f4202de2` | Checklist: first visit is dark by design (owner decision) |

## Verification

- `pnpm run check` 0 errors, 0 warnings; build passes after each change.
- Before/after full-page screenshots, Chromium, 8 routes × 2 themes × 1440 and 390, reduced motion, against a build of `f16f91b1` on 3022. Differences were the same size as the old build compared with itself (logo roll and other live elements, ±6 px page heights), so this shows no change beyond noise; it can't prove pixel identity.
- Globe on SwiftShader: before, the lines canvas kept changing; after, it is constant over 2 s, faces Europe, Crete's dot visible, no page errors. GPU behavior untested (no GPU here).
- Fonts blocked on Home: one console warning, no unhandled rejection. Logo strip on About and Home: same x, width and gutter at 1440 and 390; every logo has its colour copy.
- Lighthouse (mobile settings, one run): About 0.85–0.93 (was 0.69–0.70); Home 0.99, accessibility 0.97 (the approach step numbers, A-17, waiting on the owner).
- Nu HTML Checker: two errors left, a false alarm on CSS `@property` and the tape filter's missing `in2` (FIX-VISUAL).

## Not tested

Real screen readers, GPU rendering, correct desktop Lighthouse (script bug above), WebKit axe (crashed on real pages), field Web Vitals, deployed headers.
