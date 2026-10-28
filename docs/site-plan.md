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
3. **Closing.** The Fiverr invitation every main page shares (`PageClosing`).

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
- **Where the personal introduction goes** on Home before the About preview exists.
