# Emmaki site implementation architecture

This document governs how the Emmaki website is implemented and shipped. `DESIGN.md` and `BRAND.md` govern the visual/brand system; this file governs production architecture.

## Current foundation

The production site is a static Astro application rooted at the repository top level.

- Astro 7
- TypeScript and vanilla browser scripts
- Tailwind CSS v4 through Vite
- pnpm
- GSAP 3.15.0 remains installed by owner decision; it is currently unused.

The site has no React runtime. Static page markup belongs in `src/pages/`, shared layouts and components in `src/layouts/` and `src/components/`, content in `src/lib/`, and site styles in `src/styles/`.

## Design-token enforcement

`colors_and_type.css` and `tokens.css` are the reusable implementation foundations. Tailwind utilities must consume these roles rather than establishing a competing theme.

- Neutral canvas, surface, text, and structural-alpha tokens are the default hierarchy.
- Yellow is authored/brand activity with `8 / 14 / 24%` ghost/motif/active tiers and rare solid `#FFC300` splash. It is not generic `primary`.
- Green is machine/system activity with `8 / 14 / 24%` tiers and theme-specific crisp values. It is not semantic success.
- Semantic success/warning/error/info remain separate.
- Focus is neutral/high-contrast. Do not rely on yellow or green as the sole focus indicator.
- Preserve the interface spacing register `4 / 8 / 12 / 16 / 24 / 32px`.
- Preserve the editorial spacing register `52 / 84 / 136px` and exceptional `220px` hero value.
- Do not introduce a parallel convenience scale such as `48 / 64 / 96px`.
- Prefer named tokens/utilities. Arbitrary values must not create undeclared color or spacing systems.

## Components and primitives

Use semantic HTML and native browser behavior first. Astro components render static markup; small vanilla TypeScript scripts add the interactions that need them. Keep accessible names, focus behavior, keyboard support, and reduced-motion behavior explicit.

## Motion responsibilities

- CSS: simple hover/state transitions.
- Vanilla TypeScript: DOM interactions and animation state that need scripting.
- GSAP: bespoke authored choreography that benefits from a timeline, such as a signature/wordmark trace or a controlled entry sequence. Unused for now, and kept installed on purpose (owner, 2026-10-27); do not propose removing it.
- Do not use CSS animation and GSAP to drive the same effect.
- Respect `prefers-reduced-motion`; the final readable state must be immediately available without animation.
- The entry may be striking. The interior should become stark, quiet, and controlled.

## Typography and assets

Use Geist for display, IBM Plex Sans for body/interface copy, and IBM Plex Mono for genuine technical/meta content. Use committed local font assets; production rendering must not depend on a runtime remote-font request.

Use the actual Emmaki SVG wordmark assets when they are added to the repo; do not recreate the wordmark as ordinary text. Use black artwork on light surfaces and white artwork on dark surfaces.

## Reference material

OpenDesign preview/UI-kit material may be retained as design reference. Generated OpenDesign `system/` files, themes, manifests, and artifacts are historical/generated evidence only and must never override `docs/design-system/`.

Do not implement generated yellow-primary Ant-style buttons, yellow focus rings, brown yellow-text workarounds, or other stale artifacts from the OpenDesign generated layer.
