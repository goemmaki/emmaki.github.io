# Visual-polish backlog

Visual glitches and design fixes to work through after the Astro migration is merged (owner, 2026-11-01). Each item keeps the owner's own description of what they see; do not reinterpret it, and do not assume items share a cause or that a glitch is a layout shift. Notes below each description are the agents' and are clearly separated.

Fix order and agent choice: after the migration merges, one Codex run per related group, `gpt-6.1-sol` medium for diagnosis (rendering debugging), `gpt-6-luna` medium for agreed fixes. Each fix is checked by the owner in Chrome before the item is closed.

## Reported 2026-11-01, Chrome, Astro dev (3004) and production (3005); some intermittent

1. **Original refresh glitch.** "Still intermittently present. It's a split-second visual glitch, almost like elements briefly change size or appearance. Not an obvious layout shift."
   - Notes: present on Next before the migration. Investigation 2026-10-31 (`runtime/flash/report.md` on branch `design/astro-migration-20261031`, ignored) found and fixed four startup changes (clock, case-card grain, attribution width, bottom blur) but could not reproduce this one in headless Chromium. The owner's Chrome layer-borders/paint-flashing test showed the whole screen flashing green on F5, with some header elements later; no single layer identified.
2. **Client logos.** "Still glitching on hover in dark mode on both 3004 and 3005, despite the M8 crossfade fix. Light mode continues to be fine."
   - Notes: the M8 additive crossfade (`plus-lighter`) removed the measured gray dip in headless Chromium and Firefox; the owner still sees a glitch in real Chrome. Earlier history: `073ef9ba` (reverted crossfade), `runtime/flash/report.md` "Logo hover".
3. **Home page, "Who I Am" header.** "The A/B/C links feel jerky. They're not as smooth, reactive or glide-y as they were in React. The CTA button has the same problem. The movement feels slower and less fluid than before the migration."
   - Notes: a migration regression (React → Astro).
4. **Menu opening and closing.** "There's a perceptible glitch in the page title, possibly elsewhere too. The text appears to get a hair smaller and stays that way just before the blurred overlay appears. The reverse happens when closing the menu. I don't remember this happening before."
   - Notes: likely a migration regression; the header is still the React `SiteHeader` island at the time of reporting.
5. **Blog placeholder.** "There's occasionally what looks like an overlay grid. The menu background glitches between black and white, sometimes affecting the clock."
6. **Blog theatre masks.** "These are glitching now too."
   - Notes: "now" suggests a migration regression.
7. **About page, light mode.** "There's a visible glitch in the header."
8. **Blog header flashlight.** "The dark-mode spotlight seems larger than before. Not a major concern, but worth recording in case it's related."
9. **Cover pixelation.** "Working correctly in Chrome." — confirmed fixed (M5).
10. **Harvard case-study card.** "The noisy gradient appears to be fixed." — confirmed fixed (M8).
11. **Case-study sidebar.** "It's a little too long, and the bottom blur covers part of it. This isn't a new issue. It's a design problem to address later, not a migration blocker."
    - Notes: design work, not a glitch.

Open items: 1–8 and 11.
