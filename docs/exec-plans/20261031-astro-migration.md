# Migrate the emmaki site to Astro, stage 1: scaffold, shared shell and Brands

This ExecPlan is a living document. Keep `Progress`, `Surprises & Discoveries`, `Decision Log` and `Outcomes & Retrospective` current as work proceeds.

## Purpose / Big Picture

The site is a Next.js 16 / React 19 / Tailwind v4 static export. The owner has decided to move it to Astro so that mostly static pages stop shipping the React and Next runtime (about 207 KB gzipped of shared script on every page in the 2026-10-29 build), and so that case studies and posts can use Content Collections, MDX and build-time AVIF/WebP images later.

The long-term target is Astro with no React. The route there is staged:

1. Astro renders all static markup.
2. Components whose behavior is plain DOM or canvas code inside React effects are ported to vanilla TypeScript in `.astro` components as they are migrated.
3. Components built on Base UI widgets (`site-header.tsx` dialog, `faq.tsx` accordion, `tooltip-link.tsx`, `page-tools.tsx` menus), and anything that contains one, stay React islands for now. Replacing them is a later stage the owner will decide on.

**This stage ends when the Brands page (`/brands`) renders in Astro inside the full site shell (header, footer, bottom blur, page closing, theme) and looks and behaves the same as the Next version, and the Next version still works unchanged.** Then work stops so the owner can compare the two live: Next on port 3003 (the a11y worktree, already running) and Astro on port 3004.

Out of scope for this stage: every other route, MDX and Content Collections, image pipeline, video, removing React islands, deleting the Next app, deployment changes.

## Progress

- [x] (2026-10-31, Claude) Branch `design/astro-migration-20261031` and worktree `~/worktrees/fiverr-portfolio/astro-migration-20261031` created from `design/a11y-20261028` at `e504a4bd`.
- [x] (2026-10-31, Claude) This plan written.
- [x] M1 (2026-10-31): Node is `22.23.4`; isolated Astro check reports 0 errors/warnings/hints, build emits `/brands` and `/`, both local sites respond, and the Next invariant diff is empty.
- [x] M2 (2026-10-31): Playwright Firefox acceptance completed against Astro `:3004` and Next `:3003`: menu focus/Escape, both theme toggles and reload persistence, clock/footer/back-to-top, and reduced motion match. No page or console errors.
- [x] M3 (2026-10-31): Brands screenshots captured at both requested viewport sizes and themes. Brand hover color, sticky note, fonts-ready page-closing width, and footer interactions match. Static route JS was counted in both builds. No parity fix was needed; stop here for owner comparison.

## Surprises & Discoveries

- 2026-10-31: Node is now `22.23.4`, removing Astro 7.4.4's Node gate. Claude fixed the build by adding `@base-ui/react@1.8.0`, `lucide-react@1.48.0`, and dev dependency `@astrojs/check@0.9.12`; deduping React, React DOM, lucide-react, and Base UI; and setting Astro `publicDir` to the repository root `public/`. Duplicate React resolution had caused a `useContext`-of-null build crash. The correct `astro check` invocation now reports zero diagnostics; the earlier apparent pass was an interactive install prompt, not a check.
- 2026-10-31: This repository's root pnpm workspace boundary caused plain `pnpm -C astro ...` invocations to resolve/install the root dependency graph. Those attempts were interrupted (exit 130) and were replaced with `pnpm --dir astro --ignore-workspace ...`; this generated `astro/pnpm-lock.yaml` and left the tracked root lockfile unchanged. The interrupted root installation did write ignored root `node_modules` state; its before-state is unknown, so it was not cleaned or reset. pnpm also created an untracked root `.pnpm-store/` directory during this session; it was removed after the final pnpm invocation. The Next reference remained reachable at `http://localhost:3003/brands` (HTTP 200).
- 2026-10-31: Playwright Firefox ran from the local cached Firefox runtime. Final screenshots were taken after fonts and entrance effects settled, with dev-only Astro/Next diagnostic overlays hidden in the capture. An initial capture before effects settled was misleading; final screenshots show the complete content and are the evidence of record.
- 2026-10-31: The initial browser harness also forced a dark-theme init script on every reload, invalidating its first persistence observation; it was removed from the interaction context. A 250 ms hover sample could catch the color transition mid-flight, so final hover checks wait 500 ms. The final run reports equal hover colors and both theme states persisted after reload.
- 2026-10-31: Both builds match on metadata, brand hover color (`rgb(91, 77, 252)` in both themes), sticky positioning, and page-closing width (854 px measured, stored, and used by the row). Theme changes persisted both directions across reloads. With stored light theme, Firefox observed light at first contentful paint in both builds (Astro 71 ms, Next 143 ms). Menu focus and Escape close worked; reduced-motion hid the splash and reduced panel animation to `0.00001s`; footer pointer lighting cleared on leave; back-to-top returned scroll to 0; no console, page, or request errors occurred.
- 2026-10-31: Remaining observed differences are expected per-visit values: footer wordmark selects `try`, `fly`, or `buy` randomly, and the live clock advances by minute. Neither is a parity defect. No source parity bug was found, so no code fix was needed under `astro/` during acceptance.
- 2026-10-31: Static route payload counts use Astro `dist/brands/index.html` and Next reference export `../a11y-20261028/out/brands.html`, not dev-server HMR requests. Astro loads 5 external bundled JS files (355,509 raw bytes; 122,732 bytes gzip summed per file), Next loads 12 (785,529 raw; 253,731 gzip). Inline executable scripts add Astro 5 / 7,183 raw bytes and Next 3 / 16,888 raw bytes. Combined code totals are 362,692 raw for Astro and 802,417 raw for Next: a 54.8% raw reduction. The gzip sums are 126,006 and 257,974 bytes respectively (51.2% lower), compressing each external file and inline block separately; inline scripts are part of the HTML response, so this gzip figure is not an observed page transfer size.

## Decision Log

- 2026-10-31, Claude: Astro lives in a separate `astro/` directory with its own `package.json`, so the Next app at the repository root keeps working and both can run side by side during the migration. Astro dev and preview use port 3004 (3000–3003 are taken by other dev servers).
- 2026-10-31, Claude: Base UI widgets stay React islands in this stage; non-Base-UI interactive components on the Brands page are ported to vanilla TypeScript now rather than wrapped as islands and ported twice. If a port cannot match current behavior, keep that component as a React island and record why here.
- 2026-10-31, Codex: Astro is installed as its own package using `pnpm --dir astro --ignore-workspace install`, because invoking pnpm from `astro/` without `--ignore-workspace` selected the root workspace and began installing the Next dependency graph. README commands use this isolated form. Dependencies are pinned to the versions resolved by the isolated install.
- 2026-10-31, Codex: Fontsource files provide Latin subsets for the same families and requested weights/styles; Astro uses the variable Geist and italic Source Serif 4 files plus IBM Plex Sans 400/500/600 and IBM Plex Mono 400/500. Fontsource does not reproduce `next/font`'s generated fallback metric overrides; fallback-font metrics remain unmeasured, while fonts-ready page-closing width matched at 854 px in both builds.
- 2026-10-31, Codex: The exact exported Next `/brands` metadata is the site default title `Emmaki — Senior copy & AI content strategy` and description `Senior B2B copywriting and AI content strategy for complex offers. The writing makes it clear; the systems make it scale.` The Astro Brands route uses these unchanged values.
- 2026-10-31, Claude: `astro/src/islands/SiteHeader.tsx` is a temporary fork of `src/components/site-header.tsx`; only Next-specific `next/link` and `usePathname` integrations were replaced. Keep the fork visible for synchronization or eventual replacement as the owner advances the no-React migration.
- 2026-10-31, Codex: Astro build must dedupe `react`, `react-dom`, `lucide-react`, and `@base-ui/react` because shared imports resolve through the repository root alias; without dedupe, a second React copy breaks Base UI context. Astro points `publicDir` at the existing root `public/`, avoiding copied assets.

## Outcomes & Retrospective

M1, M2, and M3 acceptance is complete at the bounded scope in this plan. Astro check/build pass, both live sites loaded in Firefox, and the final screenshots show matching page structure and layout at wide/mobile and dark/light. The requested interaction checks match, including the stored theme being active at first contentful paint. No material visual difference was found beyond the intentionally dynamic footer wordmark and clock. Static `/brands` JavaScript is 54.8% smaller raw and 51.2% smaller with per-file gzip than the existing Next export, including inline executable scripts.

Evidence is in `runtime/astro-migration/`: four Astro and four Next screenshots; `browser-findings.json` / `.log`; `m1-check-final.log`, `m1-build-final.log`, and `next-invariant-final.log`. The Astro dev server at 3004 was left running as requested; Next at 3003 was only read. The Next source/config/root lockfile invariant diff is empty. No source parity bug needed correction during acceptance.

The owner can now compare the two live `/brands` routes. Open decisions for a later stage: when to replace/synchronize the temporary SiteHeader fork, when to remove the remaining React/Base UI islands, and whether to pursue `next/font` fallback metric overrides (not reproduced by Fontsource). The fonts-ready page-closing geometry matches exactly, but fallback-font metrics were not separately measured. This acceptance does not cover other routes, production serving/CDN transfer behavior, or the eventual no-React target.

Earlier deviation remains: one plain-workspace install and two plain-workspace check/build attempts began materializing the root dependency graph and were interrupted. Ignored root `node_modules` state may have changed; it was not reset. No tracked Next files or root lockfile changed. The earlier false check result and incomplete runtime status are superseded by the final check/build/browser evidence. Session journal and handoff files are outside the explicit write boundary for this task and were not written.

## Context and Orientation

Where it runs: repository `goemmaki/emmaki.github.io`, worktree `/home/emma/worktrees/fiverr-portfolio/astro-migration-20261031`, branch `design/astro-migration-20261031`. If the worktree is missing:

    git -C /home/emma/fiverr-portfolio worktree add ~/worktrees/fiverr-portfolio/astro-migration-20261031 design/astro-migration-20261031

Resume routine, before any new work:

    cd /home/emma/worktrees/fiverr-portfolio/astro-migration-20261031
    git status --short && git log --oneline -3
    # read Progress above, then run the latest completed milestone's checks again

Orientation (read these before editing):

- `AGENTS.md`: owner rules (American English; settled motion decisions; gsap stays installed). Its auto-generated Next.js block applies to the Next app only.
- `docs/design-system/DESIGN.md` ("Motion") and `docs/design-system/ARCHITECTURE.md`.
- `src/app/layout.tsx`: root layout: four `next/font/google` families bound to `--nf-*` CSS variables, the pre-paint theme script, skip link, `SiteHeader`, `main#content`, `SiteFooter`, `BottomBlur`.
- `src/app/globals.css`: Tailwind v4 entry; imports `tw-animate-css`, `shadcn/tailwind.css` and the canonical tokens in `docs/design-system/`. Lines ~79–83 bind the `--nf-*` font variables to `--font-display`, `--font-body`, `--font-mono`.
- `src/app/brands/page.tsx`: `PageCover`, `BrandWall` (static), `PageClosing`, data from `src/lib/content.ts` (`BRANDS`).
- Shell components: `src/components/site-header.tsx` (Base UI dialog, `usePathname`, theme toggle), `site-footer.tsx` and its children (`footer-wordmark.tsx`, `local-clock.tsx`, `copyright-years.tsx`, `back-to-top.tsx` which uses `tooltip-link.tsx`), `bottom-blur.tsx`, `page-closing.tsx`, `page-cover.tsx`, `theme-toggle.tsx`.

Terms: an *island* is a framework component Astro hydrates in the browser (`client:load`, `client:visible`, etc.); everything else Astro renders to static HTML with no JavaScript. Separate islands are separate React roots and cannot share React context. Island props must be serializable (no functions, no React elements).

## Invariants

- The Next app is untouched: no edits under `src/`, `public/`, `docs/design-system/`, or to the root `package.json`, `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `eslint.config.mjs`. Check: `git diff --stat e504a4bd -- . ':!astro' ':!docs/exec-plans'` prints nothing. Root `pnpm-lock.yaml` and `pnpm-workspace.yaml` may change only if Astro cannot be installed without it; record the reason in the Decision Log, and the Next app must still build afterwards.
- One authority per rule: shared data (`src/lib/content.ts`), design tokens (`docs/design-system/*.css`) and, where it works, `src/app/globals.css` are imported from their current location, not copied. If a file must be copied or forked (for example because of Next-only font variable names), record which and why in the Decision Log.
- Visual design and motion are unchanged. Reduced motion is still honored exactly as now. Do not "improve" anything while porting; record suspected bugs in Surprises instead.
- Site copy is unchanged, character for character (curly quotes included).

## Plan of Work

### M1: Astro scaffold

Create `astro/` with Astro (current stable), `@astrojs/react`, `@tailwindcss/vite`, TypeScript strict, static output, dev and preview on port 3004. Configure the `@/` import alias to resolve to the repository's `src/` so shared modules and React islands import unchanged. Add `astro/README.md` with the commands, and `astro/.gitignore` for `node_modules/`, `dist/` and `.astro/` (the root `.gitignore` anchors these to the root, so it does not cover `astro/`). Use pnpm (`packageManager` is pnpm 12). Prefer installing `astro/` as its own package without touching the root workspace; if pnpm forces workspace membership, record the choice.

Proof: `run-check -- pnpm --dir astro --ignore-workspace run build` exits 0 and emits Astro static pages; `run-check -- pnpm --dir astro --ignore-workspace run check` reports 0 errors; the invariant diff check is empty.

### M2: Shared shell

`astro/src/layouts/Base.astro` reproduces `src/app/layout.tsx`: `<html lang="en-US" data-theme="dark">`, the `darkreader-lock` meta, the identical pre-paint theme script, title/description metadata and title template (`%s — Emmaki`), skip link, header, `main#content`, footer, bottom blur.

- Fonts: self-host the same families, weights, styles and subsets as `next/font/google` (Geist; IBM Plex Sans; IBM Plex Mono 400/500; Source Serif 4 italic 300), and expose them under the same `--nf-*` variable names so `globals.css` works unchanged. Use Astro's font support or Fontsource; match fallback metrics as closely as the chosen tool allows and note the result.
- Global CSS: import `../src/app/globals.css` into the layout. Make sure Tailwind scans both `astro/src/**` and the repository `src/**` for class names (`@source`, in an Astro-only CSS entry that imports globals.css, if needed).
- Header: `SiteHeader` as a React island (`client:load`), with the current path passed as a prop to replace `usePathname`. Adapt it via a thin Astro-side wrapper or prop, not by editing `src/components/site-header.tsx`; if the component cannot work without an edit, copy it to `astro/src/islands/` and record it.
- Footer: static markup in `.astro`; `footer-wordmark`, `local-clock`, `copyright-years` ported to vanilla TypeScript `<script>`s; `back-to-top` stays a React island because of `TooltipLink` (Base UI).
- `bottom-blur` ported to vanilla.
- `next/link` → `<a href>`.

Proof: a stub page using `Base.astro` builds and serves on 3004; in Playwright Firefox, header, menu dialog (open, focus, Escape, close), theme toggle (both themes, persistence across reload, selected theme applied before first contentful paint), footer clock, wordmark and back-to-top behave as on the Next site at 3003.

### M3: Brands

`astro/src/pages/brands.astro` with `PageCover`, `BrandWall` and `PageClosing` as `.astro` components (`PageClosing`'s measured alignment ported to vanilla). Data from `src/lib/content.ts`. Page title and description as in Next (check the exported HTML of the Next page for the exact values).

Proof, against the Next page on `http://localhost:3003/brands`:

- Playwright Firefox screenshots of both at 1440×900 and 390×844, dark and light, full page, saved to `runtime/astro-migration/` (ignored). Dev-only browser overlays are excluded from the captures; page differences are reported, not hidden; only font rasterization noise is acceptable.
- Hover color on brand names, sticky note on wide screens, page-closing alignment after fonts load, reduced-motion behavior.
- Count and size of JS loaded on `/brands` in both builds (`astro/dist/brands/index.html` vs `../a11y-20261028/out/brands.html`), recorded in Artifacts.
- `run-check -- pnpm --dir astro --ignore-workspace run check` and `run-check -- pnpm --dir astro --ignore-workspace run build` pass; the invariant diff check is empty.

Then stop. Fill in `Outcomes & Retrospective`, including what the owner should look at and any open decisions.

## Validation and Acceptance

Run every check as `run-check -- <command>` and judge its final `run-check: PASS|FAIL` line. Never claim a check that did not run.

The Codex sandbox may block binding ports (`EPERM`), which stops dev servers and some builds, and Chromium cannot navigate there; Playwright Firefox works. If a server or build cannot run in the sandbox, record the exact error in Surprises, continue with everything else, and list the checks that still need to run outside the sandbox. Do not stop to ask about this.

## Idempotence and Recovery

All work is in `astro/`, this plan and the ignored `runtime/`. Redo a milestone by restoring `astro/` (`git checkout -- astro` or delete untracked files under it). Nothing is pushed, merged or deployed.

## Artifacts and Notes

- `runtime/astro-migration/m1-check-final.log`: `run-check: PASS (exit 0)`, 0 errors, warnings, or hints.
- `runtime/astro-migration/m1-build-final.log`: `run-check: PASS (exit 0)`, two static routes emitted.
- `runtime/astro-migration/next-invariant-final.log`: `run-check: PASS (exit 0)`, Next-owned tracked files/config/root lockfile unchanged from `e504a4bd`.
- Final Firefox screenshots: `astro-wide-{dark,light}.png`, `astro-mobile-{dark,light}.png`, `next-wide-{dark,light}.png`, `next-mobile-{dark,light}.png`.
- `runtime/astro-migration/browser-findings.json` and `.log`: final browser observations for interactions, theme-at-first-contentful-paint, layout, and errors.
- `runtime/astro-migration/browser-check-final.log`: final Firefox acceptance run through `run-check`, `PASS (exit 0)`.
- Static `/brands` JavaScript: Astro 5 external files / 355,509 raw bytes / 122,732 gzip bytes; Next 12 / 785,529 raw / 253,731 gzip. Inline executable scripts: Astro 7,183 raw; Next 16,888 raw. The gzip estimate sums each file/block separately and is not an observed page transfer size.
- `runtime/astro-migration/m1-check-isolated.log` and `m1-build-isolated.log`: earlier Node-gate failures, superseded by final checks.
- `runtime/astro-migration/typescript-final.log`: `run-check: PASS (exit 0)`, final standalone TypeScript compiler.
- `runtime/astro-migration/next-invariant.log`: `run-check: PASS (exit 0)`, tracked Next paths/config/lockfile invariant diff is empty.
- `runtime/astro-migration/m1-check.log` and `m1-build.log`: interrupted root-workspace attempts; neither completed with a run-check result.

## Interfaces and Dependencies

- New dependencies only in `astro/package.json`. `sharp` builds are disabled in the root `pnpm-workspace.yaml` (`allowBuilds: sharp: false`); the Brands page has no raster images, so do not change this in this stage. Record whether Astro needs it later for images.
- No commits. The owner (or Claude) commits after review.
