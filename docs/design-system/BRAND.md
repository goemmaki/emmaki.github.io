# Emmaki brand

Emmaki is a premium, human-led B2B writing and strategy brand with technical fluency. Writerly and commercial judgment lead; AI, automation, and agentic systems support the work rather than defining the identity.

## Color roles

The neutral system carries hierarchy. Yellow and green are ambient signal families with parallel intensity tiers but different meanings.

### Yellow — authored/brand activity

- Canonical hue: `#FCC300`.
- Ghost: `8%` alpha.
- Motif: `14%` alpha.
- Active: `24%` alpha.
- Splash: solid `#FCC300`, used rarely.

Yellow is not a generic primary UI color. Do not use it by default for CTA fills, ordinary links, focus rings, body text, headings, selected text, badges, or status. Do not create a dark brown substitute to force yellow into foreground text.

### Green — machine/system activity

- Light: `#1A9F0B` at `8% / 14% / 24%`, crisp `#147809`.
- Dark: `#48CD39` at `8% / 14% / 24%`, crisp `#48CD39`.

Green is reserved for machine/system instrumentation and ambient activity. It never communicates success or other semantic state.

### Semantic states

Success, warning, error, and information are separate semantic colors used only when the interface actually has that state. They do not inherit meaning from the yellow or green brand/activity registers.

## Typography

- Geist carries display hierarchy.
- IBM Plex Sans carries body and interface copy.
- IBM Plex Mono carries genuine metadata, technical annotation, eyebrows, kickers, and compact factual labels.
- No serif family.

## Layout

Use 2px corners unless explicitly superseded by a later visual decision, one-pixel neutral structure, interface spacing `4/8/12/16/24/32px`, editorial spacing `52/84/136px`, and `220px` only for exceptional hero use.

The system should feel spacious without becoming soft or generic. Negative space is compositional, not merely padding.

## Logo

The supplied filled Emmaki wordmark SVG is the primary identity: black on light surfaces and white on dark surfaces. Use the matching SVG in headers, covers, and branded compositions. Write “Emmaki” in prose and ordinary labels. Never create a yellow wordmark variant. The speech bubble is optional and subordinate.

## Interaction and motion

Controls should be at least 44px high where touch interaction requires it and must have visible keyboard focus. Focus is neutral/high-contrast, not yellow or green.

The entry experience may use authored choreography; the interior should settle into calm, restrained movement. Prefer CSS for simple state transitions, Motion for ordinary UI transitions, and GSAP for bespoke timelines such as a signature trace. Respect reduced-motion preferences.

## Mark language

There is no active recurring editorial-mark grammar at present. Do not turn highlights, underlines, circles, brackets, strikes, scribbles, marker strokes, or similar devices into a default brand motif unless the system is explicitly revised later.

## Content and evidence

Use concise, relevant copy in examples. Never expose internal token/source documentation in user-facing examples. Never invent client proof, metrics, credentials, logos, technical metadata, or certification marks.
