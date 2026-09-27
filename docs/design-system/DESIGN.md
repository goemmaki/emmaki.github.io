---
name: "Emmaki"
category: Brands
surface: web
colors:
  canvas: "#000000"
  raised-surface: "#1a1a1a"
  primary-text: "#ededed"
  secondary-text: "#a0a0a0"
  brand-yellow: "#fcc300"
---

# Emmaki

*Senior B2B writing and strategy for complex offers.*

Emmaki is a premium, human-led B2B writing and strategy brand with technical fluency. The design system is dark-first, editorial, monochrome, and precise. Human judgment is the visible layer; technical systems sit underneath it.

## Color palette

Neutral canvas, surfaces, text, and one-pixel structure do almost all hierarchy. Yellow and green are ambient signal families layered on top of that neutral system; semantic colors are reserved for genuine interface state.

| Role | Token family | Usage |
| --- | --- | --- |
| Neutral foundation | canvas / surfaces / text / borders | Default hierarchy, structure, controls, reading, and layout. |
| Authored activity | yellow ghost / motif / active / splash | Emmaki brand presence and human/authored activity. 8% / 14% / 24% tiers; solid `#FCC300` only as a rare splash. |
| Machine activity | system green ghost / motif / active / crisp | Ambient machine/system activity and instrumentation only. Never semantic success. |
| Semantic state | success / warning / error / info | Actual UI state only, with text/icon support where needed. |

### Yellow rules

- Canonical hue: `#FCC300`.
- Tiers mirror the green system structurally: ghost `8%`, motif `14%`, active `24%`, plus solid `#FCC300` as the rare splash value.
- Yellow is **not** the generic primary color for buttons, links, focus rings, selected text, badges, or headings.
- Do not use yellow as body/foreground text on light surfaces.
- Do not create a darker brown/yellow text workaround such as `#765B00`.
- Use neutral hierarchy first. Add yellow only when a restrained authored/brand signal materially improves the composition.

### Green rules

- Light base: `#1A9F0B`; dark base: `#48CD39`.
- Tiers: ghost `8%`, motif `14%`, active `24%`; crisp is `#147809` in light mode and `#48CD39` in dark mode.
- Green means machine/system activity only. It never means success, approval, availability, or generic positive state.

### Focus and interaction

Focus must remain clearly visible in both modes, but it should be neutral/high-contrast rather than a brand-color effect. Yellow and system green must never be the sole focus indicator.

## Typography

- **Display:** Geist.
- **Body/interface:** IBM Plex Sans.
- **Mono/technical:** IBM Plex Mono.
- No serif family.

Use IBM Plex Mono only when the content is genuinely metadata, technical annotation, a kicker/eyebrow, or a compact factual label. Do not turn ordinary prose into terminal cosplay.

## Voice and tone

- **Adjectives:** senior, commercially grounded, intelligent, precise, confident, human, distinctive.
- **Tone:** calm authority. Lead with buyer stakes, clarify difficult offers, and connect recommendations to trust or action. AI is a capable part of the process, never the identity or a substitute for judgment.

### Messaging pillars

- **Senior commercial judgment:** deep writing and conversion experience applied to what buyers need to understand, trust, and do.
- **Complexity made clear:** find the sharp commercial angle, then express it distinctively and precisely.
- **Human-led scale:** use AI, agents, and knowledge-grounded workflows where they help; keep high-stakes strategy under experienced editorial judgment.

## Imagery

- Editorial and typography-led, with restrained technical texture.
- Use real products, places, people, screenshots, or client evidence when supplied and relevant.
- Preserve content-bearing image proportions and intentional crops.
- Avoid robots, circuit boards, glowing brains, generic AI imagery, fabricated dashboard data, fake logos/certifications, decorative gradients, neon effects, crowded marketplace-thumbnail conventions, and generic stock substituted for a named real subject.

## Layout and spacing

- **Control radius:** 2px canonical unless a later explicit visual decision supersedes it. The Luma preset's radius setting is implementation substrate, not brand authority.
- **Border weight:** 1px neutral structure.
- **Interface spacing:** 4 / 8 / 12 / 16 / 24 / 32px.
- **Editorial spacing:** 52 / 84 / 136px.
- **Exceptional hero spacing:** 220px only when composition genuinely needs it.
- **Gutters:** desktop 32px; mobile 24px; below about 400px, 16px only for layout survival.
- **Shells:** standard max 1200px; wide visual max 1400px.
- **Reading measure:** 640–700px.

Use centered shells, local grids, named areas, and content-shaped composition. Do not impose a universal 12-column grid. Do not introduce convenience spacing such as 48 / 64 / 96px as a parallel scale.

## Composition posture

- Dark-first, with a genuine light mode.
- Stark, controlled, expensive, and authored rather than busy or generic.
- Portfolio/case-study pages should read like editorial spreads, not dashboards.
- Fiverr compositions should usually reduce to one headline, one proof cue, and one visual anchor.
- Monochrome does the hierarchy. Yellow and green are signal layers, not hierarchy substitutes.
- No active editorial-mark grammar for now: no recurring highlights, underlines, circles, brackets, strikes, scribbles, or marker effects as identity motifs.
- Do not invent client proof, metrics, credentials, technical metadata, or certification marks.

## Motion

The entry may be more authored and choreographed than the interior. A signature/wordmark trace or other bespoke sequence may use GSAP when justified. After entry, motion becomes sparse and controlled. Use Motion for ordinary UI transitions, CSS for simple state changes, and GSAP only for sequences that need timeline choreography. Respect `prefers-reduced-motion`; reduced-motion mode must reveal the completed state without requiring animation.

Avoid perpetual decorative movement, floating AI blobs, gratuitous parallax, and motion that competes with the writing.
