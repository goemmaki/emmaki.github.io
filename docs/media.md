# Media conventions

How images, SVGs, screenshots and video go into the site. Astro's built-in image handling (`astro:assets`, sharp) does the processing; there is no separate media system. Check current Astro 7 image APIs in the official docs before using a new one.

## Where source files live

- **Post or project media:** next to its entry, in `src/content/blog/<slug>/` or `src/content/work/<slug>/`, referenced with a relative path (`./chart.png`). Astro processes these and writes `width` and `height`.
- **Shared site images** (portraits, textures used by components): `src/assets/<area>/`, imported in the component.
- **`public/`** only for files that must keep a fixed URL or are served untouched: the favicon, social cards, and existing files already referenced by URL (blog covers, client logos, testimonial photos). Nothing in `public/` is optimized, so don't add new photos there.
- Commit the largest clean source you have (at least 2× the largest display width, ideally a lossless PNG or a high-quality JPEG). Astro makes the smaller sizes; never commit pre-shrunk copies.
- File names: lowercase, hyphenated, descriptive (`harvard-email-before.png`, not `Screenshot 2026-11-01 at 10.14.png`).

## Output formats and sizes

- Photos and screenshots render through `<Picture>` from `astro:assets` with `formats={['avif', 'webp']}` and `widths` matched to the layout (for a 700px article column: `[350, 700, 1050, 1400]`, `sizes="(min-width: 768px) 700px, 100vw"`). The fallback `<img>` format is WebP.
- Markdown images in MDX (`![alt](./file.png "caption")`) go through Astro automatically. A lone image becomes a `<figure>`, and its title becomes the caption (`src/lib/collection-sections.ts`).
- Never hand-write `<img src="/...">` for new content; it skips optimization and dimensions.

## SVGs

- Line art, diagrams, logos and icons stay SVG. Run them through SVGO (or export minified) before committing, and make sure they have a `viewBox`.
- Decorative inline icons: `aria-hidden="true"` and `currentColor`, so the theme colors them.
- Client logos follow `.claude/skills/client-logo/SKILL.md`.

## Screenshots

- Capture at 2× device pixel ratio, crop to the point being made, and hide personal data or anything a client hasn't approved.
- Save as PNG source; Astro converts. Real product screenshots of client work need the client's permission recorded in the entry's notes.

## Video

- Short loops (under 15s, no sound): MP4 (H.264) plus WebM (VP9 or AV1), with `muted`, `playsinline`, `loop`, a `poster` image, and `preload="none"` unless the video is in the first viewport. Keep each file under about 2 MB; longer or larger footage goes to an external host (YouTube or Vimeo, loaded only on click).
- Store video sources in `public/video/<area>/`, since Astro doesn't process video.
- Autoplaying video must honor `prefers-reduced-motion` (show the poster instead).

## Loading priority

- The largest image in the first viewport (the LCP image) gets `loading="eager"`, `fetchpriority="high"`, and, for a CSS or JS-loaded image, a `<link rel="preload" as="image">` in the page head (as the blog cover does).
- Everything else uses `loading="lazy"` and `decoding="async"`, which is the `astro:assets` default.
- Always provide intrinsic dimensions (Astro does this for processed images) so nothing shifts while loading.

## Alt text

- Describe what the image shows that the text doesn't, in one sentence, in American English. Don't start with "Image of".
- Decorative images (textures, covers that repeat the title, duplicates of nearby text) use `alt=""`.
- Charts and diagrams: alt says what the chart shows and its main finding; put the data or full explanation in the text or a caption.
- Screenshots of copy: alt summarizes the point, and the copy that matters is quoted in the body.
- Captions are for the reader, alt is for someone who can't see the image; don't repeat one in the other.
