# Site checks: end-of-day and full

What to measure on the emmaki site and how. Two modes, one checklist:

- **Quick** runs at the end of a working session, before the journal entry: did today's work break
  anything, and are the numbers moving?
- **Full** runs only when the owner asks for it, usually overnight through `overnight-review.md`:
  is the site right everywhere, in every browser?

Both modes measure; they don't fix. Fixing is `overnight-review.md`'s job. Earlier results, for
comparison: `docs/journal/20261026-baseline.md` (first run, React era), `20261103-overnight.md`
(first Astro run).

Who does what: Claude installs, builds, serves and runs Lighthouse; Codex runs everything else.
Codex must never install anything (a sandboxed `pnpm install` once deleted `node_modules`).

## Tools

Installed; download nothing during a run.

- **Playwright 1.61.1 client:** `/home/emma/.npm/_npx/e41f203b7505f1fb/node_modules/playwright`.
  Chromium, Firefox and WebKit (26.5, Safari's engine; this is the Safari test) all launch with it, inside Codex's sandbox
  too (checked 2026-11-04 with `codex sandbox`). The 1.64.1 client in the pnpm dlx cache can't drive
  the cached WebKit or intercept requests in Firefox; don't use it.
- **axe-core 4.14 and Lighthouse 13.5** in `runtime/a11y-tools`. Copy it from another worktree's
  `runtime/`, or `npm install --prefix runtime/a11y-tools axe-core@^4.14 lighthouse@^13.5 vnu-jar`.
- **Astro's audit rules:** `node_modules/astro/dist/runtime/client/dev-toolbar/apps/audit/rules/`.
- **Astro 7 docs:** the context7 MCP. Cite the page when a finding depends on Astro behavior.
- **Nu HTML Checker** (`vnu-jar`, Java is installed) in `runtime/a11y-tools`:
  `java -jar runtime/a11y-tools/node_modules/vnu-jar/build/dist/vnu.jar --skip-non-html --format json dist`.
- Not available: real screen readers and field Core Web Vitals (no production URL or visitors yet).
  Report both as untested in one line each.

## Prepare (Claude)

- `run-check -- pnpm run check` and `run-check -- pnpm run build` (writes `dist/`). Keep both logs.
  Full mode also: `run-check -- pnpm audit --prod` (needs network, so Claude runs it).
- Static build: `python3 docs/checks/serve.py dist 3021` in the background (GitHub Pages behavior,
  including the 404 status). Full mode also needs the dev server for Astro's toolbar:
  `pnpm exec astro dev --port 3006` (Astro 7 detaches it; stop with `pnpm exec astro dev stop`).
- **Pages:** every HTML file in `dist/` (`find dist -name '*.html'`), so blog posts and proof entries
  are included, plus `/nope` for the 404.
- **Lighthouse:** `NODE_PATH=/home/emma/.npm/_npx/e41f203b7505f1fb/node_modules RUNS=<n> node
  docs/checks/lighthouse.cjs runtime/checks-<date> 3021 <pages>`. Light and dark, desktop and
  mobile; quick `RUNS=1`, full `RUNS=3` (the summary keeps the median run by performance score).
  Leave out the 404: Lighthouse refuses a 404 status.
- **Brief:** copy the brief below to `runtime/briefs/<date>-checks.md` and fill it in.

## Matrix

| | Quick | Full |
|---|---|---|
| Engines | Chromium, Firefox | Chromium, Firefox, WebKit |
| Themes | light, dark | light, dark |
| Viewports | 1440×900, 390×844 | below |

Full viewports: phones 360×740, 390×844, 430×932 and 844×390 (landscape); tablets 768×1024 (iPad
mini) and 1024×768; desktop 1280×720, 1440×900, 1920×1080 and 3840×2160 (4K); short 1440×600 and
390×600. Phones and tablets get `hasTouch` and `isMobile` in Chromium and WebKit (Firefox has no
`isMobile`; use touch only). Not every check needs every viewport: use all of them for layout,
touch and visual regression, and the quick pair plus one tablet for the rest.

The theme is `data-theme` on `<html>`, set before paint from `localStorage['emmaki-theme']`. Seed or
hide randomized decoration only where it would make a measurement flaky, and say where.

## Checks

Q = quick, F = full.

1. **Build (Q, F).** Every warning from `astro check` and the build log, counted against the last run.
2. **Astro toolbar (F).** On the dev server, every route, both themes, at 1440×900 and 390×844,
   record every Audit item (rule, element, message). Then judge each one: real or false alarm, and
   why. The loading-attribute rules sum `offsetTop` against the current window height, so they
   misjudge hidden, fixed, transformed and duplicated elements (marquee clones, closed menus) and
   change with the viewport. Check the element's real position and visibility at load. Never
   recommend a change just to bring the count down.
3. **Accessibility, automated (Q, F).** axe (`wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`,
   `best-practice`) per page, at the top and at every scroll position with distinct states. Full
   mode also scans open states: header menu, page-tools menus, accordions, FAQ, tooltips, the gig
   shelf's open card. Violations with selector, rule and impact; "incomplete" items that need a human.
4. **Contrast over images, canvases and animation (Q, F).** Text, icons and focus rings against
   what is actually behind them (screenshot with the text hidden, measure the luminance behind each
   box): 4.5:1 for normal text, 3:1 for large text, icons and focus indicators. Minimum and where.
5. **Keyboard and focus (Q, F).** Tab through every page: order, visible focus (measure the ring on
   screen), traps, skip link, every menu and dialog (open, arrows, Escape, focus return), focus not
   hidden under the sticky header (2.4.11).
6. **Structure (Q, F).** From the accessibility tree (Chromium and, in full mode, WebKit): landmarks,
   one h1 and a sane heading outline per page, controls without names, duplicate announcements,
   decorative content exposed. This approximates a screen reader; it isn't one.
7. **Motion (Q, F).** Under `reducedMotion: 'reduce'`: what still moves, what is missing or
   unreadable. The sparkles, footer drift, blog masks, 404 nebula, caution tape and globe run
   without a pause control by the owner's decision (`docs/design-system/DESIGN.md`, "Motion"):
   accepted, not a finding. Report only a new animation that starts by itself and runs over 5 s.
8. **Theme and first paint (Q, F).** A first visit with no stored theme is dark, whatever the system
   prefers (owner, 2026-11-04: dark always; visitors switch with the toggle); the toggle persists; no flash of the wrong theme or unstyled content and
   no layout jump while fonts and scripts load.
9. **Responsive layout (Q, F).** Per viewport: no horizontal overflow
   (`scrollWidth === clientWidth`), nothing overlapping, cut off or unreadable, no blurry upscaled
   images or lost layout at 4K, sticky and fixed elements behave on short viewports. Full mode:
   rotate 390×844 to 844×390 and back mid-visit; text zoom to 200% and reflow at 320 px wide (1.4.4,
   1.4.10); text spacing overrides (1.4.12); forced colors (`forcedColors: 'active'`), where
   controls, focus and icons must stay visible; visual order matches reading and focus order (1.3.2).
10. **Touch (F).** On the touch contexts: tap every control; nothing that only works on hover
   (`pointer: coarse`); target size at least 24×24 px or spaced (2.5.8); scrolling, swiping and
   scroll-linked effects work; no stuck hover states after a tap.
11. **Cross-browser (Q, F).** Screenshots per engine and route; differences that matter (layout,
    fonts, animation fallbacks such as `animation-timeline`, `:has`, view transitions, canvas and
    WebGL) and console errors and warnings per engine.
12. **Function (F).** Every interactive component does its job: navigation and header menu, theme
    toggle (and that it persists), accordions and FAQ (closed answers still found by Ctrl+F, i.e.
    `hidden="until-found"`), page tools (copy, share, AI links), back-to-top, gig shelf, client
    logos, tooltips, the globe. Every internal link, `src` and `srcset` in `dist/` resolves; list
    external links and check they're well formed, without fetching them (never contact Fiverr or
    Upwork). The 404 returns status 404 with the 404 page. Pages without JavaScript: what still
    works, what breaks.
13. **Performance (Q, F).** Lighthouse scores and failing audits against the last run. Full mode, per
    page, in Chromium:
    - LCP element and time, CLS and its sources, total blocking time; an INP proxy from Event
      Timing on the main interactions (menu, toggle, accordion, shelf).
    - Network inventory: requests and bytes by type, what loads before first paint, anything loaded
      but unused, compression and caching as GitHub Pages will serve them.
    - Images: format, bytes, intrinsic vs displayed size per viewport, `loading`, `fetchpriority`
      and `decoding`, and whether they match the image's real position (above the fold at load
      should be eager, the LCP image high priority); `astro:assets` vs raw `public/` files.
    - Fonts: files and bytes, preloads, `font-display`, unused families or weights, layout shift on
      swap.
    - JavaScript: bytes per page, what runs at load, scripts that could be CSS or wait until
      visible, code duplicated across components, long tasks.
    - Animation: frame rate and long tasks while scrolling Home and About (a performance trace);
      animations that keep running off screen or in a hidden tab.
14. **SEO (Q basic, F).** Per page: `<title>` and meta description (present, unique), `lang`,
    robots and noindex, canonical, Open Graph and Twitter tags (the image exists and is the right
    size), structured data (valid JSON-LD), favicon and touch icons, `robots.txt`, and whether
    `public/llms.txt` and `public/agents.md` match the pages they describe. Sitemap and canonical URLs depend on `site`,
    which stays unset until launch (owner, 2026-11-01): report them as blocked by that, not as
    defects.
15. **Resilience (F).** Images blocked, fonts blocked, slow 3G with CPU throttling: what the user
    sees. Then leave Home and About open for 5 minutes, idle and scrolling: heap growth, CPU,
    timers and animation loops that pile up.
16. **Standards (F).** Nu HTML Checker errors on every page in `dist/` (duplicate ids, invalid
    nesting, bad attributes); Claude runs it if Java is blocked in the sandbox.
17. **Security and privacy (F).** Every third-party request per page (fonts, scripts, images,
    trackers: none expected); `target="_blank"` links and their `rel`; mixed content; nothing in
    `dist/` that shouldn't ship (source maps, dev-only files, drafts, secrets, absolute local
    paths); `pnpm audit` results.
18. **Copy QA (F).** Spelling (American English), doubled words, broken markup showing as text,
    lowercase "emmaki". Report only: the owner writes all copy.
19. **Visual regression (Q, F).** Full-page screenshots of every route, both themes, under reduced
    motion, compared pixel by pixel with the last run's set (quick: quick matrix in Chromium; full:
    every viewport and engine, plus each animation at its start and paused at a fixed time).
    Report what changed and whether a commit explains it. Keep the set under
    `runtime/checks-<date>/visual/` and name the previous set you compared against.

## Report (Claude)

- Combine Lighthouse and Codex's report into `docs/journal/<date>-checks.md`, in the shape of
  `20261026-baseline.md`: how it ran and what went wrong, a results table, changes since the last
  run, and what was not tested and why.
- Tell the owner the results in plain words. New findings go to the handoff; fixes are separate
  commits.

## Launch

```bash
(nohup timeout 7200 codex exec -m gpt-6.1-sol -c model_reasoning_effort='"high"' -s workspace-write \
  -c sandbox_workspace_write.network_access=true -C "$PWD" -o runtime/checks-<date>/report.md \
  "Follow the brief in runtime/briefs/<date>-checks.md exactly. Do not stop to ask questions: record anything you can't do and continue." \
  < /dev/null > runtime/checks-<date>/codex.log 2>&1 &)
```

Full mode needs a longer timeout (`14400`). Check the log about a minute after launch, then wait on
the real `codex exec` PID.

## Brief (copy, fill in, give to Codex)

```markdown
# Brief: <quick|full> site checks on the emmaki site (read-only on code)

Repository: `<worktree>` (branch `<branch>`, at `<commit>`). Built site at http://127.0.0.1:3021,
dev server (full mode) at http://127.0.0.1:3006. Don't start, stop or rebuild either.

## Goal

Run the <quick|full> checks in `docs/checks/end-of-day.md` ("Matrix" and "Checks"), with its
"Tools". Measure, don't fix: write only under `runtime/checks-<date>/`; don't edit, commit, push or
install anything; no Chrome DevTools MCP and not the owner's browser. Compare with the last run,
`<last journal entry>` and `<last evidence dir>`. Don't stop to ask: record what you can't do and
continue.

## Read

`AGENTS.md`, the newest `docs/handoffs/*.md`, `docs/design-system/DESIGN.md` (Motion and
Accessibility), `src/pages/**`, `src/components/**`, `src/lib/**`, `src/styles/globals.css`, the
`run-check` logs `<check log>` and `<build log>`, and the Lighthouse summary
`runtime/checks-<date>/lighthouse-summary.json`.

## Pages

<pages>, plus `/nope` (the 404).

## Settled (never findings)

Motion without a pause control (WCAG 2.2.2 unmet by choice); GSAP; the lowercase brand "emmaki";
American English; placeholder copy (the owner writes all copy); dev-only review tools, unless one
ships in `dist/`.

## Output

- Evidence (screenshots, JSON, traces) under `runtime/checks-<date>/`.
- Report (the `-o` file): a one-screen table (check × engine: pass / fail / needs human /
  untested), then findings ranked by severity, each with page, engine, theme, viewport, evidence
  path, WCAG criterion or doc citation, and a one-line suggested fix. Separate measured from
  inferred. End with what changed since the last run and what you couldn't test, with reasons.
- Before finishing, confirm `git status --short` shows nothing you changed outside `runtime/`.
```
