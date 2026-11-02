# Stack and commands

- The production site is a static Astro project rooted here. Read `CONVENTIONS.md` before changing site code, and check current Astro 7 APIs in the official docs (context7 or docs.astro.build) rather than from memory.
- Run `pnpm install --frozen-lockfile`, `pnpm run check`, and `pnpm run build` from the repository root. Build output is `dist/`.
- `pnpm-workspace.yaml` retains pnpm's `allowBuilds` policy (`sharp: false`, `unrs-resolver: false`); it remains needed to control dependency install scripts.
- Compare production output with `node scripts/parity.mjs`; see `CONVENTIONS.md` for the reference export and browser matrix.
- Blog posts and work entries are content collections (`src/content.config.ts`, one folder per entry with `index.mdx` and its media). Images, SVGs, screenshots and video follow [docs/media.md](docs/media.md).
- Integrations researched for later (not installed): studio `docs/research/astro-integrations-20261101.md` (`~/worktrees/studio/main`).

## Owner rules

- **American English only** (owner, 2026-10-27): site copy, drafts, comments and docs use en-US spelling and usage (organizations, color, optimize). Never en-GB.
- When the owner rejects a change ("this sucks", "hideous", "no"), stop all work on it at once, including any running agent, audit or verification, and revert to the last approved state. Do not iterate on, test or polish the rejected version; ask what to do next.

## Settled owner decisions (do not reopen or re-propose)

- **Continuous motion stays** (2026-10-26, restated 2026-10-27): the sparkles, footer drift, blog masks judder and 404 nebula run without a pause control and without "bursts". The site does not meet WCAG 2.2.2 by the owner's choice; reduced motion is still honoured. Details: `docs/design-system/DESIGN.md`, "Motion".
- **GSAP stays installed** though unused; the owner may use it.

## Development journal

- At the end of every working session, append a dated entry to `docs/journal/` (rules in its `README.md`). It is the evidence base for the owner's case study about building this site: facts and commit hashes, every rejected or reversed idea, measured numbers, agent mistakes. No marketing prose; the owner writes the case study.
- **Always write a handoff with the journal entry** (owner, 2026-10-29), without being asked: `docs/handoffs/YYYYMMDD-<slug>.md` per the `session-handoff` skill, linked under "Next action" below. Delete or mark superseded any older handoff it replaces.

## Next action

- Home hero poster and caution tape (2026-11-03; tape finish, gutters for the words and placeholder h1 await the owner): [docs/handoffs/20261102-hero-poster.md](docs/handoffs/20261102-hero-poster.md).
- The plan (page jobs, Home's sections, performance targets, measuring the Fiverr handoff, open questions): [docs/site-plan.md](docs/site-plan.md).
- Ideas kept for later: [docs/ideas.md](docs/ideas.md).
- Visual glitches and polish to fix after the Astro migration merges, in the owner's words: [docs/visual-polish-backlog.md](docs/visual-polish-backlog.md).
- New client or a logo to replace: follow [.claude/skills/client-logo/SKILL.md](.claude/skills/client-logo/SKILL.md).
- Current site state, the 2026-10-28 checks and code review to finish: resume from [docs/handoffs/20261028-site.md](docs/handoffs/20261028-site.md).
- Latest (2026-11-02 evening): case study template revised (facts in the frame, "Long story short…", contents column, FAQs; Ask AI in the shared closing); see [docs/handoffs/20261102-case-study.md](docs/handoffs/20261102-case-study.md).
- Earlier (2026-11-02): Proof index revised (Client / Type / Tags, hover blurb, two-tap on touch), closed; see [docs/handoffs/20261102-proof-index.md](docs/handoffs/20261102-proof-index.md).
- Earlier (2026-11-02): About globe finished on Globedots, dock committed (owner directs its look later), footer tooltips; resume from [docs/handoffs/20261102-globe-dock-globedots.md](docs/handoffs/20261102-globe-dock-globedots.md).
- Earlier (2026-11-01 evening): content collections and integrations; see [docs/handoffs/20261101-globe-collections.md](docs/handoffs/20261101-globe-collections.md).
- Earlier (2026-11-01): the Astro migration is merged; resume from [docs/handoffs/20261101-site-after-migration.md](docs/handoffs/20261101-site-after-migration.md). Migration record: [docs/exec-plans/20261031-astro-migration.md](docs/exec-plans/20261031-astro-migration.md); case-study material: [docs/journal/case-study-notes.md](docs/journal/case-study-notes.md).
- Proof and Home (2026-10-29; its case-study parts are superseded by the 2026-11-02 handoff): resume from [docs/handoffs/20261029-proof-case-study.md](docs/handoffs/20261029-proof-case-study.md).
- Home hero: resume from [docs/handoffs/20261025-home-hero.md](docs/handoffs/20261025-home-hero.md). The nib section and `/hero-lab` were deleted on 2026-10-27.
