// Trims each logo to its visible pixels. SVG: rewrites the viewBox; PNG: crops.
// Usage (see .claude/skills/client-logo): node scripts/logos/trim.cjs <srcDir> <outDir> <src>=<out> ...
const fs = require("fs"), path = require("path");
const { chromium } = require("playwright");
const [src, out, ...pairs] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch({ executablePath: "/usr/bin/google-chrome" });
  const p = await b.newPage();
  for (const pair of pairs) {
    const [from, to] = pair.split("=");
    const file = path.join(src, from);
    const isSvg = from.endsWith(".svg");
    let text = isSvg ? fs.readFileSync(file, "utf8") : null;
    let vb = null;
    if (isSvg) {
      const m = text.match(/<svg[^>]*>/)[0];
      const v = m.match(/viewBox="([^"]+)"/);
      if (v) vb = v[1].trim().split(/[\s,]+/).map(Number);
      else { const w = +m.match(/width="([\d.]+)/)[1], h = +m.match(/height="([\d.]+)/)[1]; vb = [0, 0, w, h]; }
    }
    const data = "data:" + (isSvg ? "image/svg+xml" : "image/png") + ";base64," + fs.readFileSync(file).toString("base64");
    const r = await p.evaluate(async ({ data, vb }) => {
      const img = new Image(); img.src = data; await img.decode();
      const W = vb ? 2000 : img.naturalWidth, H = vb ? Math.round(2000 * vb[3] / vb[2]) : img.naturalHeight;
      const c = document.createElement("canvas"); c.width = W; c.height = H;
      const x = c.getContext("2d"); x.drawImage(img, 0, 0, W, H);
      const d = x.getImageData(0, 0, W, H).data;
      let x0 = W, y0 = H, x1 = -1, y1 = -1;
      for (let y = 0; y < H; y++) for (let i = 0; i < W; i++) if (d[(y * W + i) * 4 + 3] > 10) { if (i < x0) x0 = i; if (i > x1) x1 = i; if (y < y0) y0 = y; if (y > y1) y1 = y; }
      let png = null;
      if (!vb) { const o = document.createElement("canvas"); o.width = x1 - x0 + 1; o.height = y1 - y0 + 1; o.getContext("2d").drawImage(c, x0, y0, o.width, o.height, 0, 0, o.width, o.height); png = o.toDataURL("image/png"); }
      return { W, H, x0, y0, x1, y1, png };
    }, { data, vb });
    if (isSvg) {
      const sx = vb[2] / r.W, sy = vb[3] / r.H;
      const nvb = [vb[0] + r.x0 * sx, vb[1] + r.y0 * sy, (r.x1 - r.x0 + 1) * sx, (r.y1 - r.y0 + 1) * sy].map((n) => +n.toFixed(2));
      text = text.replace(/<svg[^>]*>/, (tag) => tag.replace(/\s(width|height|viewBox)="[^"]*"/g, "").replace("<svg", `<svg viewBox="${nvb.join(" ")}"`));
      fs.writeFileSync(path.join(out, to), text);
      console.log(to, "viewBox", nvb.join(" "), "ratio", (nvb[2] / nvb[3]).toFixed(2));
    } else {
      fs.writeFileSync(path.join(out, to), Buffer.from(r.png.split(",")[1], "base64"));
      console.log(to, "crop", r.x1 - r.x0 + 1, "x", r.y1 - r.y0 + 1, "ratio", ((r.x1 - r.x0 + 1) / (r.y1 - r.y0 + 1)).toFixed(2));
    }
  }
  await b.close();
})();
