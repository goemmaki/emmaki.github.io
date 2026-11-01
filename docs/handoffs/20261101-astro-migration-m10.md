# Session handoff: Astro migration M10 (2026-11-01)

## Owner goals and decisions

The owner approved retiring Next before merge. M10 only was requested; M11 remains for full review and merge. Keep GSAP installed at `^3.15.0`. Do not change deployment settings.

## How the owner works

Claude restarts the site servers after the source directory move. Do not start or stop ports 3003–3006.

## What happened

Astro now lives at the repository root. The Next app and package dependencies/configs were removed; the three cut React components were moved to `archive/darlings/`. Root `public/` remains the Astro public directory. GSAP and `pnpm-workspace.yaml` (`allowBuilds`) remain. Docs and parity defaults were updated. No commit was made.

## Current state and where things live

- `docs/exec-plans/20261031-astro-migration.md` owns M10 evidence and M11 actions.
- `CONVENTIONS.md`, `README.md`, and `docs/design-system/ARCHITECTURE.md` describe the root Astro layout.
- The exact offline install fails because `source-map-js@1.2.2` is missing from the default store. Root check/build pass with currently linked dependencies. Firefox parity is 32/32. Chromium is 31/32; the sole dark mobile article case reproduces on the M9d source baseline, so it is preexisting. Final reference scans and diff checks are recorded in the M10 plan.
- `git mv` and `git worktree add` were blocked because shared `.git` metadata is read-only. The baseline was built from an archive of `0b24565d` under `runtime/`, not a worktree.
- The 3007 port was occupied, left untouched; temporary Astro build used 3008.

## Open work

M11 owns any remaining verification, owner review, then the explicitly authorized merge process described in the ExecPlan. First populate the root install with `pnpm install --frozen-lockfile` if the offline error persists. Claude must restart the affected dev servers after this path move.

## Watch-outs and gotchas

The old ignored `astro/` folder still contains generated dependencies/build caches; restart old servers before retiring those artifacts. Do not delete ignored `out/` or `.next/`. CSS bundle output is smaller after removing the two unavailable Next-owned CSS imports and unused React-source utilities; the source-archive baseline and full parity evidence are detailed in the plan.

## How to resume

Read root `AGENTS.md`, then `docs/exec-plans/20261031-astro-migration.md` at M10 outcome and M11. Run the remaining M11 checks only after reviewing the recorded M10 limitations.

## ARTIFACT RETIREMENT

SAFE_TO_DELETE: none
SAFE_TO_RETIRE_WORKTREES: none
KEEP: `runtime/astro-migration/m10/` and the M10 log files under `runtime/checks/` until M11 verification and review finish; re-evaluate at M11 closeout. Existing ignored `astro/node_modules/`, `astro/.astro/`, and `astro/dist/` until Claude restarts the old dev servers; re-evaluate after restart.
UNKNOWN: none
