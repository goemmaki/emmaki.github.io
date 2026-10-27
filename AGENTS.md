<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Owner rules

- When the owner rejects a change ("this sucks", "hideous", "no"), stop all work on it at once, including any running agent, audit or verification, and revert to the last approved state. Do not iterate on, test or polish the rejected version; ask what to do next.

## Settled owner decisions (do not reopen or re-propose)

- **Continuous motion stays** (2026-10-26, restated 2026-10-27): the sparkles, footer drift, blog masks judder and 404 nebula run without a pause control and without "bursts". The site does not meet WCAG 2.2.2 by the owner's choice; reduced motion is still honoured. Details: `docs/design-system/DESIGN.md`, "Motion".
- **GSAP stays installed** though unused; the owner may use it.

## Development journal

- At the end of every working session, append a dated entry to `docs/journal/` (rules in its `README.md`). It is the evidence base for the owner's case study about building this site: facts and commit hashes, every rejected or reversed idea, measured numbers, agent mistakes. No marketing prose; the owner writes the case study.

## Next action

- Blog post page, cover, refactor and current branch state: resume from [docs/handoffs/20261026-site.md](docs/handoffs/20261026-site.md).
- Home hero: resume from [docs/handoffs/20261025-home-hero.md](docs/handoffs/20261025-home-hero.md). The nib section and `/hero-lab` were deleted on 2026-10-27.
