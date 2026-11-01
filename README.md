# Emmaki portfolio site

The site is a static Astro project. Its routes and components live in `src/`; shared content and styles are in `src/lib/` and `src/styles/`. The root `public/` directory is copied as-is into the build.

## Develop and build

Use pnpm from the repository root:

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm run check
pnpm run build
```

Astro serves the development site on port 3004. The static site is written to `dist/`. To serve a build locally, run `python3 docs/checks/serve.py dist 3007`.

## Visual parity

`scripts/parity.mjs` compares the static build against the preserved reference export on port 3006. Recreate that export from commit `e504a4bd` with `git worktree add <dir> e504a4bd`, `pnpm install`, and `pnpm build`, then serve its `out/` directory on port 3006. Run the full matrix with `REF=http://127.0.0.1:3006 NEW=http://127.0.0.1:3007 node scripts/parity.mjs`; choose Chromium or Firefox with `BROWSER=chromium` or `BROWSER=firefox`.

## GitHub Pages

There is no deployment workflow yet. Before publishing, add or configure the GitHub Pages deployment step to upload the static root `dist/` artifact produced by `pnpm run build`. No server process is needed at runtime.
