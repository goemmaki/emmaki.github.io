# Visual-polish backlog

Visual glitches and design fixes to work through after the Astro migration is merged (owner, 2026-11-01). Each item keeps the owner's own description of what they see; do not reinterpret it, and do not assume items share a cause or that a glitch is a layout shift. Notes below each description are the agents' and are clearly separated.

Fix order and agent choice: after the migration merges, one Codex run per related group, `gpt-6.1-sol` medium for diagnosis (rendering debugging), `gpt-6-luna` medium for agreed fixes. Each fix is checked by the owner in Chrome before the item is closed.

## Reported 2026-11-01, Chrome, Astro dev (3004) and production (3005); some intermittent

1. **Original refresh glitch.** "Still intermittently present. It's a split-second visual glitch, almost like elements briefly change size or appearance. Not an obvious layout shift."
   - Notes: present on Next before the migration. Investigation 2026-10-31 (`runtime/flash/report.md` on branch `design/astro-migration-20261031`, ignored) found and fixed four startup changes (clock, case-card grain, attribution width, bottom blur) but could not reproduce this one in headless Chromium. The owner's Chrome layer-borders/paint-flashing test showed the whole screen flashing green on F5, with some header elements later; no single layer identified.
2. **Client logos.** "Still glitching on hover in dark mode on both 3004 and 3005, despite the M8 crossfade fix. Light mode continues to be fine."
   - Notes: the M8 additive crossfade (`plus-lighter`) removed the measured gray dip in headless Chromium and Firefox; the owner still sees a glitch in real Chrome. Earlier history: `073ef9ba` (reverted crossfade), `runtime/flash/report.md` "Logo hover".
   - 2026-11-01 evening (3005, after the merge candidate): "Dark-mode logos still briefly glitch black when hovered to reveal their colours, even after the crossfade work. Light mode is fine."
3. **Home page, "Who I Am" header.** "The A/B/C links feel jerky. They're not as smooth, reactive or glide-y as they were in React. The CTA button has the same problem. The movement feels slower and less fluid than before the migration."
   - Notes: a migration regression (React → Astro).
   - 2026-11-01 evening (3005): "The 'I help X and Y to A, B and C' interactions are smooth now, although a little slow. I'm happy to leave them for now. Their timing can be refined later." The CTA buttons "feel good". Remaining: timing only.
4. **Menu opening and closing.** "There's a perceptible glitch in the page title, possibly elsewhere too. The text appears to get a hair smaller and stays that way just before the blurred overlay appears. The reverse happens when closing the menu. I don't remember this happening before."
   - Notes: likely a migration regression; the header is still the React `SiteHeader` island at the time of reporting.
   - 2026-11-01 evening (3005, header now native `<dialog>`): "Opening and closing the menu produces a very slight visual glitch. Text and imagery appear to shift a hair to the right, across multiple pages and both themes. It's mostly subtle but perceptible."
5. **Blog placeholder.** "There's occasionally what looks like an overlay grid. The menu background glitches between black and white, sometimes affecting the clock."
6. **Blog theatre masks.** "These are glitching now too."
   - Notes: "now" suggests a migration regression.
7. **About page, light mode.** "There's a visible glitch in the header."
8. **Blog header flashlight.** "The dark-mode spotlight seems larger than before. Not a major concern, but worth recording in case it's related."
9. **Cover pixelation.** "Working correctly in Chrome." — confirmed fixed (M5).
10. **Harvard case-study card.** "The noisy gradient appears to be fixed." — confirmed fixed (M8).
11. **Case-study sidebar.** "It's a little too long, and the bottom blur covers part of it. This isn't a new issue. It's a design problem to address later, not a migration blocker."
    - Notes: design work, not a glitch.

## Reported 2026-11-01 evening, owner's Chrome review of the merge candidate (production, 3005)

The owner is "very pleased with the migration"; these are minor but several sit in shared components, so they show on every page. The owner has two screenshots (menu in light mode, item 14; yellow graphic, item 19); they were not attached to the session and are not stored yet.

12. **Blog spotlight on reload.** "On the blog placeholder post, the spotlight/flashlight is inconsistent on F5 refresh. Sometimes it appears in the wrong initial state."
    - Fixed before the merge (the owner's one pre-merge fix). Cause: on reload Chrome sends a `pointermove` at the resting cursor; Next attached its listener after hydration and usually missed it, Astro's inline script sometimes caught it. `PostCover.astro` now ignores pointer moves until the mouse leaves its first reported position. This is also the Chromium parity failure and the `data-cover-torch` difference in M11. Awaiting the owner's Chrome check.
13. **Blog image flash.** "On F5 reload, the blog cover image visibly flashes in both light and dark modes. I don't notice it when navigating there from another page. The flash appears confined to the image."
14. **Menu in light mode.** "Unacceptable visually at present. The screenshot shows a nearly white menu overlay with extremely pale grey navigation text and icons. There's barely any contrast. Dark mode looks fine."
    - Notes: also a contrast (accessibility) problem, so first in line after the merge.
15. **Menu controls.** "A black square intermittently appears around the theme-switching and hamburger controls."
16. **Header visibility.** "On several pages, hovering near the top causes the hidden navigation header to appear. I'm undecided about this behaviour, but it's inconsistent, particularly after F5 refresh and in light mode. I'd like us to assess the UX convention and choose consistent behaviour later."
    - Notes: a decision for the owner first (assess the convention), then a consistency fix.
17. **Menu transition** — see item 4 (2026-11-01 evening note).
18. **Client logos, dark hover** — see item 2 (2026-11-01 evening note).
19. **Yellow Top Rated Seller graphic.** "This is an older design issue, not a migration regression. The thin horizontal rules look badly placed against the oversized circular O-shaped graphic. I dislike the composition. However, I intend to redesign these bento graphics anyway, so don't alter this now."
    - Notes: do not change; part of the owner's bento-graphics redesign.

Working well (owner, same review): CTA buttons; Home bento animations; FAQ Ctrl+F; FAQ piano-style opening animations; the JavaScript reduction.

Open items: 1–8, 11, 13–16 and 19 (12 awaiting the owner's Chrome check; 17 and 18 are tracked under 4 and 2).

## To do later (owner, 2026-11-03)

- Home hero at very wide screens (2560): the disk and portrait sit low. Revisit when the owner's real photos replace the AI stand-in.
- About globe: design real controls; the Globedots review slider and Starwind popover experiments were dropped.
- Gig card link arrow (owner, 2026-11-04): "a little too low and close to the edge. It does not feel like it sits deliberately in the card." Now 24px, bottom-right on the 12px inset, bottom-aligned with the video row (`GigCard.astro`). Not today.
- Bottom blur "seems higher than it was" (owner, 2026-11-04). Measured: the geometry (53svh tall, 17svh below the window, so it starts 64% down), its 8 layers and their masks are identical to the Next build of 2026-10-29 and unchanged since the blur was added (`f5ce86cc`, 2026-10-28). Lowering it means choosing a new start (about 75%, or a temporary switcher with 64/72/80%). Owner to pick.
- Client strip grows about 120px while it initializes (found by Codex, 2026-11-04; pre-existing).
- Tape cut before Resources (first pass, `a0bbd0df`): it leaves a reserved but empty band of about 300px above Resources; under reduced motion the second tape is hidden instead of shown already cut; the falling halves briefly cover the Resources heading. Owner refines it.
- My approach hover stack (first pass, `9a88ee5e`): the rotated first and last cards stick out about 24px past the content edges at rest; the card design is a placeholder.
