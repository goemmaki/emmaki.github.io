# Site plan

The owner's plan for the site's pages, Home's sections, and how the site is judged (2026-10-28). Work items move into a handoff when they start. When a decision here changes, update it here.

**Now: a barebones launch site.** Everything below marked "later" waits until after launch.

## What each page is for

| Page | Its job |
|---|---|
| Home | Discovery: who emmaki is, what can be hired, proof at a glance, the way to hire |
| About | Personality: what emmaki is like as a work partner |
| Proof | Evidence that the work delivers |
| Brands | Social proof: who emmaki has written for |
| Blog | Things the owner writes |
| Services | Later: its own page, and in the main navigation labeled "Services" |

The design must never get in the way of any of these. The site can stay a distinctive creative portfolio. What conversion work has to make sure of: someone who wants to commission writing can identify the right service, see convincing evidence, and find a way to hire without searching.

## Home

### Now (launch)

1. **Hero.** A full first screen with only the button. The giant word was dropped on 2026-10-28.
2. **Client logos.** The slot strip, starting at the fold so it shows within the first few pixels of scrolling. Fiverr is first and always rolls last.
3. **Who I am, with the case studies in it.** A kicker and a positioning line ("I help X and Y to A, B, C, without FGH.", a placeholder). A, B and C each link to a case study. Under a mouse, a preview card trails the pointer showing the result as a figure, a line on the work, and the client. This follows grafit.agency's "Who we are"; the behavior was studied, no code or assets were copied. Fiverr may be one of the case studies in a few weeks (owner, 2026-10-28).
4. **Why me** (owner, 2026-10-28). The "Why me" kicker, then the credibility boxes on one-pixel rules, after grafit.agency's "Why Us": four squares, then three wider boxes, at the original grid's height. Squares: Top Rated Seller (since 2015, the most prestigious, so first), 4.8k orders, 2.6k clients, and years on Fiverr (joined December 2013, so it goes up every January 1). Wider boxes: Pro Verified (since 2017), the Tel Aviv invitation ("Invited to Tel Aviv to deliver leadership feedback", labeled "In 2018"), and Cannon Brooke's review with his photo, gray until hover. Counts are from the owner's Fiverr profile on 2026-10-28; the labels are Claude's stand-ins for the owner's copy.
   - **Grouped Swiss treatment (2026-10-28):** each figure and label stay together with a 12px gap. Top Rated Seller sits bottom left, orders in the middle, clients bottom left in lighter type, and years top left. Pro Verified sits at the top of its wider box; the Tel Aviv sentence and date sit together in the middle. Cannon's quote leads a vertical stack: square photo, name, role and company on separate lines. The wider boxes have 32px desktop insets to separate the invitation and quote. Type scales with its box; below 64rem the squares form two columns and the wider boxes span both. Hover gently scales each figure/label block inward as a unit, only Top Rated Seller fills yellow with black text, and Cannon's photo comes out of grayscale. Motion is limited to a fine pointer with hover support and stops under reduced motion.
   - **Hover posters (2026-10-28):** typography, spacing and copy stay fixed. Seven hover-only Swiss poster compositions sit behind the type: a cropped black disk and slash on yellow for Top Rated Seller; sliding moiré lines for orders; cursor-driven halftone dots for clients; concentric rings for years; sweeping diagonal bars for Pro Verified; a staggered modular grid for Tel Aviv; and a massive cropped quotation shape revealed through an SVG mask for Cannon. A soft halo of the box color behind the figures and quote, and a strip of it behind each mono label, protect their contrast (the opaque backings were too heavy, owner, 2026-10-28). Geometry uses the theme’s foreground ink, inverting in light mode; yellow retains black ink. Graphics are clipped to their cell, hidden on touch and under reduced motion. CSS timelines and the halftone frame loop stop on leave; the halftone also stops when motion/pointer preferences change or the tab is hidden. No new headings, copy, dependencies, images or fonts.
   - References were studied for behavior only; no code, text or assets copied.
   - **Cut the same evening, kept as darlings** in `src/components/darlings/`: the testimonial box, the reveal text beside it and the sideways benefit cards (journal, "Killing your darlings").
   - **Benefits content (Claude's recommendation, 2026-10-28):** client-focused. Each benefit takes one buyer worry (understanding the product, voice, effort, reliability, results) and says what the client gets.
5. **The old "Why me" placeholder,** kept until the owner decides whether section 4 replaces it.
6. **Closing.** The Fiverr invitation every main page shares (`PageClosing`).

The services list (`services.tsx`) was on Home under the logos. The owner removed it on 2026-10-28 because it was too big for Home, and kept it unmounted as a darling to revive elsewhere. Services still belong on Home, in a smaller form (below).

### Target order

Recommended by the owner's research (next section):

1. **Hero:** who emmaki is, what emmaki does, the main next action.
2. **Services:** a short overview of what clients can buy.
3. **Client logos:** recognizable brands, Fiverr first.
4. **Selected work:** relevant projects and writing samples, as cards, each linking to its case study on Proof.
5. **Proof:** a strong testimonial or measurable outcome.
   - Testimonial cards have photos of the reviewers.
   - One relevant quote fixed in place, then quotes drawn from a pool tagged by relevance.
6. **About preview:** a short personal introduction.
7. **Closing:** a clear route to hire.

Logos, work and testimonials make three layers of proof: who (logos), what (work) and how it was to work together (testimonials).

**Test, don't assume, the order of Services and logos.** Compare Hero → Services → Logos against Hero → Logos → Services once traffic allows. The evidence favors Services first, but no controlled test shows which wins for a portfolio.

## Proof

Final design for now (owner, 2026-10-29). The cover reads "Proof." with a yellow full stop (the owner hasn't decided on the yellow yet), the owner's intro beside it, then the index and the shared closing. The index holds six placeholder case studies; each row links to `/proof` until the case-study pages exist.

- **List:** after gorantrickovski.design's works list. Full-ink one-pixel rules and tight rows. Client, Project and Work labels head the columns. Client names are in the Brands typography at 4rem at full width, scaling down with the list. Project and work are 20px bold white, after supersolid.agency's list.
- **Hover or keyboard focus:** an arrow slides in before the name, a word space from it, pushing the name over. The name fills with the brand-to-companion gradient with moving grain. A faint gray dot screen swells around the pointer behind the row, after shortscut.com. Effects come on in 0.2s and fade over 0.5s, so a pointer run down the list leaves a short trail.
- **Touch:** the arrows always show and the metadata sits under the name on phones.
- **Reduced motion:** a still gradient and dot frame, no movement.
- **Tried and dropped (2026-10-29):** a trailing preview card (every design rejected), six name sizes and six dot screens compared row by row (the 4rem name and the pointer screen won), an "All success stories (6)" heading, and the closing scrolling over the end of the list (it hid the last row).

## Case study template

`/proof/placeholder` (2026-10-29) is blocked out to design the case-study pages from, after grafit.agency's case studies. It has the breadcrumb (the shared `Breadcrumb`, also on blog posts), a lorem headline at the blog title's size, and a frame of lines in grafit's proportions. The frame starts just over halfway down the first screen and runs past it, to invite the scroll. Below it are a sticky column of placeholder facts and placeholder sections in the blog's sizes. Not indexed by search engines.

- **Note (owner, 2026-10-29):** the frame gets the Proof index's noisy, moving gradient across the whole grid, in each case study's client brand color, with faint lines over it. The design may take a few rounds.

## The research behind the order (owner, 2026-10-28)

Published case studies the owner found. Claude hasn't checked the sources. Each one changed several things at once, so none isolates a single change, and they measured different outcomes on different sites.

| Source | Change | Result |
|---|---|---|
| Experiment Zone, for N-able | Shorter hero and clearer offer; products moved above social proof; less company information; CTAs on product categories | +41% free-trial requests from homepage visitors |
| Convert, for OuterBox (commercial insurance) | Clearer product categories, more informative previews, stronger explanation of the provider; 4-week 50/50 test | +32.14% progression toward a quote |
| (un)Common Logic, B2B construction | Navigation labels and structure, found from analytics and heatmaps | +200% sample orders, +21% pages per session |
| Optimizely, January 2026 | Homepage tailored to the business visitor's interests | +67% homepage click-through (engagement, not inquiries) |
| Optimizely, January 2026 | Important B2B content moved higher on the homepage | +103% CTA clicks; lead generation not significantly changed |
| Contentsquare, July 2026 | Interactive homepage | +35% session time; the conventional homepage first brought more demo requests |

What follows for emmaki:

- **Showing what can be hired may matter more than showing who has hired.** Hence Services above the logos.
- **Label it "Services",** not something clever. Making the offer easy to find is what the navigation test rewarded.
- **Clicks and time on site are not conversions.** See "Measuring the Fiverr handoff".
- **Every page's call to action fits where the visitor is:**
  - A case study links to its service.
  - A service links to a sample and a way to hire.
  - About links to work that shows the owner's approach.
- **"buy emmaki" in the footer is a playful graphic,** not a conversion mechanism. Each page load picks "try", "fly" or "buy".

## Two kinds of visitor (later)

| Coming from Fiverr | Coming from LinkedIn |
|---|---|
| Already evaluating the work | Discovering what's on offer |
| Needs evidence of quality | Needs clear services, then evidence |
| Case studies and reviews matter | Services and relevant projects matter |
| Hires through Fiverr | Hires directly or through Fiverr |

- Keep one site, with the ways to get in touch varying by route.
- Fiverr allows portfolio links but forbids taking its buyers off the platform. So the Fiverr route offers only Fiverr, with no independent contact options.
- Mark the route with a dedicated URL, not `document.referrer`. Browsers and sites can suppress the referrer, so it isn't a reliable safeguard.

## How Home must behave

- **Information comes first.** Easy to find and quick to scan, especially on phones.
- **No false floors.** No section may look like the end of the page and stop the scroll. Every screen lets the next section peek in from the bottom.
- **Animation rewards interaction, never delays information.** Reading, clicking and navigating are never held up by motion. Content is never hidden until an animation finishes.
- **Core Web Vitals,** at the 75th percentile, phone and desktop:

  | Metric | Target |
  |---|---|
  | LCP | 2.5 s or less |
  | INP | under 200 ms |
  | CLS | under 0.1 |

## Measuring the Fiverr handoff

The main commercial outcomes are qualified inquiries and Fiverr orders that can be attributed to the site. Engagement doesn't count: more visits to Services or Proof aren't wins if those visitors never inquire. The site should pass on qualified interest, not invite curiosity clicks.

- **GA4.** Enhanced measurement detects outbound link clicks on its own. A click shows intent, not an order.
- **One event per Fiverr link,** with where it was clicked, so clicks can be compared by origin:
  - navigation (header, menu, footer)
  - hero
  - case studies
  - closing call to action
- **Break the results down** by device and by traffic source.
- **Compare with Fiverr inquiries and orders.** The owner does this by hand, because agents never contact Fiverr.
- **Judge intent by what happened before the click.** A visitor who reads three case studies and then clicks is a different lead from one who clicks in the first five seconds. Record what the visitor did before the click (case studies opened, time on site) as event parameters.
- **To decide before GA4 goes in:**
  - Cookie consent: GA4 sets cookies, and the owner is in the EU.
  - Where the measurement ID is kept.

## Header and footer

- **Launch:** the clock stays in the header.
- **Later:**
  - The footer grows with the site, and could hold an always-available hire button.
  - Services goes into the main navigation, probably as a mega menu.
- **Claude's earlier suggestion, not taken for launch:** a hire button in the header in place of the clock. The header returns on any scroll up, so the button would be one gesture away. It would also end the clock's contrast failure over the post photo, which stays open.

## Open questions

- **The client strip drops cells on narrower screens:** 5 columns at 1024px and up, 3 from 640px, 2 below that. Every client still rolls through, but fewer show at once, and the owner wants this fixed. The options:
  - a smaller cell and logo size that keeps more columns
  - two rows on phones

  Decide by looking at both in the browser.
- **Sideways swipes in the Why me section.** Only vertical scrolling drives it. Claude tested this on 2026-10-28 with emulated touch in Chrome at 375px:
  - Vertical swipes advance it and take it back.
  - Diagonal swipes lock to their main axis.
  - Straight sideways swipes do nothing.
  - The page never scrolls sideways.

  A visitor who instinctively swipes left gets no response. The option, not built: map a sideways swipe inside the section to the same progress as a vertical one. Real iPhone Safari is untested.
- **Where the personal introduction goes** on Home before the About preview exists.
