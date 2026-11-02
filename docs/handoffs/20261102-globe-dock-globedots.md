# Session handoff: About globe on Globedots, dock, footer tooltips (2026-11-02)

Supersedes `20261101-about-globe.md` (deleted); its still-open items are carried below.

## Owner goals and decisions

- **Globe finished** (owner, 2026-11-02: "This is good"): Globedots 0.1.1 replaces COBE's land dots. Far side 12% in dark mode, off in light mode; no dial. Don't reopen.
- **Dock:** the owner will personally direct how it looks; don't redesign it unprompted. The owner is "not fond of the deck", a design decision for later.
- **Starwind:** kept only because the dock uses Button, Tooltip and Kbd (Popover removed, unused). The owner: if Starwind ends up unused, remove it. Revisit when the dock is redesigned.
- Points ChatGPT raised, **not yet agreed scope** (confirm each with the owner first):
  1. Rethink the expanded dock's layout, spacing, borders and hierarchy.
  2. While Explore is open, the wheel over the globe zooms instead of scrolling the page (the globe covers the whole hero). ChatGPT wants page scrolling to always win.
  3. The zoom track looks like a slider but isn't: make it a real slider or remove it.
  4. CSS-only tooltips everywhere. The footer now uses the light `IconTip`; the dock still uses Starwind's Tooltip (15.6 KB gzip).
- **Owner's own note:** the dock scrolls up under the header "as if the header bar were not there". Options: a transparent header over it, or move the dock to the bottom right of the hero, where ABOUT is. Undecided.

## What happened

- See the journal entry "2026-11-01/02 (night)" in `docs/journal/20260924-20261026-history.md`.
- 2026-11-02: committed on `design/post-migration-20261101`: `ddab78d5` Starwind, `33f01819` the Globedots globe and dock, `33928ae1` footer tooltips (Fiverr and View as agent; all three labels now stay inside the viewport). Not merged anywhere.

## Current state and where things live

- Globe: `src/components/about/` (`globedots.ts` is the shader adapter on the exact 0.1.1 pin, `globe.ts` the controller, `land.png` the 1,864 B per-dot mask, `AboutGlobe.astro` the dock).
- The mask generator `runtime/globedots/make-land.py` and its data `runtime/globedots/data/ne_10m_land.zip` are in this worktree's ignored `runtime/` (copied from the retired prototype); the corrections list is in the script.
- Footer tooltips: `src/components/IconTip.astro` (label + a small script that shows it after 150 ms on hover/focus and shifts it inside the viewport), styled by `.icon-tip` in `src/styles/site.css`.
- Sizes (gzip, imported chunks included): `/about` JS 39,250 B (globe script 14,359, Starwind Tooltip 15,600, Button 878). `astro check` and `astro build` pass.
- Review server: 3011 (this worktree, `astro dev --host 0.0.0.0`).

## Open work

1. Owner: direct the dock's look and position; decide ChatGPT's points 1–4; then decide whether Starwind stays.
2. Not checked: phones (real devices), real GPU frame cost, Safari, a screen reader, Lighthouse, tablet widths.
3. Carried from 2026-11-01: `scripts/parity.mjs` imports the git-ignored `runtime/flash/png.mjs`; `docs/journal/case-study-notes.md` repeats its "Problems solved" list; Second Brain field-log entries for the Codex runs (globe passes, Starwind setup, Globedots prototype) not yet written.

## Watch-outs and gotchas

- Starwind's Tooltip shows and hides with a `hidden` class: never put a `display` utility on its content.
- `globals.css` owns the shadcn color mapping and radius; `starwind.css` adds only Starwind-only names.
- `globedots.ts` patches Globedots' shader by string anchors and throws if an upgrade changes them: keep the exact pin.
- Codex's sandbox has no network: install dependencies yourself before delegating, tell it not to run installs or use the Chrome DevTools MCP, and wrap runs in `timeout`.
- Size measurements must follow imported chunks (`runtime/starwind/closure.mjs`).

## How to resume

1. Read `AGENTS.md`, this handoff and the latest journal entry.
2. `git -C ~/worktrees/fiverr-portfolio/post-migration-20261101 log --oneline -5`; open `/about` on 3011.
