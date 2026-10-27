// Lighthouse for the end-of-day checks (docs/checks/end-of-day.md). Runs outside Codex's sandbox,
// which blocks Chrome. Needs the static export served by serve.py.
// Usage: NODE_PATH=<playwright node_modules> node docs/checks/lighthouse.cjs <out-dir> <port> <page>...
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const [outDir, port, ...pages] = process.argv.slice(2);
const OUT = path.resolve(outDir);
const base = `http://127.0.0.1:${port}`;

(async () => {
  const { default: lighthouse } = await import(path.resolve("runtime/a11y-tools/node_modules/lighthouse/core/index.js"));
  fs.mkdirSync(`${OUT}/lighthouse`, { recursive: true });
  const ctx = await chromium.launchPersistentContext(`${OUT}/lighthouse-profile`, {
    executablePath: "/usr/bin/google-chrome",
    headless: true,
    args: ["--remote-debugging-port=9223"],
  });
  const results = [];
  try {
    const p = ctx.pages()[0];
    for (const theme of ["light", "dark"])
      for (const mode of ["desktop", "mobile"])
        for (const url of pages) {
          // The theme is read from localStorage by the boot script before first paint.
          await p.goto(base + "/");
          await p.evaluate((t) => localStorage.setItem("emmaki-theme", t), theme);
          const tag = `${url === "/" ? "home" : url.slice(1).replaceAll("/", "_")}.${mode}.${theme}`;
          try {
            const r = await lighthouse(base + url, {
              port: 9223,
              logLevel: "error",
              onlyCategories: ["accessibility", "best-practices", "performance", "seo"],
              disableStorageReset: true,
              output: "json",
              ...(mode === "desktop" ? { preset: "desktop" } : {}),
            });
            fs.writeFileSync(`${OUT}/lighthouse/${tag}.json`, JSON.stringify(r.lhr, null, 2));
            results.push({
              tag,
              scores: Object.fromEntries(Object.entries(r.lhr.categories).map(([k, v]) => [k, v.score])),
              runtimeError: r.lhr.runtimeError,
              failures: Object.values(r.lhr.audits)
                .filter((a) => a.score !== null && a.score < 1)
                .map((a) => ({ id: a.id, title: a.title, score: a.score, displayValue: a.displayValue })),
            });
            console.log("lighthouse", tag, JSON.stringify(results.at(-1).scores));
          } catch (e) {
            results.push({ tag, error: String(e) });
            console.log("lighthouse error", tag, String(e));
          }
          fs.writeFileSync(`${OUT}/lighthouse-summary.json`, JSON.stringify(results, null, 2));
        }
  } finally {
    await ctx.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
