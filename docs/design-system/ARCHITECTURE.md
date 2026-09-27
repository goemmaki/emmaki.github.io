# Emmaki site implementation architecture

This document governs how the Emmaki website is implemented and shipped. `DESIGN.md` and `BRAND.md` govern the visual/brand system; this file governs production architecture.

## Current foundation

The portfolio repository is `goemmaki/emmaki.github.io`. The working foundation created on 2026-09-27 is:

- Next.js App Router 16.3.6
- React 19.2.8
- TypeScript
- Tailwind CSS v4
- shadcn/ui 4.21.0 using Base UI
- shadcn preset `b3XpCk5D6Y` (Luma, Neutral, IBM Plex Sans body, Geist heading, Lucide, translucent menu, subtle menu accent)
- Motion 13.4.4
- GSAP 3.15.0
- Lucide through the shadcn preset
- pnpm

The Luma preset is **implementation substrate only**. It does not define Emmaki's color semantics, spacing system, typography roles, radius policy, or visual identity. When Luma/shadcn and the Emmaki design-system docs disagree, the Emmaki docs win.

## Runtime and deployment

The target is a fully static GitHub Pages site.

- Use Next.js App Router with static export enabled (`output: "export"`).
- Deploy the exported output through GitHub Actions. Visitors must not need a running Node process.
- `goemmaki/emmaki.github.io` is a GitHub Pages user site, so the production site is expected at the domain root; do not add a project-site `basePath` unless the hosting topology changes.
- Keep essential content and render-time assets available to the build without runtime CMS/backend dependencies.
- Use only routes that can be generated at build time; parameterized pages must enumerate their route set during the build.

Do not use SSR, Server Actions, runtime API routes/route handlers, runtime databases, runtime CMS dependencies, server middleware, or any feature requiring a persistent server process.

## Design-token enforcement

`colors_and_type.css` and `tokens.css` are the reusable implementation foundations. Tailwind/shadcn must consume these roles rather than establishing a competing theme.

- Neutral canvas, surface, text, and structural-alpha tokens are the default hierarchy.
- Yellow is authored/brand activity with `8 / 14 / 24%` ghost/motif/active tiers and rare solid `#FCC300` splash. It is not generic `primary`.
- Green is machine/system activity with `8 / 14 / 24%` tiers and theme-specific crisp values. It is not semantic success.
- Semantic success/warning/error/info remain separate.
- Focus is neutral/high-contrast. Do not rely on yellow or green as the sole focus indicator.
- Preserve the interface spacing register `4 / 8 / 12 / 16 / 24 / 32px`.
- Preserve the editorial spacing register `52 / 84 / 136px` and exceptional `220px` hero value.
- Do not introduce a parallel convenience scale such as `48 / 64 / 96px`.
- Prefer named tokens/utilities. Arbitrary values must not create undeclared color or spacing systems.

## Components and primitives

Use shadcn/Base UI for appropriate accessible primitives. Install only components the site actually needs; do not copy the catalogue wholesale.

shadcn/Base UI supplies behavior and accessible interaction structure. Emmaki supplies visual identity. Components must consume Emmaki semantic tokens rather than default shadcn palette assumptions.

The current Luma settings — including its translucent menu and spacious component posture — are useful starting behavior, not brand law.

## Motion responsibilities

- CSS: simple hover/state transitions.
- Motion: ordinary React/UI transitions.
- GSAP: bespoke authored choreography that benefits from a timeline, such as a signature/wordmark trace or a controlled entry sequence.
- Do not use Motion and GSAP to drive the same effect.
- Respect `prefers-reduced-motion`; the final readable state must be immediately available without animation.
- The entry may be striking. The interior should become stark, quiet, and controlled.

## Typography and assets

Use Geist for display, IBM Plex Sans for body/interface copy, and IBM Plex Mono for genuine technical/meta content. The project may use Next/font or committed assets as appropriate, but production rendering must not depend on a runtime remote-font request.

Use the actual Emmaki SVG wordmark assets when they are added to the repo; do not recreate the wordmark as ordinary text. Use black artwork on light surfaces and white artwork on dark surfaces.

## Reference material

OpenDesign preview/UI-kit material may be retained as design reference. Generated OpenDesign `system/` files, themes, manifests, and artifacts are historical/generated evidence only and must never override `docs/design-system/`.

Do not implement generated yellow-primary Ant-style buttons, yellow focus rings, brown yellow-text workarounds, or other stale artifacts from the OpenDesign generated layer.
