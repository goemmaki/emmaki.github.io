# Session handoff: overnight checks and morning fixes (2026-11-04)

Current handoff. It replaces [20261103-home-sections.md](20261103-home-sections.md) for what's next; that file keeps the home-sections detail and its open items, which still stand. History: [journal](../journal/20261104-overnight.md).

## State

- `review/overnight-20261104` in `~/worktrees/fiverr-portfolio/overnight-20261104`, local only, on top of `design/h1-options-20261103`. Check and build pass. Nothing pushed; `design/foundation` unchanged.
- Dev server: http://localhost:3004 from this worktree.

## Owner decisions (2026-11-04)

- Dark is the default theme on a first visit, always; visitors switch with the toggle.
- JavaScript stays where it's used; no no-JS fallbacks required.
- The globe stays decorative and never gets controls back; it stops off screen, and without a graphics card it's a still on Europe with Crete.
- The client logo strip is one global component; About uses Home's.
- WebKit-only issues are ignored for now. The Lighthouse desktop-settings bug is left as is.

## Later today (owner)

These change how something looks; the owner will go through them:

1. Globe keeps spinning after reduced motion is switched on mid-visit (A-01).
2. Caution tape's displacement filter lacks `in2` (A-13; invalid HTML, fixing may change the tape's edges).
3. Logos and the blog cover could be served at responsive sizes (A-08).
4. Approach step numbers' contrast, 3.36:1 light and 4.42:1 dark (A-17): decorative, or darker/brighter? This is Home's 0.97 accessibility.
5. Logo and hover-avatar loading: decode everything up front, or defer (A-09).

## Later, not now

- SEO, all of it: per-page titles and descriptions, social cards, JSON-LD, touch icon, `robots.txt`, then canonical and sitemap once `site` is set at launch (A-14, A-18).
- Unused `cobe` and Starwind wrappers (A-19) need a separate cleanup authorization.
- Write the agreed model split into `overnight-review.md` and `end-of-day.md`: measure on Luna medium, code review on Sol high (parallel), judge on Sol medium, fixes and after-checks on Luna medium, quick checks on Luna medium.

## Watch-outs

- Screenshot comparisons on this site are noisy (logo roll, clock): compare an old build with itself first and judge against that.
- Codex's sandbox couldn't commit in second-brain worktrees tonight even with `writable_roots` set; site worktree commits weren't tried.
