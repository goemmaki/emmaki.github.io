# Session handoff: About globe accepted (2026-11-01 late evening)

Supersedes [20261101-globe-collections.md](20261101-globe-collections.md) for the globe; its collections and integrations notes still stand.

## Owner goals and decisions

- The globe uses COBE's own globe and dots. No extra dot systems, routes, labels or "YOU?" line. Globe behind ABOUT, transparent header, bottom fade, no scroll shrink.
- Opener: Crete in big amber dots ("editorial ball design"), pulling back into one amber dot the size of COBE's dots. The globe faces Crete until the spin starts, then turns slowly (100 s per revolution) and stops off-screen.
- Light mode: amber `#C78500` (3.1:1), no outline.
- Accepted 2026-11-01 ("good job. Commit that map"). Known and accepted: the Kissamos peninsulas aren't quite right in the opener.
- Next, per the owner: simplify the controls ("fugly"). Then the Proof/portfolio page.

## Current state

- Branch `design/post-migration-20261101` at `ea095c7a` plus this docs commit; **not merged** into `design/foundation` (merge only when the owner says so).
- Dev server for review: `pnpm astro dev --port 3011` in `~/worktrees/fiverr-portfolio/post-migration-20261101`.
- Code: `src/components/about/globe.ts` (tunables at the top), `AboutGlobe.astro` (markup, styles, `--globe-accent`), `geo.ts` (Crete coastline), `land.png` (land map).
- Land map generator: `runtime/globe-land/make-land.py` (ignored; reads `runtime/globe-pass3/ne_10m_land.zip`). `LEFT_OUT` lists the islands removed (Crete, Santorini).

## Open work

1. Controls: the owner earlier asked for one compact vertical dock (play/pause, replay, + that expands rotate and zoom) with styled tooltips. In reduced motion the play button can still start the spin; fix it with the controls.
2. Not checked: Safari, real phones, a screen reader, Lighthouse, tablet widths after the latest changes.
3. `scripts/parity.mjs` imports the git-ignored `runtime/flash/png.mjs` (separate fix).
4. `docs/journal/case-study-notes.md` repeats its "Problems solved" list under "Agent mistakes and corrections" (from an earlier session); tidy separately.
5. Second Brain field-log entry on the Codex model results (Luna high failed pass 2; Sol medium/high passes 2–4) not yet written.

## Watch-outs

- COBE is patched at runtime in `createPatchedGlobe` (shader string replace and texture swap). A COBE upgrade can silently break both: check that the `acos(-d.x/cos(j))` string still exists and that the map still loads through `texImage2D` with an image.
- The amber dot's lattice math mirrors COBE 2.0.1's Fibonacci lattice and `mapSamples` (24000). Changing `MAP_SAMPLES` moves it automatically; changing COBE's lattice would not.
- Headless test Chrome uses software WebGL: frame times there are meaningless. The owner judges smoothness.

## ARTIFACT RETIREMENT

SAFE_TO_DELETE: `runtime/globe-pass4/` (aborted pass), `runtime/globe-pass2/`
SAFE_TO_RETIRE_WORKTREES: none (controls work continues here)
KEEP: `runtime/globe-land/`, `runtime/globe-pass3/ne_10m_land.zip` (map regeneration), `runtime/briefs/` (case-study evidence)
UNKNOWN: none
