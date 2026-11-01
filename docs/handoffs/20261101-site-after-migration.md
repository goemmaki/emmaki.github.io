# Session handoff: the site after the Astro migration (2026-11-01)

## Owner goals and decisions

The Astro migration is finished and merged into `design/foundation`. The owner is pleased with it and wants to go back to designing the site and writing content. No more migration milestones and no long investigations. Visual issues are worked through from the backlog after the migration, not as one big run.

## How the owner works

The owner reviews in real Chrome, including phone and iPad mini widths in dev tools. Headless probes have missed several things the owner then saw, so the owner's Chrome check closes each visual item. "Merge" means fast-forward `design/foundation`, never `main`.

## What happened

M11 verification passed, apart from one Chromium case. The owner's review asked for one fix before the merge (blog spotlight state on F5). Claude fixed it in `src/components/blog/PostCover.astro`, and parity is now 32/32 in both engines. Every other observation is in `docs/visual-polish-backlog.md` items 12–19. Case-study material: `docs/journal/case-study-notes.md`. The full record is in `docs/exec-plans/20261031-astro-migration.md` (complete) and today's journal entry.

## Current state and where things live

- The site is Astro at the repository root. `pnpm run check`, `pnpm run build`, and `scripts/parity.mjs` compare against a reference (default 3006, the old Next export).
- Servers: Astro dev on 3004 and production `dist/` on 3005 in `~/worktrees/fiverr-portfolio/astro-migration-20261031`; the Next reference export on 3006.
- Primary checkout `~/fiverr-portfolio`: local `design/foundation` is behind `origin/design/foundation` and has uncommitted owner edits (`AGENTS.md`, `docs/fiverr/DESIGN.md`, untracked folders). It was not touched. Before working there, the owner decides how to bring those edits forward.

## Open work

1. The owner checks the spotlight fix in Chrome (backlog item 12).
2. Visual-polish backlog, in the order the owner chooses. The light-mode menu contrast (item 14) is also an accessibility problem. Item 19 (the yellow graphic) waits for the owner's bento-graphics redesign. Item 16 (header reveal on hover) needs the owner's decision on the convention first.
3. No deployment yet: Pages serves `main` (README only). Deploying root `dist/` is future work and needs the owner.
4. End-of-day checks (`docs/checks/end-of-day.md`) including Lighthouse have not run on the Astro build.

## Watch-outs and gotchas

- Do not rebuild `dist/` while a parity or probe run is reading 3005.
- Headless Chromium does not send the reload `pointermove`. To reproduce it, move to the same position after reload (see `runtime/astro-migration/m11/spotlight-fix/reload.mjs`).
- Leftover sandbox processes and Python servers on 3007–3009 from earlier Codex runs are harmless and can be stopped.

## How to resume

Read root `AGENTS.md`, then `docs/visual-polish-backlog.md`, and ask the owner what to design or fix next.

## ARTIFACT RETIREMENT

SAFE_TO_DELETE: `runtime/astro-migration/m1*`–`m9*` evidence and old `runtime/parity/` captures once the owner no longer needs migration evidence for the case study (ask first)
SAFE_TO_RETIRE_WORKTREES: none yet; this worktree runs the 3004/3005 servers
KEEP: `runtime/astro-migration/m11/`, `runtime/astro-migration/m11-chromium/` (case-study evidence)
UNKNOWN: whether the 3006 Next reference is still wanted after the backlog
