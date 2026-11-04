// Lighthouse for the site checks (docs/checks/end-of-day.md). Claude runs it, outside Codex's sandbox.
// Needs the static build served by serve.py. RUNS (default 1) repeats each page; the summary keeps
// the median run by performance score, and every run's JSON is saved.
// Usage: NODE_PATH=<playwright node_modules> RUNS=<n> node docs/checks/lighthouse.cjs <out-dir> <port> <page>...
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const [outDir, port, ...pages] = process.argv.slice(2);
const OUT = path.resolve(outDir);
const base = `http://127.0.0.1:${port}`;
const RUNS = Number(process.env.RUNS ?? 1);

(async () => {
  const { default: lighthouse } = await import(path.resolve("runtime/a11y-tools/node_modules/lighthouse/core/index.js"));
  // Desktop settings go in the third argument (a config); a `preset` flag is silently ignored by the Node API.
  const { default: desktopConfig } = await import(path.resolve("runtime/a11y-tools/node_modules/lighthouse/core/config/desktop-config.js"));
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
            const runs = [];
            for (let i = 0; i < RUNS; i++) {
              const r = await lighthouse(
                base + url,
                {
                  port: 9223,
                  logLevel: "error",
                  onlyCategories: ["accessibility", "best-practices", "performance", "seo"],
                  disableStorageReset: true,
                  output: "json",
                },
                mode === "desktop" ? desktopConfig : undefined,
              );
              if (r.lhr.configSettings.formFactor !== mode) throw new Error(`ran as ${r.lhr.configSettings.formFactor}, expected ${mode}`);
              const file = RUNS > 1 ? `${tag}.run${i + 1}.json` : `${tag}.json`;
              fs.writeFileSync(`${OUT}/lighthouse/${file}`, JSON.stringify(r.lhr, null, 2));
              runs.push({ lhr: r.lhr, file });
            }
            runs.sort((a, b) => (a.lhr.categories.performance.score ?? 0) - (b.lhr.categories.performance.score ?? 0));
            const { lhr, file } = runs[Math.floor((runs.length - 1) / 2)];
            results.push({
              tag,
              file,
              performanceRuns: runs.map((r) => r.lhr.categories.performance.score),
              scores: Object.fromEntries(Object.entries(lhr.categories).map(([k, v]) => [k, v.score])),
              runtimeError: lhr.runtimeError,
              failures: Object.values(lhr.audits)
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
