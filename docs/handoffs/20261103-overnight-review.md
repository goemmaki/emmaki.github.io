# Session handoff: overnight review, hero poster and caution tape (2026-11-03)

Supersedes `20261102-hero-poster.md` for what's next; that file still describes the hero's files.

## State

- **Review branch:** `review/overnight-20261103` in `~/worktrees/fiverr-portfolio/overnight-20261103`, local only. It is `design/case-study-20261102` + `design/hero-poster-20261102` (merge `ddb31438`), 11 Codex fixes and one Claude hero fix (`f2e34c51`). Check and build pass. Details and evidence: [journal](../journal/20261103-overnight.md).
- `origin/design/foundation` is unchanged at `21c7d553`. Nothing was pushed.
- Servers: none left running (dev 3006, static 3021 and 3022 stopped). The hero branch's dev server on 3001 is the owner's.

## Needs the owner

1. **Merge:** fast-forward `design/foundation` to `review/overnight-20261103` and push? It carries the case study, the About globe, the proof index, the hero and tonight's fixes.
2. **Tape finish:** pick one in the dev picker (`?tape=pulled|flat|depth|print|worn`); then the others and the picker go.
3. **Background words:** obey the gutters, or stay full width?
4. **Hero at 2560:** the disk and portrait sit low. Raise them?
5. **About globe performance:** Lighthouse 0.66–0.70, from the globe's rendering in headless Chrome. Profile on a real GPU before changing density, resolution or frame rate; any change alters how it looks.
6. **About's layout switcher ships to production** (`AboutConcepts.astro`, not dev-only) and covers content on phones. Make it dev-only, or pick a layout and remove it?
7. **Motion exceptions:** the caution tape's crawl and the case-study frame's animation run continuously, but they're not on DESIGN.md's list of accepted exceptions (sparkles, footer drift, blog masks, 404 nebula). Add them, or change them?
8. **Logo strip without JavaScript** shows no logos (screen-reader names survive). Server-rendering the first logos is possible but touches the roll that was just fixed; want it?
9. **`cobe`** is installed but unused since Globedots. Remove it (lockfile change)?
10. **Per-page titles and descriptions:** Home, About, Brands and Proof share the default ones; the owner writes them.
11. **Copy:** the h1 statement is still placeholder ("I help X and Y…").
12. **Portrait:** `public/hero/portrait.png` is a 2.1 MB AI stand-in; real photo and format later.
13. **Globedots worktree:** uncommitted "Far side" opacity slider and Starwind popover, in no branch. Keep, commit or discard?

## How to resume

Read `AGENTS.md`, then this file. Reports: `runtime/overnight/a-report.md` (findings A01–A20), `fix-list.md`, `c-report.md` in the review worktree. Checks via `run-check`. Procedure: `docs/checks/overnight-review.md`.
