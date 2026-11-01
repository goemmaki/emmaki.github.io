# Case-study notes: building and migrating the emmaki site

Source material the owner asked to keep for a possible portfolio case study (2026-11-01). It gathers the design decisions, technical changes, problems solved and measured results into one place and points to the evidence. It is not the case study: the owner writes that. The [journal README](README.md) record rules apply (facts tied to commits or dated transcripts, candid about mistakes, no marketing prose).

## Building the site (2026-09-24 to 2026-10-29)

Already recorded in [the history file](20260924-20261026-history.md); the sections to start from:

- **Design decisions:** "Creative decisions", "References", "Light and dark themes".
- **Rejected and reversed ideas:** "Rejected and reversed ideas", "Killing your darlings" (screenshots indexed in [screenshots.md](screenshots.md)).
- **Accessibility:** "Accessibility", "2026-10-28 — Six accessibility fixes", [the 2026-10-26 baseline](20261026-baseline.md), the [10-27](20261027-checks.md) and [10-28](20261028-checks.md) end-of-day checks.
- **Code health and weight:** "Code health", "Performance and weight".
- **Who did what, time and cost:** "Who did what", "Time, tools, and cost records", "Open questions and evidence gaps".

## Migrating from Next.js to Astro (2026-10-31 to 2026-11-01)

Full record: [the ExecPlan](../exec-plans/20261031-astro-migration.md) (milestone outcomes, Surprises, Decision Log) and the journal entries dated 2026-10-31, 2026-11-01 (M10) and 2026-11-01 (M11 and merge).

### The decision

- The site was a static Next.js 16 / React 19 export. Mostly static pages shipped the React and Next runtime on every route. A read-only Codex audit (`gpt-6.1-sol` high) compared optimizing Next, Astro with React islands and Astro without React; the owner chose Claude's recommendation: Astro, ending with no React, in stages (2026-10-31).
- Staging: Brands and the shared shell first (owner-approved, `1b7f7980`), then the article (`b503ce00`), then every route (M5–M7), then React islands replaced by vanilla TypeScript (M9a–M9c), then Next deleted (M10, `efeb2ae4`), then verification and merge (M11).
- The owner kept GSAP and cut three "darlings" (archived in `archive/darlings/`, not deleted).

### Technical changes

- Framework: `next`, `react`, `react-dom`, `@base-ui/react`, `lucide-react`, `motion`, `shadcn`, `tw-animate-css` and `cn` removed; Astro 7.4.4 with `@tailwindcss/vite`, Fontsource fonts and GSAP. Diff from the pre-migration commit `e504a4bd` to `efeb2ae4`: 118 files, +4,595 / −9,393 lines.
- Base UI widgets rebuilt on the platform: header menu as a native `<dialog>`, FAQ with `hidden="until-found"` (browser find-in-page opens answers), post tools menu as a native popover, tooltips and AI badges as plain markup and small scripts. Canvas pieces (Proof index, ASCII masks, 404 nebula, cover pixelation, spotlight) moved from React effects to inline vanilla scripts.
- Next's font-fallback metrics (`next/font`) were reproduced by hand so text does not reflow on load (M9d).
- A screenshot parity tool (`scripts/parity.mjs`) compares every route in both themes and two sizes against the Next build, in Chromium and Firefox, with a calibrated 0.5% pixel budget that still fails a 1 px shift.

### Problems solved (and how they were caught)

- **Duplicate React build crash** (`useContext` of null) while both apps shared `src/`: fixed with Vite `dedupe` (Claude, 2026-10-31).
- **Cover pixelation dead in Chrome:** pixelation and spotlight shared one `requestAnimationFrame` id, so the spotlight cancelled pixelation draws. Codex's Firefox acceptance missed it because Firefox could not run the scroll-driven animation; the owner found it in Chrome (M4 review, fixed M5 `5b3dd148`).
- **Chromium parity at 3/32 looked like broad breakage:** it was capture noise (random seeds, color profile, font hinting). After making captures deterministic, both engines passed 32/32 (`af23770e`).
- **Spotlight on reload** (owner, Chrome, 2026-11-01 evening): Chrome sends a `pointermove` at the resting cursor on reload; Next attached its listener after hydration and usually missed it, Astro's early inline script sometimes caught it. The fix ignores moves until the mouse actually moves. Note for the record: Codex had added a similar filter in M9d; Claude reverted it because Next had no such filter and the change belonged to the post-merge backlog. The M11 Chromium failure (31/32) and the owner's report then traced back to exactly this.

### Agent mistakes and corrections (candid record)

- Claude estimated "half a day to a day" from the stale `design/foundation` branch (~1,450 lines) instead of the real one (~4,460 lines, 28 client components). The migration took two days of sessions.
- Claude launched the first Codex run at max effort; the owner stopped it. Later runs used Luna medium.
- Codex's first `astro check` "pass" was an unanswered install prompt, not a check.
- Headless probes repeatedly passed things the owner then saw in real Chrome (pixelation, logo hover, spotlight on reload); the owner's Chrome review was the deciding check each time.
- The M11 verification run was cut off by a session outage and resumed from its saved Codex session.
- During the spotlight fix Claude rebuilt `dist/` for a control test while a parity run was reading it, invalidating that run; it was stopped and rerun.

### Measured results

Per-route JavaScript and CSS from the static builds, measured 2026-11-01 by Codex in M11 (raw bytes / gzip summed per file, not observed transfer size; `runtime/astro-migration/m11/payload.json`):

| Route | Next JS | Astro JS | Next CSS | Astro CSS |
|---|---:|---:|---:|---:|
| `/` | 827,148 / 262,389 | 14,157 / 7,105 | 95,443 / 19,376 | 82,592 / 17,736 |
| `/about` | 824,911 / 265,572 | 15,406 / 7,371 | 95,443 / 19,376 | 82,592 / 17,736 |
| `/blog` | 799,727 / 257,703 | 10,824 / 5,574 | 96,257 / 19,789 | 83,294 / 18,092 |
| `/blog/placeholder-post` | 911,640 / 291,732 | 17,493 / 8,078 | 95,443 / 19,376 | 82,592 / 17,736 |
| `/brands` | 802,417 / 257,973 | 7,817 / 4,174 | 95,443 / 19,376 | 82,592 / 17,736 |
| `/proof` | 803,559 / 258,941 | 10,393 / 5,387 | 95,443 / 19,376 | 82,592 / 17,736 |
| `/proof/placeholder` | 870,754 / 280,104 | 10,360 / 5,695 | 95,443 / 19,376 | 82,592 / 17,736 |
| 404 | 794,850 / 255,410 | 10,585 / 5,456 | 95,443 / 19,376 | 82,592 / 17,736 |

Gzipped JavaScript per page fell from 255–292 KB to 4–8 KB. For comparison, at M7 (Astro with React islands) it was 77–132 KB.

- Visual parity with the Next build: Firefox 32/32; Chromium 31/32 before the spotlight fix, 32/32 after it.
- Scripted accessibility and keyboard Tab order: 64/64 comparisons with Next (landmarks, heading order, accessible names, `lang`, skip link, focus visibility); axe-core was not run.
- Owner's Chrome review (2026-11-01): "very pleased with the migration"; minor visual issues recorded in the [visual-polish backlog](../visual-polish-backlog.md), items 12–19.

### Gaps

- No Lighthouse run on the Astro build yet; the end-of-day procedure (`docs/checks/end-of-day.md`) covers it.
- No real-device, Safari/WebKit or screen-reader testing for the migrated site.
- The site is not deployed: GitHub Pages still serves `main`, which holds only a README.
