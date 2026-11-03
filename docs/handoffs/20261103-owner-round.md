# Session handoff: owner review round (2026-11-03)

Current handoff. It replaces `20261103-overnight-review.md` (kept for the overnight's detail) and `20261102-hero-poster.md` for what's next.

## State

`review/overnight-20261103` in `~/worktrees/fiverr-portfolio/overnight-20261103`, local only. `origin/design/foundation` is unchanged at `21c7d553`. Dev server: http://localhost:3004 from this worktree (the hero branch's 3001 is stale: it has no globe and none of tonight's work). Check and build pass.

Done in this round (owner's decisions, 2026-11-03):
- Caution tape: "Depth + print" only, picker removed (`b4358dcd`); pauses off screen (`e9c24387`).
- About: Statement layout only, switcher removed (`80c88bab`); globe kept, decorative, controls removed (`ea81a694`).
- Home words: full bleed, horizontal overflow clipped at `main` (`8992f22c`).
- Hero portrait: background removed once by `scripts/hero-cutout.mjs`, served by Astro as WebP q90, 172 KB instead of 2.1 MB; drawn in about 0.43 s instead of 1.55 s on a 20 Mbps link (`6773d947`). Halftone differs from before in 1.5–2.3% of inked pixels (scaling once instead of twice), not visible side by side; AVIF was rejected because it leaves faint dots off the figure. Evidence: `runtime/portrait/`.
- Motion exceptions in DESIGN.md now include the tape, the case-study frame noise and the About globe, all pausing off screen.
- Globedots worktree experiments discarded (patch and archive kept in its ignored `runtime/`).

## Needs the owner

1. **Merge:** fast-forward `design/foundation` to this branch and push?
2. **About globe performance:** Lighthouse 0.66–0.70; profile on a real GPU before changing how it renders.
3. **Logo strip without JavaScript** shows no logos; server-render the first ones (touches the roll)?
4. **`cobe`** is unused; remove it (lockfile change)?
5. **Per-page titles and descriptions** for Home, About, Brands and Proof (owner's copy).
6. **Copy:** the h1 statement is still placeholder.
7. **New photos:** run `node scripts/hero-cutout.mjs <photo> src/assets/hero/portrait-cutout.png`; Astro does the rest.

Later (backlog, `docs/visual-polish-backlog.md`): hero at 2560 sits low (with real photos); real controls for the About globe.

## How to resume

Read `AGENTS.md`, then this file. Journal: `docs/journal/20261103-overnight.md`.
