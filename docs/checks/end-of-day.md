# End-of-day checks

Run at the end of a working session, before the journal entry. They measure where the site stands on
WCAG 2.2 AA, SEO, performance and cross-browser behaviour, so the next session can compare against
them. They measure; they don't fix. First run 2026-10-26 (results: `docs/journal/20261026-baseline.md`).

Who does what: Claude prepares, builds and runs Lighthouse; Codex runs everything else in Firefox.
Codex's sandbox blocks a Turbopack build and Chrome, so those stay with Claude.

## 1. Prepare (Claude)

- **Tools.** In the worktree, `runtime/a11y-tools` must hold axe-core 4.14 and Lighthouse 13.5. Copy
  it from another worktree's `runtime/`, or install it there:
  `npm install --prefix runtime/a11y-tools axe-core@^4.14 lighthouse@^13.5`.
  Playwright 1.61 is at `NODE_PATH=/home/emma/.npm/_npx/e41f203b7505f1fb/node_modules`.
- **Build:** `run-check -- pnpm build` (writes `out/`).
- **Serve:** `python3 docs/checks/serve.py out 3021` in the background. Stop that PID when done.
- **Lighthouse:**
  `NODE_PATH=... node docs/checks/lighthouse.cjs runtime/checks-<date> 3021 <pages>`.
  It covers light and dark, desktop and mobile.
- **Pages:** every route in `src/app`, plus a missing URL (e.g. `/nope`) for the 404.
- **Brief:** copy the brief below to `runtime/briefs/<date>-end-of-day.md`. Fill in the worktree,
  branch, commit, date and pages.

## 2. Launch Codex (Claude)

```bash
(nohup timeout 7200 codex exec -m gpt-6.1-sol -c model_reasoning_effort='"high"' -s workspace-write \
  -c sandbox_workspace_write.network_access=true -o runtime/audits/<date>-end-of-day.md \
  "Follow the brief in runtime/briefs/<date>-end-of-day.md exactly. Do not stop to ask questions: record anything you can't do and continue." \
  < /dev/null > runtime/audits/<date>-end-of-day.log 2>&1 &)
```

About a minute after launch, check the log to confirm it is working. Then wait on the real
`codex exec` PID. Afterwards, kill any `codex-linux-sandbox` children it leaves behind.

## 3. Report (Claude)

- **Merge the results.** Combine Lighthouse and Codex's report into a dated journal entry,
  `docs/journal/<date>-checks.md`, in the shape of `20261026-baseline.md`:
  - how it was run, and what went wrong
  - a results table
  - changes since the last run
  - what was not tested
- **Tell the owner** the results in plain words.
- **Record the findings.** New findings go to the handoff, and fixes are separate commits.

## Brief (copy, fill in, give to Codex)

```markdown
# Brief: end-of-day accessibility and cross-browser checks (read-only on code)

Repository: `<worktree>` (branch `<branch>`, at `<commit>`). Static Next.js export of the emmaki
portfolio site, already built to `out/` and served at http://127.0.0.1:3021 (don't rebuild; the
sandbox can't).

## Goal

Measure, don't fix. Do not edit anything under `src/`, `public/`, `docs/` or config; do not commit,
push or install anything. Write only under `runtime/`. Compare with the last run,
`docs/journal/<last>-baseline.md` or `-checks.md`: say what got better, worse or is new.

## Read

`AGENTS.md`, the newest `docs/handoffs/*.md`, `docs/design-system/` (Accessibility sections),
`src/app/**`, `src/components/**`, `src/lib/**`, `src/app/globals.css`.

## Tools (installed; download nothing)

- Playwright 1.61 at `NODE_PATH=/home/emma/.npm/_npx/e41f203b7505f1fb/node_modules`. **Firefox works**
  (`playwright.firefox.launch()`). Chrome can't navigate inside the sandbox; WebKit doesn't launch
  (needs sudo). Record both as untested; don't try to fix them.
- axe-core 4.14: `runtime/a11y-tools/node_modules/axe-core/axe.min.js` (inject with
  `page.addScriptTag({ path })`, then `axe.run(document, { runOnly: ['wcag2a','wcag2aa','wcag21a',
  'wcag21aa','wcag22aa','best-practice'] })`).
- Contrast: screenshot with the text hidden and measure luminance behind each text box (stdlib PNG
  decoding is fine).
- The theme is `data-theme` on `<html>`, set before paint from `localStorage['emmaki-theme']`.
- Seed or hide randomised decoration (sparkles, canvas effects) only where it would make a
  measurement flaky, and say where you did.

## Pages

<pages>, plus `/nope` (the 404).

## Checks

1. **axe** per page × light/dark × desktop (1440×900) / phone (390×844), at the top and at each
   scroll position the page has distinct states for. Violations with selector, rule, impact;
   "incomplete" items that need a human.
2. **Contrast over images, canvases and animated covers**, both themes, desktop and phone: text,
   icons and focus rings against what is actually behind them (3:1 large text, icons and focus
   indicators; 4.5:1 normal text). Minimum and where it occurs.
3. **Keyboard:** Tab through each page. Order, visible focus (measure the ring on screen, not just
   computed style), traps, skip link, header menu, theme toggle, menus (open, arrows, Escape, focus
   return).
4. **Names and structure** (screen-reader proxy, from Playwright's accessibility snapshot):
   landmarks, heading outline (one h1 per page?), controls without names, duplicate announcements,
   decorative content exposed to assistive tech. Say plainly this is not a real screen-reader test.
5. **Reduced motion** (`reducedMotion: 'reduce'`): what still moves; anything missing or unreadable.
6. **WCAG 2.2.2:** every animation that starts by itself and runs longer than 5 s, and whether it can
   be paused.
7. **Firefox vs Chromium differences** you can see from code (e.g. `animation-timeline` fallbacks)
   and in Firefox screenshots: overlaps, unreadable text, console errors.
8. **Resilience:** images blocked (route abort): what the user sees. Short viewports (1440×600,
   390×600): does anything overlap or get cut off?
9. **Standards and SEO basics:** duplicate ids, nested interactive elements, `lang`, alt text,
   console errors and warnings, `<title>` and meta description per page, canonical, robots/noindex,
   the 404's status and content.

## Output

- Evidence (screenshots, JSON) under `runtime/checks-<date>/`.
- Report (the `-o` file): a one-screen summary table (check × pass / fail / needs human / untested),
  then findings ranked by severity, each with page, theme, viewport, evidence path, WCAG criterion
  and a one-line suggested fix. Separate measured from inferred. List what you couldn't test and
  why. End with what changed since the last run.
- Before finishing, confirm `git status --short` shows no changes you made.
```
