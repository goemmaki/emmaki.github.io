// Cuts the Home hero portrait out of its white backdrop, once, so the browser doesn't have to.
// Usage: node scripts/hero-cutout.mjs <photo> <cutout.png>
// Same rule the hero used to run on every visit: backdrop pixels are the near-white (or transparent)
// ones connected to the photo's edges, so enclosed whites (skin, reflections) stay. The result is
// trimmed to the figure and saved as a lossless PNG; Astro encodes the served WebP/AVIF from it.
// Re-run it whenever the photo changes. sharp comes with Astro, so nothing extra is installed.
import { createRequire } from 'node:module';

const [input, output] = process.argv.slice(2);
if (!input || !output) throw new Error('Usage: node scripts/hero-cutout.mjs <photo> <cutout.png>');
const sharp = createRequire(createRequire(import.meta.url).resolve('astro/package.json'))('sharp');

const { data: p, info: { width: w, height: h } } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const seen = new Uint8Array(w * h), queue = new Int32Array(w * h);
let start = 0, end = 0;
const visit = n => {
  if (seen[n]) return;
  seen[n] = 1; const i = n * 4, lo = Math.min(p[i], p[i + 1], p[i + 2]), hi = Math.max(p[i], p[i + 1], p[i + 2]);
  if (p[i + 3] < 16 || (lo > 230 && hi - lo < 20)) queue[end++] = n;
};
for (let x = 0; x < w; x++) { visit(x); visit((h - 1) * w + x); }
for (let y = 0; y < h; y++) { visit(y * w); visit(y * w + w - 1); }
while (start < end) {
  const n = queue[start++], x = n % w, y = Math.floor(n / w); p[n * 4 + 3] = 0;
  if (x) visit(n - 1); if (x < w - 1) visit(n + 1); if (y) visit(n - w); if (y < h - 1) visit(n + w);
}
let left = w, top = h, right = 0, bottom = 0;
for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (p[(y * w + x) * 4 + 3] > 32) {
  left = Math.min(left, x); top = Math.min(top, y); right = Math.max(right, x); bottom = Math.max(bottom, y);
}
if (right <= left || bottom <= top) throw new Error(`${input} has no foreground`);
await sharp(p, { raw: { width: w, height: h, channels: 4 } })
  .extract({ left, top, width: right - left + 1, height: bottom - top + 1 })
  .png({ compressionLevel: 9 }).toFile(output);
console.log(`${output}: ${right - left + 1}x${bottom - top + 1}, trimmed from ${w}x${h}`);
