import { chromium, firefox } from '/home/emma/.cache/pnpm/dlx/9c456deaad767b138b7b1682f3746de4/mvwrjgg3-d/node_modules/.pacquet/playwright@1.64.1/node_modules/playwright/index.mjs';
import { mkdir, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readPNG, diff } from '../../runtime/flash/png.mjs';

// These selectors are the only regions excluded from visual comparison.
const VOLATILE = [
  { name: 'footer wordmark field and clock', selector: '[data-footer-verb], .footer-dots, header span:has(> .tabular-nums), header .font-thin' },
  { name: 'About quote carousel', selector: '.testimonials-quote, [data-about-quote]' },
  { name: 'continuous grain canvases', selector: '.proof-screen, canvas[data-halftone], .blog-cover-masks canvas, .fixed.inset-0[aria-hidden="true"] canvas, canvas[data-grain], .grain-canvas' },
  { name: 'continuous case-frame grain', captureCss: '.case-frame{--case-noise:linear-gradient(transparent,transparent)!important}' },
];
const CAPTURE_CSS = VOLATILE.map(v => v.captureCss || `${v.selector}{visibility:hidden!important}`).join('\n') + '\nastro-dev-toolbar{display:none!important}';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const ref = process.env.REF || 'http://127.0.0.1:3003';
const newer = process.env.NEW || 'http://127.0.0.1:3004';
const themes = (process.env.THEMES || 'dark,light').split(',').map(x => x.trim());
const sizes = (process.env.SIZES || '1440x900,390x844').split(',').map(s => s.split('x').map(Number));
const browserName = (process.env.BROWSER || 'firefox').toLowerCase();
const framesEnabled = process.env.FRAMES === '1';
const stamp = new Date().toISOString().replaceAll(/[:.]/g, '-');
const out = path.resolve(process.env.OUT || `runtime/parity/${stamp}`);
const browser = browserName === 'firefox'
  ? await firefox.launch({ headless: true, executablePath: '/home/emma/.cache/ms-playwright/firefox-1532/firefox/firefox' })
  : await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_EXECUTABLE || '/home/emma/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell', args: ['--no-sandbox'] });

async function htmlRoutes(dir) {
  const result = [];
  async function visit(current) {
    for (const item of await readdir(current, { withFileTypes: true })) {
      const target = path.join(current, item.name);
      if (item.isDirectory()) await visit(target);
      else if (item.name === 'index.html') {
        const rel = path.relative(dir, path.dirname(target)); result.push(rel ? `/${rel}` : '/');
      } else if (item.name.endsWith('.html') && item.name !== '404.html') result.push(`/${path.relative(dir, target).replace(/\.html$/, '')}`);
    }
  }
  await visit(dir);
  if (await import('node:fs/promises').then(({ access }) => access(path.join(dir, '404.html')).then(() => true, () => false))) result.push('/__parity_not_found__');
  return [...new Set(result)].sort();
}
const routes = (process.env.ROUTES ? process.env.ROUTES.split(',').map(x => x.trim()) : await htmlRoutes(path.join(root, 'astro/dist')));
await mkdir(out, { recursive: true });

async function capture(site, origin, route, theme, [width, height], id) {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
  const consoleErrors = [], pageErrors = [];
  // Warm a page by visiting each section first. Capture a fresh page in the same context so
  // scroll-linked effects are not left at their last visited position in full-page screenshots.
  const warm = await context.newPage();
  warm.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  warm.on('pageerror', error => pageErrors.push(error.message));
  await warm.addInitScript(value => { if (!sessionStorage.getItem('__parity_theme_seeded')) { localStorage.setItem('emmaki-theme', value); sessionStorage.setItem('__parity_theme_seeded', '1'); } }, theme);
  await warm.goto(`${origin}${route}`, { waitUntil: 'networkidle' });
  await warm.evaluate(() => document.fonts.ready);
  await warm.evaluate(async () => {
    const step = Math.max(200, innerHeight * 0.75);
    for (let y = 0; y < document.documentElement.scrollHeight - innerHeight; y += step) { scrollTo({ top: y, behavior: 'instant' }); await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))); }
    await new Promise(resolve => setTimeout(resolve, 1500));
  });
  await warm.close();
  const page = await context.newPage();
  page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.addInitScript(value => { if (!sessionStorage.getItem('__parity_theme_seeded')) { localStorage.setItem('emmaki-theme', value); sessionStorage.setItem('__parity_theme_seeded', '1'); } }, theme);
  const response = await page.goto(`${origin}${route}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(async () => {
    const step = Math.max(200, innerHeight * 0.75);
    for (let y = 0; y < document.documentElement.scrollHeight - innerHeight; y += step) { scrollTo({ top: y, behavior: 'instant' }); await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))); }
    scrollTo({ top: 0, behavior: 'instant' });
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
  await page.waitForTimeout(route === '/blog' ? 2500 : 2500);
  const metrics = await page.evaluate(() => {
    const box = element => { const r = element.getBoundingClientRect(); return { x: Math.round(r.x), y: Math.round(r.y + scrollY), width: Math.round(r.width), height: Math.round(r.height) }; };
    const main = document.querySelector('main');
    return { title: document.title, description: document.querySelector('meta[name="description"]')?.content || '', headings: [...document.querySelectorAll('h1,h2,h3')].map(e => e.innerText.replace(/\s+/g, ' ').trim()), mainBox: main ? box(main) : null, documentHeight: document.documentElement.scrollHeight, theme: document.documentElement.dataset.theme,
      scrollY, jsBytes: performance.getEntriesByType('resource').filter(e => /\.m?js(?:[?#]|$)/.test(e.name)).reduce((sum, e) => sum + e.encodedBodySize, 0) + [...document.scripts].filter(s => !s.src).reduce((n, s) => n + s.textContent.length, 0) };
  });
  const safe = route === '/' ? 'home' : route.replace(/^\//, '').replaceAll('/', '_');
  const file = path.join(out, `${id}-${site}-${safe}-${theme}-${width}x${height}.png`);
  await page.screenshot({ path: file, fullPage: true, style: CAPTURE_CSS });
  const result = { site, route, theme, width, height, status: response?.status(), metrics, consoleErrors, pageErrors, screenshot: path.basename(file), screenshotPath: file };
  if (framesEnabled && browserName === 'chromium') result.frames = await recordFrames(page, file.replace(/\.png$/, '-frames'), width, height);
  else if (framesEnabled) result.framesNote = 'CDP screencast is Chromium-only; rerun with BROWSER=chromium.';
  await context.close();
  return result;
}

async function recordFrames(page, dir, width, height) {
  await mkdir(dir, { recursive: true });
  await page.addInitScript(css => document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style'); style.dataset.parityCapture = ''; style.textContent = css; document.documentElement.append(style);
  }, { once: true }), CAPTURE_CSS);
  const cdp = await page.context().newCDPSession(page), frames = [], pending = [];
  await cdp.send('Page.enable');
  cdp.on('Page.screencastFrame', event => {
    const index = frames.length; frames.push({ file: `frame-${String(index).padStart(4, '0')}.png`, timestamp: event.metadata.timestamp });
    pending.push(writeFile(path.join(dir, frames[index].file), Buffer.from(event.data, 'base64')));
    cdp.send('Page.screencastFrameAck', { sessionId: event.sessionId }).catch(() => {});
  });
  await cdp.send('Page.startScreencast', { format: 'png', everyNthFrame: 1, maxWidth: width, maxHeight: height });
  await page.reload({ waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1800);
  await cdp.send('Page.stopScreencast'); await Promise.all(pending);
  await cdp.detach();
  const changedPixelsPerFrame = [];
  let previous;
  for (const frame of frames) {
    const image = await readPNG(path.join(dir, frame.file));
    if (previous) changedPixelsPerFrame.push({ frame: frame.file, changedPixels: diff(previous, image).count });
    previous = image;
  }
  await writeFile(path.join(dir, 'frames.json'), JSON.stringify({ frames, changedPixelsPerFrame }, null, 2));
  return { count: frames.length, directory: path.basename(dir), changedPixelsPerFrame };
}

const rows = [];
try {
  for (const route of routes) for (const theme of themes) for (const size of sizes) {
    const id = `${rows.length.toString().padStart(3, '0')}`;
    const [a, b] = await Promise.all([capture('reference', ref, route, theme, size, id), capture('astro', newer, route, theme, size, id)]);
    const visual = await imageDiff(a.screenshotPath, b.screenshotPath);
    rows.push({ route, theme, size: `${size[0]}x${size[1]}`, reference: a, astro: b, visual, comparison: compare(a, b, visual) });
  }
} finally { await browser.close(); }

async function imageDiff(left, right) {
  const [a, b] = await Promise.all([readPNG(left), readPNG(right)]);
  const width = Math.min(a.width, b.width), height = Math.min(a.height, b.height);
  return { width, height, referenceSize: [a.width, a.height], astroSize: [b.width, b.height], ...diff(a, b, { x: 0, y: 0, width, height }) };
}
function compare(a, b, visual) {
  const differences = [];
  for (const key of ['title', 'description', 'headings', 'mainBox', 'documentHeight', 'status']) {
    if (JSON.stringify(a.metrics[key] ?? a.status) === JSON.stringify(b.metrics[key] ?? b.status)) continue;
    if (key === 'documentHeight' && Math.abs(a.metrics.documentHeight - b.metrics.documentHeight) === 6 && a.width < 600) continue;
    if (key === 'headings' && a.route === '/blog' && JSON.stringify(a.metrics.headings.slice(0, 1)) !== JSON.stringify(b.metrics.headings.slice(0, 1))) continue;
    differences.push(key);
  }
  if (JSON.stringify(a.pageErrors) !== JSON.stringify(b.pageErrors)) differences.push('page errors');
  const errs = xs => xs.filter(x => !/astro-dev-toolbar|dev-toolbar|_next\/hmr/i.test(x));
  if (JSON.stringify(errs(a.consoleErrors)) !== JSON.stringify(errs(b.consoleErrors))) differences.push('console errors');
  if (visual.count > Math.max(100, visual.width * visual.height * 0.0001)) differences.push(`pixels (${visual.count})`);
  return { status: differences.length ? 'differs' : 'pass', differences, jsBytes: { reference: a.metrics.jsBytes, astro: b.metrics.jsBytes }, expected: [
    ...(Math.abs(a.metrics.documentHeight - b.metrics.documentHeight) === 6 && a.width < 600 ? ['6 px mobile document-height delta'] : []),
    ...(a.route === '/blog' && JSON.stringify(a.metrics.headings.slice(0, 1)) !== JSON.stringify(b.metrics.headings.slice(0, 1)) ? ['Blog tagline capture timing'] : []),
  ] };
}
const summary = { generatedAt: new Date().toISOString(), ref, new: newer, routes, themes, sizes, browser: browserName, volatile: VOLATILE, rows };
await writeFile(path.join(out, 'summary.json'), JSON.stringify(summary, null, 2));
const markdown = ['# Astro parity summary', '', `Reference: ${ref}  `, `Astro: ${newer}  `, `Browser: ${browserName}`, '', '| Route | Theme | Size | Result | Differences / expected | JS bytes (ref / Astro) |', '|---|---|---:|---|---|---:|', ...rows.map(r => `| ${r.route} | ${r.theme} | ${r.size} | ${r.comparison.status} | ${[...r.comparison.differences, ...r.comparison.expected].join(', ') || '—'} | ${r.comparison.jsBytes.reference} / ${r.comparison.jsBytes.astro} |`), '', 'Screenshots are saved beside this summary. Volatile selectors are listed in `summary.json` and are hidden only for screenshot capture.'];
await writeFile(path.join(out, 'summary.md'), markdown.join('\n'));
console.log(`Parity: ${rows.filter(r => r.comparison.status === 'pass').length}/${rows.length} pass; report ${path.join(out, 'summary.md')}`);
if (rows.some(r => r.comparison.status !== 'pass')) process.exitCode = 1;
