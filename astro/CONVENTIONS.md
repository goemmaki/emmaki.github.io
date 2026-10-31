# Astro conventions

- Use design tokens from `docs/design-system/` and `globals.css` only. Do not introduce raw color, spacing, type, timing, or motion values.
- Render static markup in `.astro` files. Put behavior in vanilla TypeScript `<script>`s; do not add React or other framework islands.
- The first paint must already look like the settled page. Do not build visible DOM, insert text, or start textures in deferred scripts when HTML, CSS, or a tiny inline script immediately after the element can produce it.
- Preserve algorithms and timings when porting behavior. Honor reduced motion.
- Keep shared code in root `src/` until Next is retired. Never fork it without a Decision Log entry in the migration ExecPlan.
- Run package commands as `pnpm --dir astro --ignore-workspace ...` so pnpm does not select the root workspace.
- Compare changes with `node astro/scripts/parity.mjs`. It captures both sites for each route, theme, and viewport, records metadata, geometry, errors, and JavaScript bytes, and compares full-page pixels. A pass means the recorded nonvolatile metadata, geometry, errors, and screenshot pixels match within the small rasterization threshold; JS byte totals are informational because the bundles differ by design. The script masks only the volatile selectors declared at its top. Use `FRAMES=1 BROWSER=chromium` for an acknowledged CDP screencast and per-frame changed-pixel table.
- Run checks through `run-check -- <command>` and judge the final `run-check: PASS|FAIL` line.
