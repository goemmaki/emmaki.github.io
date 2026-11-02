# Session handoff: Home hero poster and caution tape

## Owner goals and decisions

A Swiss editorial poster for the Home hero: `#FFC300` disk with a thin maroon ring, halftone AI portrait (pose 1), "Pixel weave" word background, the owner's copy, a "Prove it" button to Fiverr, reaching down to the logo strip. Then crossed caution tape reading "Fun's over" where the page's tone turns measured. All art and copy stay inside the gutters and below the header; only the tape and the background words run full width.

## Current state and where things live

- `src/components/HeroPoster.astro`: layout, halftone canvas, inline fit script (`--copy-room` on desktop, `--figure-top` when stacked under 960px).
- `src/components/HeroWords.astro`: the word canvas and hover light.
- `src/components/CautionTape.astro`: the tape, with a dev-only finish picker (`?tape=pulled|flat|depth|print|worn`).
- `src/pages/index.astro`: copy in slots. `Statement.astro` is now the page h1.
- `docs/copy/home-hero-options.md`: copy options for A/B tests. `docs/ideas.md`: CRO tool and more-portraits ideas.
- `docs/checks/overnight-review.md`: the overnight review procedure.

## Needs the owner

- Pick a tape finish; then delete the others and the picker.
- Should the background words obey the gutters too, or stay full width?
- At 2560 the disk and portrait sit low; raise them?
- The h1 statement is still placeholder copy ("I help X and Y…").
- `portrait.png` is a 2.1 MB AI stand-in; real photo and image optimization pending.
- Merge: fast-forward `design/foundation` only when the owner says so.

## How to resume

Dev server on 3001 from this worktree. Checks via `run-check`. Overnight results land in the overnight handoff written after the run.
