# Session handoff: About globe, content collections, integrations (2026-11-01 evening)

## Owner goals and decisions

- First post-migration pass from a ChatGPT brief. The priority is the About globe, then content collections and the two official integrations.
- **Dropped:** the Fiverr CTA in the brief (ChatGPT added it; "a future change").
- **Not live:** there is no production URL and the owner isn't ready to launch. `site` stays unset, so the sitemap is inert. Dev is on 3004, preview on 3005.
- Logos come straight after the hero in all three About concepts (the concept switcher stays).
- The integration reference lives in studio (PR slashrepeat/studio#3); HyperFrames is in the Second Brain inbox.
- The statement ("FROM HERE. TO THERE.") has a review-only left/right switcher (`?statement=right`); the owner picks a side.

## Current state

- Branch `design/post-migration-20261101` (worktree `~/worktrees/fiverr-portfolio/post-migration-20261101`), pushed and **not merged** into `design/foundation`.
- Dev server for review: `pnpm astro dev --port 3011` in that worktree (http://192.168.20.5:3011/about).
- Globe code: `src/components/about/AboutGlobe.astro` (markup, styles, wiring) and `globe.ts` (COBE plus overlay). Tunables are at the top of `globe.ts`: start scale, intro timings, tilt, settled longitude, arc height, and the "YOU?" target and altitude.
- Collections: `src/content.config.ts`; the sectioning plugin is `src/lib/collection-sections.ts` (Sätteri, not rehype), and per-collection classes are in `src/lib/prose.ts`.

## Open work

1. The owner's live review of the globe. Expect tuning of the composition, labels, wireframe strength, the scroll shrink and the statement side. When the owner picks a side, remove the statement switcher.
2. Not yet checked: light mode, phone/tablet still plus Explore, reduced motion, no-WebGL fallback, keyboard slider on a screen reader, Lighthouse.
3. A pre-rendered AVIF still for phones (instead of drawing one frame with WebGL), if Lighthouse or the owner wants it.
4. `scripts/parity.mjs` depends on the git-ignored `runtime/flash/png.mjs`. Commit the helper under `scripts/` (separate fix).
5. Merge (fast-forward `design/foundation`) only when the owner says so.

## Watch-outs

- Astro 7 silently ignores unified remark/rehype plugins; use Sätteri plugins.
- COBE 2 renders only on `update()`. It wraps the canvas in its own div and adds a `<style>` to `<head>`.
- The globe's blend mode needs its stage to be the blended element. A mask or transform on an ancestor would isolate it and bring back the ocean disc.

## ARTIFACT RETIREMENT

SAFE_TO_DELETE: `runtime/*-astro-migration-*.html` and `runtime/*-post-migration-*.html` HTML diffs in the worktree
SAFE_TO_RETIRE_WORKTREES: none (review in progress)
KEEP: `runtime/parity/collections/` (parity evidence)
UNKNOWN: the Python server on 127.0.0.1:3010 serving this worktree's `dist/` (started for parity; can be stopped)
