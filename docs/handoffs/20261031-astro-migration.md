# Session handoff: Astro migration (2026-10-31)

The session record is the journal entry "2026-10-31 — Astro migration" in `docs/journal/20260924-20261026-history.md`. The ExecPlan `docs/exec-plans/20261031-astro-migration.md` owns the migration's progress, decisions and evidence; read it first. `20261029-proof-case-study.md` stays current for the Next-side design work.

## Owner goals and decisions

- Move the site to Astro, ending with no React. Stages: static Astro first, DOM/canvas behavior ported to vanilla TypeScript, Base UI widgets (header dialog, FAQ, tooltips, page-tools menus) kept as React islands until a later stage the owner decides.
- Visual design and motion must match Next exactly. The `tabindex="-1"` on `<main>` stays.
- Use the cheapest capable agent: Codex `gpt-6-luna` medium for bounded milestones.

## How the owner works

- Compares Astro on http://192.168.20.5:3004 with Next on http://192.168.20.5:3003 (the a11y worktree), in Chrome, including phone and iPad mini widths.
- Codex can only use Firefox in its sandbox; anything relying on scroll-driven animation needs the owner's Chrome check.

## Current state

- **Worktree:** `~/worktrees/fiverr-portfolio/astro-migration-20261031`, branch `design/astro-migration-20261031`, local only, last commit is the docs commit after `b4988acc`. Every Next route has an Astro counterpart.
- **Run:** the Astro dev server runs itself in the background: `pnpm --dir astro --ignore-workspace run dev` (port 3004, all interfaces); stop with `pnpm --dir astro --ignore-workspace exec astro dev stop`. Always use `--ignore-workspace`, or pnpm installs the root Next graph.
- **Checks:** `run-check -- pnpm --dir astro --ignore-workspace run check` and `... run build`; Next invariant: `git diff --stat e504a4bd -- src public docs/design-system package.json next.config.ts tsconfig.json postcss.config.mjs eslint.config.mjs pnpm-lock.yaml pnpm-workspace.yaml` must be empty.

## Next action

1. Owner reviews in Chrome: the cover pixelation fix on `/blog/placeholder-post` (dark theme), Home, and the M7 routes; plus Codex's open items: 6 px mobile height differences (About, Proof, case page) and the Blog tagline visibility.
2. Fix what the owner finds, one Codex Luna-medium run per batch, then commit.
3. Owner decides the next stage: port the non-Base-UI islands left in React (`ProofIndex`, `CaseFrame`, `AsciiImage`, `NebulaField`), then replace the Base UI widgets, then remove React; later Content Collections/MDX and the AVIF image pipeline once Next is retired.
4. Not decided: when to retire the Next app and switch GitHub Pages to `astro/dist`. Never fast-forward `design/foundation` or touch `main` without the owner saying "merge".
