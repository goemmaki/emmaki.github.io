// Makes a logo's version for the other theme: rasterizes it at a fixed height, then turns its dark
// pixels white (mode "dark": for a dark background) or its light pixels black (mode "light"),
// leaving brand colors alone. Crops to the visible pixels.
// Usage (see .claude/skills/client-logo): node scripts/logos/recolor.cjs <height> <mode> <in>=<out> ...
const fs = require("fs");
const { chromium } = require("playwright");
const [height, defMode, ...jobs] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch({ executablePath: "/usr/bin/google-chrome" });
  const p = await b.newPage();
  for (const job of jobs) {
    const [inp, out] = job.split("=");
    const mime = inp.endsWith(".svg") ? "image/svg+xml" : "image/png";
    const raw = fs.readFileSync(inp);
    // An SVG without width/height has no natural size of its own: take its proportions from the viewBox.
    const vb = mime === "image/svg+xml" && raw.toString().match(/viewBox="([^"]+)"/);
    const ratio = vb ? (([, , w, h]) => w / h)(vb[1].trim().split(/[\s,]+/).map(Number)) : null;
    const data = `data:${mime};base64,` + raw.toString("base64");
    const png = await p.evaluate(async ({ data, H, mode, ratio }) => {
      const img = new Image(); img.src = data; await img.decode();
      const W = Math.round((ratio ?? img.naturalWidth / img.naturalHeight) * H);
      const c = document.createElement("canvas"); c.width = W; c.height = H;
      const x = c.getContext("2d"); x.imageSmoothingQuality = "high"; x.drawImage(img, 0, 0, W, H);
      const im = x.getImageData(0, 0, W, H), d = im.data;
      const lin = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
      let x0 = W, y0 = H, x1 = -1, y1 = -1;
      for (let i = 0; i < d.length; i += 4) {
        if (d[i + 3] <= 10) continue;
        const L = 0.2126 * lin(d[i]) + 0.7152 * lin(d[i + 1]) + 0.0722 * lin(d[i + 2]);
        if (mode === "dark" && L < 0.09) d[i] = d[i + 1] = d[i + 2] = 255;
        if (mode === "light" && L > 0.6) d[i] = d[i + 1] = d[i + 2] = 0;
        const px = (i / 4) % W, py = Math.floor(i / 4 / W);
        if (px < x0) x0 = px; if (px > x1) x1 = px; if (py < y0) y0 = py; if (py > y1) y1 = py;
      }
      x.putImageData(im, 0, 0);
      const o = document.createElement("canvas"); o.width = x1 - x0 + 1; o.height = y1 - y0 + 1;
      o.getContext("2d").drawImage(c, x0, y0, o.width, o.height, 0, 0, o.width, o.height);
      return o.toDataURL("image/png");
    }, { data, H: +height, ratio, mode: out.includes("on-dark") ? "dark" : out.includes("on-light") ? "light" : defMode });
    fs.writeFileSync(out, Buffer.from(png.split(",")[1], "base64"));
    console.log(out);
  }
  await b.close();
})();
