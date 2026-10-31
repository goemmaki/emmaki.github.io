# Astro migration

This package runs alongside the Next app from the repository root. It is intentionally installed outside the root pnpm workspace so Astro setup does not install or change the Next dependency graph.

- `pnpm --dir astro --ignore-workspace install` installs the isolated Astro package.
- `pnpm --dir astro --ignore-workspace run dev` serves on `http://localhost:3004`.
- `pnpm --dir astro --ignore-workspace run check` checks Astro and TypeScript.
- `pnpm --dir astro --ignore-workspace run build` creates the static site in `astro/dist/`.
- `pnpm --dir astro --ignore-workspace run preview` previews the static build on port 3004.

See [CONVENTIONS.md](./CONVENTIONS.md) for implementation and parity rules. Compare the running Next and Astro sites with `node astro/scripts/parity.mjs`; it defaults to ports 3003 and 3004 and writes screenshots plus `summary.md` and `summary.json` under `runtime/parity/`.
