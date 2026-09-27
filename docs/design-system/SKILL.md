---
name: emmaki-brand-system
description: Apply Emmaki's human-led B2B writing and strategy identity to the portfolio website, case studies, Fiverr compositions, editorial work, and technical/automation surfaces.
user-invocable: true
---

# Emmaki brand-system skill

Use this system whenever designing or building Emmaki-facing work. Commercial judgment and writing lead; technical fluency supports the work.

## What is inside

- `DESIGN.md` — canonical visual and composition rules.
- `BRAND.md` — color meaning, typography posture, logo, voice, and evidence rules.
- `colors_and_type.css` — canonical semantic color/type tokens.
- `tokens.css` — canonical spacing/layout/shape tokens.
- `ARCHITECTURE.md` — static Next.js/GitHub Pages implementation contract.
- `DESIGN-HANDOFF.md` — agent reading order and conflict resolution.

OpenDesign generated files are provenance/reference only. They do not outrank these files.

## When to use

Use for the Emmaki website, portfolio and case-study layouts, Fiverr visuals, proposals/presentations, technical workflow pages, and any interface that should remain recognizably Emmaki.

## How to use

1. Read `README.md`, `DESIGN.md`, and `BRAND.md` before making visual decisions.
2. For website work, read `ARCHITECTURE.md` before changing implementation.
3. Consume `colors_and_type.css` and `tokens.css` rather than inventing a parallel theme.
4. Treat shadcn/Base UI/Luma as accessible component substrate only.
5. Keep claims grounded in supplied evidence. Never fabricate clients, results, credentials, technical details, or UI data.

## Design system highlights

- Dark-first with genuine light mode.
- Monochrome neutral foundation carries hierarchy.
- Yellow is authored/brand activity: `#FCC300` at 8% / 14% / 24%, solid only as rare splash.
- Green is machine/system activity: 8% / 14% / 24% plus crisp theme value; never semantic success.
- Semantic state colors remain separate.
- Geist display, IBM Plex Sans body/interface, IBM Plex Mono technical/meta.
- Interface spacing `4/8/12/16/24/32px`; editorial `52/84/136px`; `220px` exceptional only.
- **Containers are punctuation:** default to open compositions using local gridwork, alignment, negative space, spans/offsets, and one-pixel rules; enclosure is occasional and semantically earned.
- Avoid repeated card matrices. Let structural rules cross, terminate, intersect, or partially frame compositions, and recompose the grid responsively rather than shrinking boxes.
- Writer/strategist first; technical fluency second.
- Entry motion may be authored; interior motion remains sparse and controlled.
- No active recurring marker/underline/circle/bracket/strike/scribble identity language.
