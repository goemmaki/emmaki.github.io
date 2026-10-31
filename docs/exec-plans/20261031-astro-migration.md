# Migrate the emmaki site to Astro: every Next route at parity

This ExecPlan is a living document. Keep `Progress`, `Surprises & Discoveries`, `Decision Log` and `Outcomes & Retrospective` current as work proceeds.

## Purpose / Big Picture

The site is a Next.js 16 / React 19 / Tailwind v4 static export. The owner has decided to move it to Astro so that mostly static pages stop shipping the React and Next runtime (about 207 KB gzipped of shared script on every page in the 2026-10-29 build), and so that case studies and posts can use Content Collections, MDX and build-time AVIF/WebP images later.

The long-term target is Astro with no React. The route there is staged:

1. Astro renders all static markup.
2. Components whose behavior is plain DOM or canvas code inside React effects are ported to vanilla TypeScript in `.astro` components as they are migrated.
3. Components built on Base UI widgets (`site-header.tsx` dialog, `faq.tsx` accordion, `tooltip-link.tsx`, `page-tools.tsx` menus), and anything that contains one, stay React islands for now. Replacing them is a later stage the owner will decide on.

**Stage 1 (M1–M3, done and owner-approved 2026-10-31, commit `1b7f7980`) ended when the Brands page (`/brands`) renders in Astro inside the full site shell (header, footer, bottom blur, page closing, theme) and looks and behaves the same as the Next version, and the Next version still works unchanged.** Then work stops so the owner can compare the two live: Next on port 3003 (the a11y worktree, already running) and Astro on port 3004.

**Stage 2 (M4) ends when the placeholder article (`/blog/placeholder-post`) renders in Astro and looks and behaves the same as the Next version** (`http://localhost:3003/blog/placeholder-post`). Then work stops again for owner review.

**Stage 3 (M5–M7) ends when every route the Next export has (`/`, `/about`, `/blog`, `/blog/placeholder-post`, `/brands`, `/proof`, `/proof/placeholder`, the 404 page, `favicon.ico`, and the root `public/` files) renders in Astro at parity with Next, and the cover pixelation regression from M4 is fixed.** Then work stops for owner review of the whole site.

Out of scope for stages 1–2: every other route, MDX and Content Collections, image pipeline, video, removing React islands, deleting the Next app, deployment changes.

## Progress

- [x] (2026-10-31, Claude) Branch `design/astro-migration-20261031` and worktree `~/worktrees/fiverr-portfolio/astro-migration-20261031` created from `design/a11y-20261028` at `e504a4bd`.
- [x] (2026-10-31, Claude) This plan written.
- [x] M1 (2026-10-31): Node is `22.23.4`; isolated Astro check reports 0 errors/warnings/hints, build emits `/brands` and `/`, both local sites respond, and the Next invariant diff is empty.
- [x] M2 (2026-10-31): Playwright Firefox acceptance completed against Astro `:3004` and Next `:3003`: menu focus/Escape, both theme toggles and reload persistence, clock/footer/back-to-top, and reduced motion match. No page or console errors.
- [x] M3 (2026-10-31): Brands screenshots captured at both requested viewport sizes and themes. Brand hover color, sticky note, fonts-ready page-closing width, and footer interactions match. Static route JS was counted in both builds. No parity fix was needed; stop here for owner comparison.
- [x] (2026-10-31, Owner) Stage 1 reviewed live and approved; committed as `1b7f7980`.
- [x] M4 (2026-10-31): `/blog/placeholder-post` is statically emitted and matches the Next article in Firefox at both viewport sizes and themes, including content, geometry, TOC, FAQ keyboard open/close, menus, copied Markdown, touch spotlight, reduced motion, and sticky-frame geometry. Check/build, browser acceptance, payload and invariant checks pass. Differences and limits are recorded below; stop for owner review.
- [x] (2026-10-31, Owner) M4 reviewed live: spotlight, FAQ find-in-page and TOC good; two cover issues, see Surprises. Committed as checkpoint `b503ce00`.
- [x] M5 (2026-10-31): pixelation scheduling race fixed in Astro; Firefox scroll-timeline comparison and find-then-scroll classified. Chrome owner verification remains open.
- [x] M6 (2026-10-31): Home (`/`) reproduced and compared at wide/mobile, dark/light; browser interactions, check/build, invariant diff, and payload evidence recorded. Stop before M7.
- [x] M7 (2026-10-31): About, Proof, Proof placeholder, Blog index, 404 and favicon implemented and compared in Firefox; all Next HTML routes and public assets have Astro output counterparts. Final check/build, route captures, payload and invariant evidence are recorded below. Residuals and the additional React islands are listed in Outcomes; stop for owner review.

- [x] (2026-10-31, Owner) Approved: fix the logo hover flash and the four startup changes found in `runtime/flash/report.md`; build the parity tool and `astro/CONVENTIONS.md`. The microscopic refresh text flash stays unresolved (owner's Chrome layer-borders/paint-flashing test found no culprit).
- [x] (2026-10-31, Codex) First version of `astro/scripts/parity.mjs` and `astro/CONVENTIONS.md` written; parity not yet calibrated (Firefox 3/32 pass, Chromium 0/32, partly Astro dev 504s, since cleared by a dev-server restart).
- [ ] M8a: parity tool calibrated: pages already accepted as matching pass; real differences still fail.
- [ ] M8b: dark-mode logo hover crossfade without the gray dip, on every page that shows client logos.
- [ ] M8c: clock, case-frame grain, case-frame attribution width and bottom blur correct from first paint.
- [ ] M8d: verified in Chromium and Firefox, both themes, both sizes; stop for owner review.

## Surprises & Discoveries

- 2026-10-31: Node is now `22.23.4`, removing Astro 7.4.4's Node gate. Claude fixed the build by adding `@base-ui/react@1.8.0`, `lucide-react@1.48.0`, and dev dependency `@astrojs/check@0.9.12`; deduping React, React DOM, lucide-react, and Base UI; and setting Astro `publicDir` to the repository root `public/`. Duplicate React resolution had caused a `useContext`-of-null build crash. The correct `astro check` invocation now reports zero diagnostics; the earlier apparent pass was an interactive install prompt, not a check.
- 2026-10-31: This repository's root pnpm workspace boundary caused plain `pnpm -C astro ...` invocations to resolve/install the root dependency graph. Those attempts were interrupted (exit 130) and were replaced with `pnpm --dir astro --ignore-workspace ...`; this generated `astro/pnpm-lock.yaml` and left the tracked root lockfile unchanged. The interrupted root installation did write ignored root `node_modules` state; its before-state is unknown, so it was not cleaned or reset. pnpm also created an untracked root `.pnpm-store/` directory during this session; it was removed after the final pnpm invocation. The Next reference remained reachable at `http://localhost:3003/brands` (HTTP 200).
- 2026-10-31: Playwright Firefox ran from the local cached Firefox runtime. Final screenshots were taken after fonts and entrance effects settled, with dev-only Astro/Next diagnostic overlays hidden in the capture. An initial capture before effects settled was misleading; final screenshots show the complete content and are the evidence of record.
- 2026-10-31: The initial browser harness also forced a dark-theme init script on every reload, invalidating its first persistence observation; it was removed from the interaction context. A 250 ms hover sample could catch the color transition mid-flight, so final hover checks wait 500 ms. The final run reports equal hover colors and both theme states persisted after reload.
- 2026-10-31: Both builds match on metadata, brand hover color (`rgb(91, 77, 252)` in both themes), sticky positioning, and page-closing width (854 px measured, stored, and used by the row). Theme changes persisted both directions across reloads. With stored light theme, Firefox observed light at first contentful paint in both builds (Astro 71 ms, Next 143 ms). Menu focus and Escape close worked; reduced-motion hid the splash and reduced panel animation to `0.00001s`; footer pointer lighting cleared on leave; back-to-top returned scroll to 0; no console, page, or request errors occurred.
- 2026-10-31: Remaining observed differences are expected per-visit values: footer wordmark selects `try`, `fly`, or `buy` randomly, and the live clock advances by minute. Neither is a parity defect. No source parity bug was found, so no code fix was needed under `astro/` during acceptance.
- 2026-10-31: Static route payload counts use Astro `dist/brands/index.html` and Next reference export `../a11y-20261028/out/brands.html`, not dev-server HMR requests. Astro loads 5 external bundled JS files (355,509 raw bytes; 122,732 bytes gzip summed per file), Next loads 12 (785,529 raw; 253,731 gzip). Inline executable scripts add Astro 5 / 7,183 raw bytes and Next 3 / 16,888 raw bytes. Combined code totals are 362,692 raw for Astro and 802,417 raw for Next: a 54.8% raw reduction. The gzip sums are 126,006 and 257,974 bytes respectively (51.2% lower), compressing each external file and inline block separately; inline scripts are part of the HTML response, so this gzip figure is not an observed page transfer size.

- 2026-10-31, Owner review of M4: (1) **In Chrome, the cover pixelation does not work at any screen size in dark mode on Astro** (it does on Next at 3003). Firefox could not exercise it, so M4's Firefox acceptance missed it. (2) In Firefox, after Ctrl+F revealed an FAQ answer and the owner scrolled back to the top, the cover pixelation showed and stayed stuck. Not yet known whether Next does the same.
- 2026-10-31, M5: Astro's pixelation and spotlight listeners shared one RAF id (`queued`). Spotlight `place()` canceled that id while the pixelation draw was pending, so scroll/spotlight event interleaving could suppress the draw. `PostCover.astro` now gives mosaic drawing and spotlight placement independent RAF ids. This is a supported root cause for the Astro-only Chrome report; Chrome is outside sandbox reach, so the owner must verify it visually. With Firefox's `layout.css.scroll-driven-animations.enabled` enabled, baseline Astro hid its canvas at y=400/900 while Next showed it; after the fix Astro and Next matched at y=270 (hidden), y=400/765/900/1400 (shown), each with a 144×104 canvas and `cover-power-fail` animation. Samples must wait for the scroll-timeline/RAF state to settle.
- 2026-10-31, M5 find-then-scroll: Firefox `window.find` revealed the first FAQ on both sites (`aria-expanded=true`). After an explicit settled scroll to y=0, both canvases were hidden. The owner's stuck state was not reproduced deterministically and was not unique to Astro in this probe; no additional fix was made. Pixelated appearance remains a Chrome visual check.
- 2026-10-31, M6: Final Firefox Home screenshots and interaction probes match across the requested wide/mobile viewports and dark/light themes. Final document heights and Home section geometries match at wide (3363 px) and mobile (3707 px). Logo rotation changes a logo source in both sites and holds on hover; statement preview opens in both; both halftone canvases draw; reduced motion prevents logo rotation. The first screenshot pass missed offscreen content because Firefox had not painted it; final capture scrolls through the page before capture and does not disable animations. Final captures are in `runtime/astro-migration/m6/`.
- 2026-10-31, M6 source scope: the plan listed the `testimonials` carousel, but `src/app/page.tsx` does not mount that component. Home renders a static quote in the seventh proof box; Astro matches that rendered source. Dynamic footer wordmark and live clock remain expected per-visit differences. The latest diagnostic reports equal section geometry; an earlier 6 px mobile sample was transient capture timing.
- 2026-10-31, M6 dev-only difference: Astro's dev-toolbar entrypoint request fails in Firefox (`NS_ERROR_CORRUPTED_CONTENT`, empty MIME type) and emits a console/request error; Next has no equivalent. The Home content and interactions still worked, and dev-only overlays were hidden only in final screenshots. Halftone alpha-pixel counts (Astro 4574, Next 4490) vary with sample timing/pointer position; both rendered.
- 2026-10-31, M7: Shared `Breadcrumb` imports `next/link` and crashes in Astro SSR, so the case placeholder renders equivalent local anchor/chevron markup. `/about` and `/proof` have no page metadata in Next and use the site default title; Astro follows that. The proof placeholder and 404 use the Next title template, not absolute titles. About's quote carousel advanced to a different placeholder quote between the separate browser visits; both use the same source component and this is timer-driven.
- 2026-10-31, M7: Next's `/favicon.ico` is derived from `src/app/favicon.ico`, which is outside the shared `publicDir`. Astro adds a static endpoint that reads that one source file at build time, yielding the same 25,931-byte icon without a copied binary.
- 2026-10-31, M7: Geist Pixel needs its `ELSH` axis at value 20; `@fontsource-variable/geist-pixel/elsh.css` self-hosts that face. Both builds emit/use local font assets.
- 2026-10-31, M7: Headings matched for all five visual routes at wide/mobile and dark/light. About's quote carousel showed different timed quotes in two independent browser visits, causing the only main-text mismatch; all other route/theme main text matched. Settled Blog mobile measurements matched. Final full-page captures recorded a 6 px total-document-height difference on About mobile/dark (+6 Astro) and mobile/light (-6 Astro), Proof mobile/light (+6 Astro), and Proof placeholder mobile/dark (-6 Astro); main boxes matched, and no content/layout defect was isolated. Keep these small footer/document-height deltas open for owner review. `astro-island` wrappers and asset class names differ structurally from Next; they do not change the measured main boxes.
- 2026-10-31, M7: Blog tagline visibility varied between captures (Astro/Next alternated which screenshot showed it), although the element and its measured box exist in both DOMs. Treat this as an unresolved capture-timing/overlay question, not a confirmed source-copy difference; review the final Blog screenshot pair if it is visually material.
- 2026-10-31, M7: Firefox again reports the known Astro dev-toolbar request failure (`NS_ERROR_CORRUPTED_CONTENT` with an empty MIME type) and console error on each Astro route. Next has no equivalent. Page-level errors were absent; this is dev-only and not part of the static build.
- 2026-10-31: Added `astro/scripts/parity.mjs` and `astro/CONVENTIONS.md`; README and this orientation link to the conventions. Full Firefox parity capture covered all eight HTML routes (including a not-found request), both themes and both sizes: 3/32 rows passed. Full Chromium capture also loaded, but 0/32 passed; its log records Astro dev-server 504 `Outdated Optimize Dep` errors, so Chromium pixel results are contaminated by dev-server asset failures. Firefox's remaining mismatches include pixels beyond the documented volatile masks and proof-placeholder mobile geometry; the six-pixel height and Blog tagline exceptions are reported separately. Reports are `runtime/parity/2026-10-31-final-firefox/summary.md` and `runtime/parity/2026-10-31-final-chromium/summary.md`. Do not treat these runs as full parity acceptance. A Chromium `FRAMES=1` smoke capture recorded and acknowledged three frames per site and wrote the changed-pixel timeline under `runtime/parity/frames-smoke/`; CDP frame capture is Chromium-only and viewport-sized.

## Decision Log

- 2026-10-31, Claude: Astro lives in a separate `astro/` directory with its own `package.json`, so the Next app at the repository root keeps working and both can run side by side during the migration. Astro dev and preview use port 3004 (3000–3003 are taken by other dev servers).
- 2026-10-31, Claude: Base UI widgets stay React islands in this stage; non-Base-UI interactive components on the Brands page are ported to vanilla TypeScript now rather than wrapped as islands and ported twice. If a port cannot match current behavior, keep that component as a React island and record why here.
- 2026-10-31, Codex: Astro is installed as its own package using `pnpm --dir astro --ignore-workspace install`, because invoking pnpm from `astro/` without `--ignore-workspace` selected the root workspace and began installing the Next dependency graph. README commands use this isolated form. Dependencies are pinned to the versions resolved by the isolated install.
- 2026-10-31, Codex: Fontsource files provide Latin subsets for the same families and requested weights/styles; Astro uses the variable Geist and italic Source Serif 4 files plus IBM Plex Sans 400/500/600 and IBM Plex Mono 400/500. Fontsource does not reproduce `next/font`'s generated fallback metric overrides; fallback-font metrics remain unmeasured, while fonts-ready page-closing width matched at 854 px in both builds.
- 2026-10-31, Codex: The exact exported Next `/brands` metadata is the site default title `Emmaki — Senior copy & AI content strategy` and description `Senior B2B copywriting and AI content strategy for complex offers. The writing makes it clear; the systems make it scale.` The Astro Brands route uses these unchanged values.
- 2026-10-31, Claude: `astro/src/islands/SiteHeader.tsx` is a temporary fork of `src/components/site-header.tsx`; only Next-specific `next/link` and `usePathname` integrations were replaced. Keep the fork visible for synchronization or eventual replacement as the owner advances the no-React migration.
- 2026-10-31, Codex: Astro build must dedupe `react`, `react-dom`, `lucide-react`, and `@base-ui/react` because shared imports resolve through the repository root alias; without dedupe, a second React copy breaks Base UI context. Astro points `publicDir` at the existing root `public/`, avoiding copied assets.
- 2026-10-31, Codex: For M7, About's query-driven concept chooser, Proof's animated grain list, the case-frame grain, blog ASCII image and 404 nebula remain React islands sourced from existing components (ProofIndex is an Astro-local fork replacing only `next/link`). The case page's AI badges also remain an island because their links use the page's client URL. These extra islands preserve behavior in this route milestone but defer the no-React migration beyond the Base UI islands originally intended; see M7 outcome.
- 2026-10-31, Codex: Astro serves `/favicon.ico` from a static endpoint that reads the existing Next app icon at build time; there is one binary authority and no icon copy in `astro/`.
- 2026-10-31, Claude: `<main id="content" tabindex="-1">` stays, although Astro's dev-toolbar audit flags it. It is the focus target for the skip link and back-to-top (same as the Next layout); `-1` is the audit's own recommended form, and the toolbar is dev-only. Owner confirmed keyboard behavior works.
- 2026-10-31, Claude: While the Next app still exists, shared content stays in `src/lib/` (`content.ts`, `posts.ts`, `post-format.ts`) and Astro imports it. Moving posts to Content Collections/MDX is a later stage, after Next is retired, so there is never a second authority for a post.
- 2026-10-31, Codex: Firefox reports `CSS.supports('animation-timeline: scroll()') === false` on both live sites, so both intentionally show the non-pixelated cover fallback in this browser. Sticky photo-frame geometry matched at scroll positions 0, 200, 405, 600, 899, and 1200 px. Pixelation cannot be visually compared in Firefox.
- 2026-10-31, Codex: Spotlight exit did not match in the Playwright Firefox probe: Astro cleared `cover-lit`/`data-cover-torch`, while Next retained `cover-lit` after the pointer left. The copied handler follows the same pointer bounds and event approach; left as an owner-review difference pending confirmation with a real pointer/device.
- 2026-10-31, Codex: Both live pages render FAQ answers with Base UI `hidden="until-found"`; keyboard Enter opens/closes them on both. Firefox's scripted `window.find`/Playwright find probe did not reliably exercise browser find-in-page or expose an opened panel, so native find-in-page behavior remains unverified.
- 2026-10-31, Codex: Astro's dev toolbar client request fails in Firefox (`NS_ERROR_CORRUPTED_CONTENT`, empty MIME type) and logs a console error; Next has no such error. This is dev-only toolbar code; production Astro check/build pass and article interactions work. Do not interpret it as an article parity failure.
- 2026-10-31, Codex: `PostCover.astro` keeps separate `mosaicFrame` and `spotlightFrame` ids because those independent RAF tasks must not cancel each other. No change was made for Firefox find-then-scroll because the settled top-of-page result matched Next and the reported stuck state did not reproduce.
- 2026-10-31, Codex: Home uses static Astro markup and vanilla scripts for client logo rotation, statement pointer preview, and the Why Me halftone effect; it reuses `PageClosing.astro` and shared content data. The source Home does not mount the testimonial carousel, so the existing static quote is the parity target. No design/content changes were inferred from placeholders.

## Outcomes & Retrospective

M1, M2, and M3 acceptance is complete at the bounded scope in this plan. Astro check/build pass, both live sites loaded in Firefox, and the final screenshots show matching page structure and layout at wide/mobile and dark/light. The requested interaction checks match, including the stored theme being active at first contentful paint. No material visual difference was found beyond the intentionally dynamic footer wordmark and clock. Static `/brands` JavaScript is 54.8% smaller raw and 51.2% smaller with per-file gzip than the existing Next export, including inline executable scripts.

Evidence is in `runtime/astro-migration/`: four Astro and four Next screenshots; `browser-findings.json` / `.log`; `m1-check-final.log`, `m1-build-final.log`, and `next-invariant-final.log`. The Astro dev server at 3004 was left running as requested; Next at 3003 was only read. The Next source/config/root lockfile invariant diff is empty. No source parity bug needed correction during acceptance.

The owner can now compare the two live `/brands` routes. Open decisions for a later stage: when to replace/synchronize the temporary SiteHeader fork, when to remove the remaining React/Base UI islands, and whether to pursue `next/font` fallback metric overrides (not reproduced by Fontsource). The fonts-ready page-closing geometry matches exactly, but fallback-font metrics were not separately measured. This acceptance does not cover other routes, production serving/CDN transfer behavior, or the eventual no-React target.

M5: Firefox baseline and fixed probes are in `runtime/astro-migration/m5/before.mjs`, `after.mjs`, and `after.json`; the baseline and fixed Playwright runs are logged at `runtime/checks/20261031T200543Z-2-node.log` and `runtime/checks/20261031T200654Z-2-node.log`. The owner must verify in Chrome with dark theme at a representative width: scroll through the cover's pixelation range (about 30–85% progress; around y=400–765 at 1440×900), confirm blocks grow as scrolling down and reverse while scrolling up, and repeat at another width. Firefox verifies canvas state/dimensions but not the visual pixelation.

M6: Final screenshots, acceptance findings, style diagnostics, and JS payload data are in `runtime/astro-migration/m6/`. `run-check -- pnpm --dir astro --ignore-workspace run check` passed (0 errors/warnings/hints; `runtime/checks/20261031T201131Z-2-pnpm.log`); build passed (`runtime/checks/20261031T201142Z-2-pnpm.log`); browser acceptance passed (`runtime/checks/20261031T195937Z-2-node.log`); final screenshot capture passed (`runtime/checks/20261031T201013Z-2-node.log`); additional non-leading logo rotation/hover check passed (`runtime/checks/20261031T200842Z-2-node.log`); payload count passed (`runtime/checks/20261031T201152Z-2-node.log`); Next invariant diff passed empty (`runtime/checks/20261031T201201Z-2-git.log`); and `git diff --check` passed. M6 JS estimate: Astro 11 external assets 362,255 raw / 127,589 gzip-summed plus 8 inline scripts 9,810 raw / 4,714 gzip-summed, total 372,065 raw / 132,303 gzip-summed. Next 12 external assets 792,160 raw / 256,115 gzip-summed plus 3 inline scripts 34,988 raw / 6,273 gzip-summed, total 827,148 raw / 262,388 gzip-summed. Combined estimate is 55.0% lower raw and 49.6% lower by per-file gzip sum for Astro; gzip is a sum of independently compressed assets/inline blocks, not observed transfer size.

Earlier deviation remains: one plain-workspace install and two plain-workspace check/build attempts began materializing the root dependency graph and were interrupted. Ignored root `node_modules` state may have changed; it was not reset. No tracked Next files or root lockfile changed. The earlier false check result and incomplete runtime status are superseded by the final check/build/browser evidence. The repository's session rule calls for a journal entry and handoff, but both paths fall outside the explicit write boundary for this task, so neither was written.

M7 (2026-10-31): Added `/about`, `/proof`, `/proof/placeholder`, `/blog`, `/404.html`, and `/favicon.ico` under `astro/`. Shared public files remain read from `public/`; no `src/`, `public/`, or root config files changed. The five page routes returned the same status, title, headings and main content text as Next in Firefox; the 404 returned 404 on both servers. Main content geometry matched. Proof hover activated; About's selector updated `?v=split`; the case page rendered its frame and five AI badges; blog ASCII canvas and 404 nebula canvases rendered; the 404 home link worked. The six pixel total-height deltas and the timer-selected About quote are recorded in Surprises and remain owner-review items. Astro's dev toolbar generated its known Firefox request/console error; there were no page errors. The final screenshot set is in `runtime/astro-migration/m7/`.

The static coverage audit found counterparts for all eight exported HTML routes (including `404.html`), `/favicon.ico`, and all 35 files under `public/`. Route coverage: `/`, `/about`, `/blog`, `/blog/placeholder-post`, `/brands`, `/proof`, `/proof/placeholder`, `/404`, `/favicon.ico`; the 35 shared assets are enumerated in `runtime/astro-migration/m7/payload.json`. The favicon output is byte-for-byte the source icon (25,931 bytes). Per-route script and inline-script raw/gzip sums are in the same JSON and summarized in the M7 report; Astro remains substantially smaller than Next on every HTML route.

M7's source intentionally retains these client-rendered React islands: `SiteHeader` (all pages), `BackToTop` (all pages), `AboutConcepts` (`/about`, including its embedded FAQ and quote carousel), `ProofIndex` (`/proof`), `CaseFrame` and `AiBadges` (`/proof/placeholder`), `AsciiImage` (`/blog`), `NebulaField` (404), plus the pre-existing `PostTools` and `Faq` (`/blog/placeholder-post`). This is broader than the Base UI-only island target; canvas and query-driven behavior were retained in existing React components to preserve behavior within M7. Unmounted experiments `hero.tsx`, `rect-fit.tsx`, `ui/sparkles-text.tsx`, `darlings/*`, and `motion-provider.tsx` remain in Next as directed. Follow-up choices: review the six-pixel page-height deltas; decide when to port the listed non-Base-UI islands; verify M5 pixelation in Chrome; and revisit the earlier article spotlight exit/native find-in-page questions. About's selected quote can differ per visit while its continuous carousel runs.

Checks for M7: `run-check -- pnpm --dir astro --ignore-workspace run check` passed with 0 errors/warnings/hints (`runtime/checks/20261031T202524Z-3-pnpm.log`); build passed (`runtime/checks/20261031T202531Z-99-pnpm.log`); final Firefox acceptance passed (`runtime/checks/20261031T202914Z-2-node.log`); static route/payload audit passed (`runtime/checks/20261031T202712Z-2-node.log`); the additional Blog diagnostic passed (`runtime/checks/20261031T202817Z-2-node.log`); Next-owned source/config/root-lock invariant diff passed empty (`runtime/checks/20261031T203121Z-3-bash.log`); `git diff --check` passed (`runtime/checks/20261031T203121Z-12-git.log`); favicon byte comparison passed (`runtime/checks/20261031T203121Z-2-cmp.log`). Earlier failed/interrupted attempts are retained in `runtime/checks/` and superseded by these final passes. No commit was made. This task's explicit write limit excluded `docs/journal/` and `docs/handoffs/`, so the repository-mandated journal entry and handoff were not written. The session-added ignored root `.pnpm-store/` artifact was removed; final `git status` contains only the allowed Astro and ExecPlan changes.

Parity-tool checks for 2026-10-31: `run-check -- node --check astro/scripts/parity.mjs` passed (`runtime/checks/20261031T214926Z-3-node.log`); `run-check -- git diff --check` passed (`runtime/checks/20261031T214926Z-18-git.log`). Full Firefox parity exited 1 after 3/32 rows passed (`runtime/checks/20261031T213853Z-2-env.log`); full Chromium parity exited 1 after 0/32 rows passed (`runtime/checks/20261031T214352Z-2-env.log`). Chromium `FRAMES=1` smoke exercised the timeline output but the parity command exited 1 for the row's visual differences (`runtime/checks/20261031T214901Z-2-env.log`). The last focused Firefox proof-placeholder mobile capture also exited 1 on visual/geometry differences (`runtime/checks/20261031T214926Z-2-env.log`). These failures are evidence, not passing acceptance checks.

M7 JavaScript estimate (external bundle files plus inline executable scripts; gzip is summed per file/block and is not observed transfer size):

| Route | Astro files | Astro raw / gzip | Next files | Next raw / gzip |
|---|---:|---:|---:|---:|
| `/` | 11 | 372,065 / 132,303 | 12 | 827,148 / 262,388 |
| `/about` | 4 | 240,298 / 80,836 | 12 | 824,911 / 265,574 |
| `/blog` | 4 | 231,345 / 78,657 | 12 | 799,727 / 257,705 |
| `/blog/placeholder-post` | 5 | 233,035 / 79,217 | 13 | 911,640 / 291,734 |
| `/brands` | 3 | 227,970 / 77,048 | 12 | 802,417 / 257,974 |
| `/proof` | 4 | 233,214 / 79,246 | 12 | 803,559 / 258,943 |
| `/proof/placeholder` | 5 | 230,882 / 78,438 | 13 | 870,754 / 280,106 |
| `/404` | 4 | 231,257 / 78,592 | 11 | 794,850 / 255,413 |

## Context and Orientation

Where it runs: repository `goemmaki/emmaki.github.io`, worktree `/home/emma/worktrees/fiverr-portfolio/astro-migration-20261031`, branch `design/astro-migration-20261031`. If the worktree is missing:

For Astro-specific implementation and parity conventions, read [`astro/CONVENTIONS.md`](../../astro/CONVENTIONS.md).

    git -C /home/emma/fiverr-portfolio worktree add ~/worktrees/fiverr-portfolio/astro-migration-20261031 design/astro-migration-20261031

Resume routine, before any new work:

    cd /home/emma/worktrees/fiverr-portfolio/astro-migration-20261031
    git status --short && git log --oneline -3
    # read Progress above, then run the latest completed milestone's checks again

Orientation (read these before editing):

- `astro/CONVENTIONS.md`: Astro implementation and parity rules.

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

### M4: Placeholder article

`astro/src/pages/blog/[slug].astro` with `getStaticPaths()` over `posts` from `src/lib/posts.ts`, reproducing `src/app/blog/[slug]/page.tsx`: title (`absolute`, no template), heading styles, TOC targets, every section, image, TL;DR, FAQ and CTA, using `src/lib/post-format.ts` helpers unchanged.

- Static to `.astro`: `breadcrumb`, `flood-button`, `text-link`, `ui/striped-pattern` (unique pattern IDs), lucide icons as inline SVG or `lucide-react` rendered statically (no hydration).
- Ported to vanilla TypeScript: `blog/post-cover.tsx` (pixelating sticky cover, spotlight, font-fit measurement, header coordination; the hardest piece — keep its algorithm and timings exactly) and `blog/post-toc.tsx` (rail progress, 112 px offset, hash replacement, heading focus). Keep the DOM structure CSS relies on, e.g. `globals.css` `.post-cover + .post-card` (an island or wrapper element between them breaks it).
- React islands (Base UI): `faq.tsx` (accordion) and `page-tools.tsx` menus. `PostTools` passes a function prop, which islands cannot take: compute the Markdown at build time with `postMarkdown` and pass a string, through a thin wrapper in `astro/src/islands/` that rebuilds the `(url) => string` function for `PageTools` (keep the copied URL the page's real URL). Do not edit `src/`.
- Images: same files from `public/blog/` with the same rendered attributes as the Next export (sizes, loading, priority). No AVIF pipeline yet.

Proof, against `http://localhost:3003/blog/placeholder-post`:

- Playwright Firefox screenshots, 1440×900 and 390×844, dark and light, into `runtime/astro-migration/m4/`.
- Cover: pixelation, sticky behavior through scroll, spotlight on pointer and touch, header coordination. TOC: rail progress at several scroll positions, click lands headings 112 px from the top, hash updates, focus moves. FAQ: open/close, keyboard, find-in-page (`hidden="until-found"`). Page tools: each menu item, keyboard navigation, copied Markdown identical to Next's for the same URL. Reduced motion. Page interaction errors are reported; note the Astro dev-toolbar request failure in Surprises.
- JS loaded on the article in both builds (`astro/dist/blog/placeholder-post/index.html` vs `../a11y-20261028/out/blog/placeholder-post.html`).
- `astro check` and build pass; the invariant diff check is empty.

Then stop and update `Outcomes & Retrospective` for stage 2.

### M4 outcome (2026-10-31)

The page is generated at `astro/dist/blog/placeholder-post/index.html`; shared post data and formatting remain owned by `src/lib/posts.ts` and `src/lib/post-format.ts`. The Astro article has the same title and description, 18 headings, 8 article sections, image paths/alt text/dimensions/loading attributes, seven TOC links, nine accordion buttons, and adjacent cover/card DOM as Next. The wide (1440×900) and mobile (390×844) dark/light Firefox screenshots are in `runtime/astro-migration/m4/`. Computed style and geometry diagnostics found the same typography, article height, and TL;DR/section/card positions. TOC progress and click behavior match; clicking lands its heading at 112 px and updates focus/hash. FAQ keyboard open/close, all three menu item sets and ArrowDown focus, Markdown copy (4,588 characters; identical after normalizing the page origin), touch spotlight, header coordination, and reduced-motion behavior match.

Remaining differences/limits for owner review:

- In the Firefox pointer-exit probe, Astro clears the cover spotlight while Next retains its lit class. Confirm on a real pointer before deciding whether to adjust the port.
- Firefox lacks the scroll-timeline support used by the cover pixelation; both render the same static fallback, so pixelation parity was not exercised.
- The FAQ DOM has `hidden="until-found"` on both sites, but Firefox's scripted find-in-page attempt did not verify reveal behavior.
- The Astro dev-only toolbar client fails to load in Firefox with `NS_ERROR_CORRUPTED_CONTENT` and an empty MIME type; the page itself builds and its tested interactions run.
- Hex color token serialization uses uppercase hex in Astro and lowercase in Next in some computed-style diagnostics; resolved RGB values and geometry are equal.

JS payload measurements are in `runtime/astro-migration/m4/payload.json`. The article totals Astro 423,934 raw bytes / 151,891 gzip-summed bytes (12 external assets plus 6 inline scripts); Next totals 911,640 raw / 291,734 gzip-summed bytes (13 external assets plus 3 inline scripts). Gzip figures sum independent per-file/per-script compression and are not observed transfer sizes. Astro is about 53.5% smaller raw and 47.9% smaller by this gzip-sum estimate.

Owner review: compare the eight screenshots and decide whether the spotlight exit discrepancy needs a change; confirm whether native FAQ find-in-page behavior matters for this article. Pixelation should be reviewed in a scroll-timeline-capable browser later. Stage 2 stops here; no M5 work is started.

### M5: Fix the cover pixelation regression

Find why the pixelation on `/blog/placeholder-post` does not run in Chrome on Astro, dark theme, at any width, and fix it under `astro/`. Start from a structural diff, not guesses: compare `src/components/blog/post-cover.tsx` with `astro/src/components/blog/PostCover.astro` line by line (pixelation logic, start conditions, theme checks, observers, `matchMedia`, script timing — Astro `<script>`s run as deferred modules, React effects ran after hydration), and compare the rendered DOM of both pages (element order, classes, `data-*` attributes, wrappers) against the `globals.css` cover selectors (`.post-cover…`, `.post-cover + .post-card`, `[data-theme="dark"] .post-cover-shade`, `animation-timeline: scroll(root)`). Record the root cause in Surprises.

Chrome cannot navigate inside the sandbox, so the owner verifies the fix in Chrome. Try Playwright Firefox with the pref `layout.css.scroll-driven-animations.enabled` = true; if the scroll animation then runs, compare both sites at three scroll positions.

Then the Firefox issue: on both sites, reveal a closed FAQ answer with find (`window.find` or the find bar), scroll to the top, record the cover state. If Next behaves the same, it is pre-existing: record it, do not fix it. If only Astro does it, fix it.

### M6: Home

`astro/src/pages/index.astro` replaces the stub and reproduces `src/app/page.tsx` and its components (`client-slots`, `statement`, `why-me` with `why-me/halftone`, `testimonials`, `YearsSince`, `flood-button`, `page-closing`, and what they import). Same rules: static markup in `.astro`; DOM/canvas behavior ported to vanilla TypeScript with algorithms and timings unchanged; only Base UI widgets (and their containers) stay React islands. The `?v=` variant switcher lives on another branch and is out of scope.

Proof as in M3/M4: Firefox screenshots 1440×900 and 390×844, both themes, into `runtime/astro-migration/m6/`; each interaction the components implement (logo rotation and timing, testimonial fill/pause, statement pointer preview, halftone pointer response), reduced motion, no console errors; JS sizes for `/` in both builds; check, build, invariant diff.

### M7: Remaining routes

`/about`, `/proof` (`proof-index`), `/proof/placeholder` (`case-frame`, breadcrumb, sticky facts, CTA, AI badges via page tools), `/blog` index (uses Geist Pixel with the `ELSH` axis: self-host it like the other fonts), the 404 page (`not-found.tsx` with `nebula-field`, as `astro/src/pages/404.astro` emitting `404.html` for GitHub Pages), and `favicon.ico` (in `src/app/`: serve it without a second copy if Astro allows, otherwise record the copy). Do not migrate unmounted experiments (`hero.tsx`, `rect-fit`, `ui/sparkles-text`, `darlings/*`, `motion-provider`); record that they stayed in Next.

Proof per route as in M6, into `runtime/astro-migration/m7/`. Finally list every route in `../a11y-20261028/out/` and confirm each has an Astro counterpart in `astro/dist/`, with a JS-size table for all routes.

Then stop and update `Outcomes & Retrospective` for stage 3, including the full list of React islands that remain.

### M8: Parity tool calibration, logo hover and first-paint fixes

These are deliberate improvements over Next: after M8, Astro's **settled** pages must still match Next, but its first frames and logo hover intentionally differ. Evidence and the browser-only prototypes are in `runtime/flash/report.md` (`hover-additive.mjs`, the `initial-grain` and `initial-blur` capture modes).

**M8a, calibrate `astro/scripts/parity.mjs` first.** A tool that reports almost everything as different hides real regressions. Make it pass on pages already accepted as matching (Brands, the article, Home) and still fail on a deliberately injected 1 px shift or color change (prove both). Likely causes to check: continuous motion not masked or not paused (status pulse, client-logo reel, grain, footer drift, nebula, ASCII), captures before entrance effects settle, scroll position, dev overlays, sub-pixel antialiasing noise thresholds. Prefer pausing animations deterministically (`document.getAnimations()` paused at a fixed time, a fixed seed or frozen `requestAnimationFrame` for canvases) over masking large regions; keep masks small and listed at the top of the script. Allow comparing against production builds too (`REF=http://127.0.0.1:3006`, `NEW=http://127.0.0.1:3005`; 3006 is a 2026-10-29 Next export and may be slightly stale). The six-pixel mobile height deltas recorded in M7 may remain as declared known differences.

**M8b, logo hover (dark theme only; light theme stays exactly as it is).** Fill animation is not possible: most dark-theme logo files are PNGs. Implement the isolated additive crossfade Codex measured: a second copy of the same image at identical position and size, the monochrome copy keeping today's `brightness(0) invert(1)` filter, the color copy unfiltered, complementary opacities over the existing 0.2 s ease-out, both copies in an isolated group with `mix-blend-mode: plus-lighter`. Keep the original artwork, `alt`/decorative semantics, the hover pause and resume of the reel, reel timing, any hover movement and reduced-motion behavior. No new image requests for the copy. It must work everywhere client logos appear: Home (`astro/src/components/ClientSlots.astro`) and About (`AboutConcepts` island, which uses `src/components/client-slots.tsx`). Do not edit `src/`: put CSS in `astro/src/styles/site.css` and, if About needs a markup change, fork the needed component into `astro/` with a Decision Log entry (About is on the no-React list anyway).

**M8c, first paint equals the settled page:**

- Clock (header island via `src/components/local-clock.tsx`, and any footer clock): the text and status must be in the first paint. Use markup plus a tiny inline script immediately after the element that computes the same value synchronously (same time zone, format and online/offline rule), and make sure hydration or the later timer does not clear or re-insert it. If the header island prevents this, move the clock out of the island into Astro markup at the identical position, or fork, with a Decision Log entry.
- Case-frame grain (`/proof/placeholder`): noisy from the first paint. Supply an initial noise tile with the same size, alpha and blend as the live one (as `initial-grain` proved), then let the existing 20 Hz update take over unchanged.
- Case-frame attribution width (`--case-quote-width`, longest quote line): correct before first paint on a warm reload. Measure in an inline script right after the element (same Range-based method), and re-measure on `document.fonts.ready` and resize as now. Porting `CaseFrame` to `.astro` plus vanilla TypeScript is allowed here (it is on the no-React list); keep the grain algorithm and timing.
- Bottom blur: emit the eight layers in `Base.astro` markup as Next's `bottom-blur.tsx` does; the script only manages behavior.

**M8d, verify:** Chromium (headless shell) and Firefox, both themes, 1440×900 and 390×844:

- `FRAMES=1` warm-reload timelines on `/`, `/proof/placeholder` and the article: clock, grain texture, attribution and bottom blur do not change after the first captured frame (except the grain's normal ongoing animation, compare against the `runtime/flash/` before-captures).
- Hover: rerun the fixed-pixel measurement (`runtime/flash/hover-fixed-pixels.mjs` approach) on Home and About, dark and light: dark has no gray dip, light is unchanged from before, endpoints match today's.
- Calibrated parity of settled pages against Next for all routes; `astro check`, build, invariant diff.

Then stop for the owner's review in Chrome.

## Validation and Acceptance

Run every check as `run-check -- <command>` and judge its final `run-check: PASS|FAIL` line. Never claim a check that did not run.

The Codex sandbox may block binding ports (`EPERM`), which stops dev servers and some builds, and Chromium cannot navigate there; Playwright Firefox works. If a server or build cannot run in the sandbox, record the exact error in Surprises, continue with everything else, and list the checks that still need to run outside the sandbox. Do not stop to ask about this.

## Idempotence and Recovery

All work is in `astro/`, this plan and the ignored `runtime/`. Stage 1 is committed (`1b7f7980`), stage 2 as checkpoint `b503ce00`. To redo a milestone, check out the last good commit for `astro/` and delete untracked files under it. Nothing is pushed, merged or deployed.

## Artifacts and Notes

- `runtime/astro-migration/m1-check-final.log`: `run-check: PASS (exit 0)`, 0 errors, warnings, or hints.
- `runtime/astro-migration/m1-build-final.log`: `run-check: PASS (exit 0)`, two static routes emitted.
- `runtime/astro-migration/next-invariant-final.log`: `run-check: PASS (exit 0)`, Next-owned tracked files/config/root lockfile unchanged from `e504a4bd`.
- M4 final `run-check -- pnpm --dir astro --ignore-workspace run check`: `PASS (exit 0)`, 0 errors/warnings/hints, log `runtime/checks/20261031T192816Z-3-pnpm.log`.
- M4 final `run-check -- pnpm --dir astro --ignore-workspace run build`: `PASS (exit 0)`, log `runtime/checks/20261031T192822Z-2-pnpm.log`.
- M4 Playwright Firefox acceptance: `PASS (exit 0)`, log `runtime/checks/20261031T193037Z-2-node.log`; findings and screenshots in `runtime/astro-migration/m4/`.
- M4 payload calculation: `PASS (exit 0)`, log `runtime/checks/20261031T193032Z-2-node.log`; gzip totals are independent-file estimates.
- M4 Next invariant diff: `PASS (exit 0)`, log `runtime/checks/20261031T192842Z-2-bash.log`.
- M4 computed-style diagnostic: `PASS (exit 0)`, log `runtime/checks/20261031T193209Z-2-node.log`.
- M4 corrected sticky/FAQ/pointer probe: `PASS (exit 0)`, log `runtime/checks/20261031T193257Z-2-node.log`; sticky geometry matched, FAQ `hidden="until-found"` structure matched, pointer-exit difference observed.
- Earlier M4 Astro check attempts: initial JSX-in-frontmatter run failed and was corrected; one intermediate check passed with an unused hint later cleaned. The final check above is clean. Browser runs also had an initial Firefox clipboard-permission rejection and a stale Next selector; the test shim/selector were corrected before the final acceptance pass.
- `runtime/astro-migration/m4/payload.json`: Astro 12 external assets, 412,005 B raw / 146,729 B gzip-summed, plus 6 inline scripts, 11,929 B raw / 5,162 B gzip-summed; Next 13 external assets, 874,873 B raw / 284,835 B gzip-summed, plus 3 inline executable scripts, 36,767 B raw / 6,899 B gzip-summed.
- `runtime/astro-migration/m4/findings.json`, `markdown-astro.md`, `markdown-next.md`, eight screenshots, `style-diagnostic.mjs`, and `final-probe.mjs`: M4 comparison evidence. Markdown strings compare equal after replacing each server origin with the same placeholder.
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
