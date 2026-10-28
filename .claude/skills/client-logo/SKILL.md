---
name: client-logo
description: Add a new client to the emmaki site, or replace a client's logo, in the Home client strip (public/clients, BRANDS and CLIENT_STRIP_ORDER in src/lib/content.ts). Use when the owner names a new client or a logo looks wrong.
---

# Add or update a client logo

The client strip on Home (`src/components/client-slots.tsx`) shows every brand in `BRANDS` (`src/lib/content.ts`). At rest the logos are monochrome by CSS filter. On hover each one shows its own file for the current theme, in its real colors. So every client needs two files in `public/clients/`, both trimmed to their ink:

- `light`: for the light theme, readable on white
- `dark`: for the dark theme (the default), readable on black

Every client the owner names is confirmed. Don't add "pending verification" notes.

## Rules

- Never load, curl or scrape fiverr.com or upwork.com, not even for a logo. Fiverr's files come from Brandfetch.
- Use the brand's own logo files. Don't redraw them, and don't take files from a reference site.
- Commit only the two final files per client. Raw downloads and screenshots go in the ignored `runtime/logos-raw/`.

## Steps

1. **Fetch.** Use the Brandfetch MCP: `get_brands` for several clients, `get_brand_data` for one. Download the `src` URLs into `runtime/logos-raw/`. Prefer, in this order:
   - SVG over PNG
   - the full logo (symbol plus name) over the icon alone
   - one variant for light backgrounds and one for dark backgrounds
2. **Check what you got.** Look at each file before using it. Brandfetch is sometimes wrong. Seen so far:
   - Spectral Core's "logo" was an award badge.
   - MHC Digital Group's current file is only an icon.

   When the file is wrong, report it with `send_feedback`. Then capture the lockup from the client's own website instead (header or footer): a Playwright element screenshot with `omitBackground: true` and `deviceScaleFactor: 5`, saved to `runtime/logos-raw/`.
3. **Trim** to the visible pixels, so every logo is the same height in the strip. SVGs get a new viewBox; PNGs are cropped.
   ```bash
   node scripts/logos/trim.cjs runtime/logos-raw public/clients raw-name.svg=client.svg
   ```
4. **Make the other theme's file** when the brand has only one. It is rasterized at the given height:
   - `-on-dark` in the output name: dark pixels turn white.
   - `-on-light`: light pixels turn black.
   - Brand colors stay as they are.
   ```bash
   node scripts/logos/recolor.cjs 160 dark public/clients/client.svg=public/clients/client-on-dark.png
   ```
   This fails on gradients and thin taglines. Arc4dia's gradient letters came out striped, so it uses one file for both themes, cropped above its tagline. When the result looks bad, use the original file for both themes and say so.
5. **Register** the client in `src/lib/content.ts`:
   - Add it to `BRANDS`, which stays alphabetical: `{ name, color, logo: { light, dark } }`. Add `hoverInk` only if `color` fails contrast on a theme.
   - Add a sentence to the comment above `BRANDS` when the logo doesn't come straight from Brandfetch.
   - Add the name to `CLIENT_STRIP_ORDER`, ordered by how likely a buyer is to know it, best known first. Ask the owner where a new name goes.
6. **Check** both themes in the browser, at rest and on hover: Home at desktop width and at 375px. Then:
   ```bash
   run-check -- pnpm exec tsc --noEmit && run-check -- pnpm exec eslint src
   ```

The scripts need Playwright and Chrome. Playwright isn't a site dependency: run them with `NODE_PATH` pointing at a Playwright install (on the owner's host, an npx cache such as `~/.npm/_npx/<hash>/node_modules`) and Chrome at `/usr/bin/google-chrome`. Codex's sandbox can't run Chrome, so Claude runs them.

## Later: SVG for every logo

17 of the 27 files are PNGs: rasters from Brandfetch, the recolored dark versions, and the website captures. They are sharp enough at 28px, but SVGs would scale cleanly and could be recolored exactly, without step 4's pixel rules. There are two ways to get them:

- **Ask the client or the owner for vector files.** This is the right fix for Arc4dia, whose only file is 201×48.
- **Trace the PNGs** with potrace, or with vtracer for colored logos. Tracing needs a tool that isn't installed, so get the owner's OK before installing one. Compare each traced logo with the original at 4× zoom: tracing rounds off corners and thin strokes.
