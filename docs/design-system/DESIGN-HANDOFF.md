# Emmaki design handoff

This directory — not the generated OpenDesign `system/` export — is the active source of truth for implementation.

## Read first

1. `README.md` — authority and precedence.
2. `DESIGN.md` — visual rules and composition posture.
3. `BRAND.md` — identity, color meaning, logo, and voice.
4. `colors_and_type.css` — semantic color/type tokens.
5. `tokens.css` — spacing/layout/shape tokens.
6. `ARCHITECTURE.md` — production stack and deployment constraints.

## Implementation contract

- Emmaki design rules override Luma/shadcn defaults. Luma is substrate, not identity.
- Monochrome carries hierarchy.
- Yellow = authored/brand activity: `#FCC300` at 8% / 14% / 24%, with solid `#FCC300` reserved for rare splash.
- Green = machine/system activity: theme-specific green at 8% / 14% / 24%, with crisp value only where genuinely useful.
- Neither yellow nor green is a semantic-state substitute.
- Yellow is not generic primary, link, CTA, text-emphasis, or focus color.
- Focus must be neutral/high-contrast and clearly visible.
- Preserve the two spacing registers and named shell/gutter/reading values.
- Preserve Geist / IBM Plex Sans / IBM Plex Mono roles.
- No serif.
- No generic SaaS visual language, AI clichés, invented evidence, or card-dashboard repetition.
- No active recurring underline/highlight/circle/bracket/strike/scribble identity language.
- Use actual SVG brand artwork; do not fabricate a yellow wordmark.

## OpenDesign provenance

The original OpenDesign package is useful evidence, especially its focused previews and UI-kit examples. However, generated `system/` output encoded an older yellow-primary interpretation and a generic handoff that incorrectly pointed implementers to `system/index.html`. That guidance is superseded.

If a generated artifact conflicts with this directory, ignore the generated artifact.

## Motion

A bespoke entry sequence may be more expressive than the rest of the site. Use GSAP when timeline choreography is justified, Motion for normal UI transitions, and CSS for simple states. After entry, movement should settle into a quiet, controlled interior. Always provide a reduced-motion path that presents the finished state immediately.

## Fidelity checks

Before calling a design complete, verify:

- dark and light themes both work;
- keyboard focus is visible;
- no yellow/brown foreground workaround has crept back in;
- yellow and green activity registers are not being used as semantic state;
- spacing uses the declared registers instead of convenience values;
- the page reads as a senior writer/strategist with technical fluency, not an AI startup or developer-tool landing page;
- client proof and technical claims are real and sourced.
