# Overnight review and cleanup

A whole-site code review, accessibility audit and Astro cleanup, run unattended by Codex with Claude
checking between phases. Unlike the end-of-day checks (`end-of-day.md`), this one fixes things, but
only safe ones; anything that changes the look, the copy or a settled decision goes to the owner.
First written 2026-11-03 for the Astro site, replacing the React-era habit of a read-only Sol review.

| Phase | Who | Writes | Model |
|---|---|---|---|
| 0. Integrate and prepare | Claude | the review branch | — |
| A. Review and audit | Codex | `runtime/overnight/` only | `gpt-6.1-sol` high |
| B. Triage | Claude | `runtime/overnight/fix-list.md` | — |
| C. Fix | Codex | `src/`, `public/`, config, one commit per concern | `gpt-6-luna` medium |
| D. Verify and report | Claude | journal entry, handoff | — |

Why these models: the owner set Sol high for checks and code review (2026-10-28); fixes against an
explicit list with acceptance criteria are bounded work, where Luna medium is the cheapest tier that
has held up (`choose-agent-model`). Raise C to Luna high only if a first pass skips work.

## 0. Integrate and prepare (Claude)

- **Branch.** Review the site as it will ship, not one branch of it. Create
  `review/overnight-<date>` in `~/worktrees/fiverr-portfolio/overnight-<date>` from the most advanced
  design branch, merge every finished, unmerged branch the owner wants shipped, and resolve the
  conflicts. Record the branch list and merge commits in the brief. Nothing is pushed; whether the
  result fast-forwards `design/foundation` is the owner's call ("merge").
- **Install and build outside the sandbox.** `run-check -- pnpm install --frozen-lockfile`,
  `run-check -- pnpm run check`, `run-check -- pnpm run build`. Codex must never install: a sandboxed
  `pnpm install` once deleted `node_modules`.
- **Tools.** Copy `runtime/a11y-tools` (axe-core 4.14, Lighthouse 13.5) from another worktree.
  Playwright 1.64.1 client:
  `/home/emma/.cache/pnpm/dlx/9c456deaad767b138b7b1682f3746de4/mvwrjgg3-d/node_modules/.pacquet/playwright@1.64.1/node_modules/playwright/index.mjs`,
  Firefox at `/home/emma/.cache/ms-playwright/firefox-1532/firefox/firefox` (the only browser that
  works in the sandbox). For request interception, use the 1.61.1 client in
  `/home/emma/.npm/_npx/e41f203b7505f1fb/node_modules`; 1.64.1's doesn't match that Firefox.
- **Verify (D):** besides reading diffs, compare full-page screenshots of every route before and after
  (build the merge commit to a second `--outDir`, serve it on 3022). First run: `docs/journal/20261103-overnight.md`.
- **Servers, in the background, outside the sandbox:** the dev server for Astro's audit
  (`pnpm exec astro dev --port 3006`; Astro 7 detaches it, stop with `pnpm exec astro dev stop`) and the static build (`python3 docs/checks/serve.py dist 3021`).
- **Baseline:** Lighthouse on the build (`docs/checks/lighthouse.cjs`, see `end-of-day.md`), saved
  under `runtime/overnight/lighthouse-before/`.
- **Briefs:** copy the two briefs below to `runtime/briefs/<date>-overnight-a.md` and `-c.md`, filled in.

## A. Review and audit (Codex, read-only on code)

```bash
(nohup timeout 14400 codex exec -m gpt-6.1-sol -c model_reasoning_effort='"high"' -s workspace-write \
  -c sandbox_workspace_write.network_access=true -C "$PWD" -o runtime/overnight/a-report.md \
  "Follow the brief in runtime/briefs/<date>-overnight-a.md exactly. Do not stop to ask questions: record anything you can't do and continue." \
  < /dev/null > runtime/overnight/a.log 2>&1 &)
```

Check the log after about a minute. Wait on the real `codex exec` PID, then kill leftover
`codex-linux-sandbox` children.

## B. Triage (Claude)

Read the report and verify every finding marked FIX-SAFE yourself, in the code and where it
matters in the browser. Drop wrong ones, move anything that changes the look or the copy to the
owner, and write `runtime/overnight/fix-list.md`: one numbered item per concern, with the file,
the fix, and how to verify it.

## C. Fix (Codex)

Same launch as A, with `-m gpt-6-luna -c model_reasoning_effort='"medium"'`, the `-c` brief and
`-o runtime/overnight/c-report.md`. Add
`-c 'sandbox_workspace_write.writable_roots=["<git rev-parse --git-common-dir>"]'`: a linked
worktree's git directory lives in the primary checkout, and Codex can't commit without it.

## D. Verify and report (Claude)

- Read the full diff (`git log -p` over the new commits), commit by commit. Revert any commit that
  goes beyond its fix-list item.
- Rerun check, build, Lighthouse (`lighthouse-after/`) and axe; compare with the baseline.
- Look at every page a commit touched, live in Chrome, both themes, desktop and phone. Codex's own
  measurements have missed visual regressions before.
- Write `docs/journal/<date>-checks.md` (shape of `20261026-baseline.md`), a handoff with everything
  that needs the owner's judgment, and a field-log entry in Second Brain
  `experiments/agent-context-efficiency/field-log.md`.

## Brief A (copy, fill in, give to Codex)

```markdown
# Brief: overnight review and audit of the emmaki site (read-only on code)

Repository: `<worktree>` (branch `<branch>`, at `<commit>`; integrates <branches>). Astro 7.4,
Tailwind 4, static build. Dev server at http://127.0.0.1:3006 (Astro dev toolbar on); built site
at http://127.0.0.1:3021. Don't start, stop or rebuild either.

## Goal

Find what is wrong, fragile, inaccessible or not idiomatic Astro, across the whole site, and
classify each finding so a later pass can fix the safe ones. Don't edit anything outside
`runtime/overnight/`; don't commit, push or install anything.

## Read

`AGENTS.md`, `CONVENTIONS.md`, the newest `docs/handoffs/*.md`, `docs/design-system/DESIGN.md`
and `ARCHITECTURE.md`, `astro.config.mjs`, `package.json`, then everything under `src/`.

## Docs

Use the context7 MCP for current Astro 7 documentation (resolve the library id first, then query)
whenever a finding depends on Astro behavior: script processing and `is:inline`, `astro:assets`
and image optimization, content collections, MDX, sitemap, prefetch, the dev toolbar, `astro check`.
Cite the doc in the finding. Don't rely on memory of older Astro versions.

## Rules

- No Chrome DevTools MCP, no owner's browser. Playwright Firefox only (see tools).
- Settled decisions, never findings: motion stays with no pause control (WCAG 2.2.2 unmet by
  choice, see DESIGN.md "Motion"); GSAP stays; the brand is "emmaki", lowercase; American English.
- The owner writes all copy. Placeholder text ("X and Y", "Client one", lorem) is known; don't
  report it.
- Review tooling the owner is still using (dev-only pickers and switchers) is intentional; list
  what exists when filling in the brief, and report as DECIDE only if one ships to production.

## Tools (installed; download nothing)

- Playwright 1.64.1 client: `<path>`, Firefox: `<path>`. Chrome can't navigate in the sandbox and
  WebKit doesn't launch; record both as untested.
- axe-core 4.14: `runtime/a11y-tools/node_modules/axe-core/axe.min.js`.
- Astro's audit rules: `node_modules/astro/dist/runtime/client/dev-toolbar/apps/audit/rules/`.
- Theme: `data-theme` on `<html>`, from `localStorage['emmaki-theme']` before paint.

## Pages

<pages>, plus `/nope` (the 404).

## Work

1. **Astro audit.** On the dev server, for every page, both themes, open the dev toolbar's Audit
   app and record every item it lists (rule, element, message). If the toolbar can't be read from
   Firefox, evaluate the same rules from the rules files against each page and say so.
2. **`astro check` and build output:** run neither (Claude ran them; logs in `runtime/checks/`);
   read the newest logs and list every warning.
3. **Accessibility:** checks 1-9 of the brief in `docs/checks/end-of-day.md`, against the built
   site on 3021.
4. **Code review of `src/`:** correctness bugs; leaked listeners, observers and rAF loops; script
   duplication across components; one business rule implemented twice; dead code, unused exports,
   files, assets and dependencies; leftovers from the React/Next era; error handling (silent
   catches, fallbacks that hide failures); first-paint and layout-shift risks; image and font
   weight (for example the 2 MB hero PNGs); SEO metadata per page; Astro idioms per the docs.
5. **Classify every finding:**
   - **FIX-SAFE:** clear fix, no visible change, no copy change, verifiable by a check or a test.
   - **FIX-VISUAL:** the fix changes how something looks or moves. For the owner.
   - **DECIDE:** needs the owner's judgment (product, copy, trade-off).
   - **INFO:** worth knowing, no action.

## Output

- Evidence under `runtime/overnight/a/`.
- The report (the `-o` file): a summary table (area x count by class), then findings ranked by
  severity, each with id, class, file and line, evidence, WCAG criterion or doc citation, and a
  one-line fix with how to verify it. Separate measured from inferred. List what you couldn't test.
- Before finishing, confirm `git status --short` shows nothing you changed outside `runtime/`.
```

## Brief C (copy, fill in, give to Codex)

```markdown
# Brief: overnight fixes on the emmaki site

Repository: `<worktree>` (branch `<branch>`, at `<commit>`). Fix exactly the items in
`runtime/overnight/fix-list.md`, nothing else.

## Rules

- One commit per fix-list item, message `<Area>: <what changed>` (match `git log`), ending with
  `Co-Authored-By: Codex <noreply@openai.com>`. Don't push, merge or rebase.
- After each item: `run-check -- pnpm run check` and `run-check -- pnpm run build`; both must pass
  before committing. If an item can't be fixed cleanly, skip it and say why; don't widen it.
- No visual or copy changes beyond what an item states. No new dependencies, no installs, no
  lockfile changes. No Chrome DevTools MCP, no owner's browser.
- Use the context7 MCP for Astro 7 documentation when a fix depends on Astro behavior.
- Follow `CONVENTIONS.md` and the surrounding code's style; American English in comments.
- Settled: motion, GSAP, lowercase "emmaki". The owner writes all copy.

## Verify

For each item, the verification the fix list names, in Playwright Firefox (paths in the fix list)
against the dev server at http://127.0.0.1:3006, both themes, 1440x900 and 390x844.

## Output

The report (the `-o` file): per item, the commit hash, what changed, the verification result and
`run-check` lines; skipped items with reasons; anything noticed but not touched.
```
