// Globedots supplies the land pass; the existing orthographic overlay and
// controller retain the framing, intro, grid, Crete, and dock behavior.
import { createDots, CRETE_LATTICE, DOT_COUNT, DOT_RATIO, FAR_HEMISPHERE } from './globedots';
import { CRETE_COAST } from './geo';
// Natural Earth 1:10m land, delivered separately from the renderer.
import landUrl from './land.png?url';

type LatLon = [number, number];
type Vec3 = [number, number, number];
type Rgb = [number, number, number];
type View = { phi: number; theta: number; scale: number; cx: number; cy: number };

const CRETE: LatLon = [35.3, 24.8];
const [creteX, creteY, creteZ] = CRETE_LATTICE.point;
const CRETE_DOT: Vec3 = [creteZ, creteY, -creteX];
const R = 0.8;
const INTRO_SECONDS = 3.3;
// The globe faces Crete until it starts to turn.
const FINAL_LON = CRETE[1];
const FINAL_TILT = CRETE[0] * Math.PI / 180;
const SPIN = (2 * Math.PI) / 100; // One revolution every 100 s.
const SPIN_IN = 0.5; // Share of the intro after which the spin starts easing in.
// Island lattice spacings in degrees. The intro opens on big dots (about 2.4% of the
// viewport width apart) and switches to coarser lattices so they never get closer than 6 px.
const ISLAND_SPACINGS = [0.03, 0.06, 0.12, 0.24];
const OPENING_SPACING = 0.024;
const MIN_SPACING_PX = 6;
// Backing-store budget per canvas, so a 4K screen doesn't shade 18 million pixels a frame.
const PIXEL_BUDGET = 8e6;

const toRad = (deg: number) => deg * Math.PI / 180;
const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));
const clamp01 = (n: number) => clamp(n, 0, 1);
const ease = (t: number) => 1 - (1 - t) ** 4;
const smooth = (t: number) => t * t * (3 - 2 * t);
const phiFacing = (lon: number) => -Math.PI / 2 - toRad(lon);

function unit([lat, lon]: LatLon): Vec3 {
  const a = toRad(lat);
  const b = toRad(lon) - Math.PI;
  return [-Math.cos(a) * Math.cos(b), Math.sin(a), Math.cos(a) * Math.sin(b)];
}

// Fill Crete's outline with a hexagonal lattice (even spacing at any angle, so no stripes).
function islandDots(spacing: number): Vec3[] {
  const k = Math.cos(toRad(CRETE[0]));
  const ring = CRETE_COAST.map(([lon, lat]) => [lon * k, lat]);
  const ys = ring.map(p => p[1]);
  const rowHeight = spacing * Math.sqrt(3) / 2;
  const dots: Vec3[] = [];
  for (let row = Math.ceil(Math.min(...ys) / rowHeight); row * rowHeight <= Math.max(...ys); row++) {
    const y = row * rowHeight;
    const crossings: number[] = [];
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const [ax, ay] = ring[i];
      const [bx, by] = ring[j];
      if ((ay > y) !== (by > y))
        crossings.push(ax + (bx - ax) * (y - ay) / (by - ay));
    }
    crossings.sort((a, b) => a - b);
    const shift = row % 2 ? spacing / 2 : 0;
    for (let i = 0; i + 1 < crossings.length; i += 2)
      for (let x = Math.ceil((crossings[i] - shift) / spacing) * spacing + shift; x < crossings[i + 1]; x += spacing)
        dots.push(unit([y, x / k]));
  }
  return dots;
}
const ISLAND = ISLAND_SPACINGS.map(islandDots);

// Shared orthographic projection; x and y in CSS pixels.
function project(p: Vec3, v: View, height: number) {
  const ct = Math.cos(v.theta), st = Math.sin(v.theta);
  const cp = Math.cos(v.phi), sp = Math.sin(v.phi);
  const x = cp * p[0] + sp * p[2];
  const y = sp * st * p[0] + ct * p[1] - cp * st * p[2];
  const z = -sp * ct * p[0] + st * p[1] + cp * ct * p[2];
  const half = R * v.scale * height / 2;
  return { x: v.cx + x * half, y: v.cy - y * half, z };
}

// Settled framing per viewport class: a dominant globe running down behind ABOUT.
function frameFor(width: number, height: number, statementBottom: number, rem: number) {
  const wide = width >= 1100;
  const phone = width < 640;
  const diameter = wide ? Math.min(height * 1.4, width * 0.95)
    : phone ? width * 1.5 : Math.min(height * 1.08, width * 1.15);
  return {
    scale: diameter / (R * height),
    cx: width * (phone ? 0.54 : wide ? 0.6 : 0.57),
    cy: phone ? statementBottom + 1.5 * rem + diameter / 2 : height * 0.62,
    // Open close on Crete (about 0.04 rad long) at roughly 90% of the viewport width.
    startScale: width * 0.9 / (0.04 * R * height / 2),
  };
}

function rgbOf(color: string): Rgb {
  const c = document.createElement('canvas').getContext('2d', { willReadFrequently: true })!;
  c.fillStyle = color;
  c.fillRect(0, 0, 1, 1);
  const [r, g, b] = c.getImageData(0, 0, 1, 1).data;
  return [r / 255, g / 255, b / 255];
}
const css = (c: Rgb, alpha = 1) => `rgb(${c.map(n => Math.round(n * 255)).join(' ')} / ${alpha})`;

const land = new Image();
land.src = landUrl;
const landReady = land.decode();

export function hasWebGL() {
  const c = document.createElement('canvas');
  return Boolean(c.getContext('webgl2'));
}

// A software renderer (no graphics card) can draw the globe but not animate it smoothly.
export function hasGpu() {
  const gl = document.createElement('canvas').getContext('webgl2', { failIfMajorPerformanceCaveat: true });
  if (!gl)
    return false;
  const info = gl.getExtension('WEBGL_debug_renderer_info');
  const renderer = String(gl.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : gl.RENDERER));
  return !/swiftshader|llvmpipe|softpipe|software|basic render/i.test(renderer);
}

export type GlobeHandle = {
  setVisible(value: boolean): void;
  refreshTheme(): void;
};

/** `intro` plays the pull-back from Crete; `spin` turns the globe once it settles. Without either it is a still. */
export function mountGlobe(root: HTMLElement, opts: { intro: boolean; spin: boolean }): GlobeHandle {
  const dotsCanvas = root.querySelector<HTMLCanvasElement>('[data-globe-dots]')!;
  const lines = root.querySelector<HTMLCanvasElement>('[data-globe-lines]')!;
  const ctx = lines.getContext('2d')!;

  let width = 0, height = 0, dpr = 1;
  let frame = { scale: 1, cx: 0, cy: 0, startScale: 1 };
  let colors = { line: [1, 1, 1] as Rgb, accent: [1, 0.76, 0] as Rgb, dark: true };
  let clock = opts.intro ? 0 : INTRO_SECONDS;
  let visible = true, raf = 0, last = 0;
  // The settled camera faces Crete.
  let phi = phiFacing(FINAL_LON);
  const theta = FINAL_TILT;
  let globe: ReturnType<typeof createDots> | null = null;
  let shaderPending = false;

  const introDone = () => clock >= INTRO_SECONDS;

  function readColors() {
    const s = getComputedStyle(root);
    colors = {
      line: rgbOf(s.getPropertyValue('--color-fg-2')),
      accent: rgbOf(s.getPropertyValue('--globe-accent')),
      dark: document.documentElement.dataset.theme !== 'light',
    };
  }

  function size() {
    width = root.clientWidth;
    height = root.clientHeight;
    dpr = Math.min(devicePixelRatio || 1, 2, Math.sqrt(PIXEL_BUDGET / (width * height)));
    const statement = root.querySelector<HTMLElement>('.about-globe-statement')!;
    const statementBottom = statement.getBoundingClientRect().bottom - root.getBoundingClientRect().top;
    root.style.setProperty('--statement-bottom', `${statementBottom}px`);
    frame = frameFor(width, height, statementBottom, parseFloat(getComputedStyle(document.documentElement).fontSize));
    for (const c of [dotsCanvas, lines]) {
      c.width = Math.round(width * dpr);
      c.height = Math.round(height * dpr);
    }
  }

  // During the intro the camera pulls back from Crete, centered and enlarged, to the settled framing.
  function view(): View {
    if (introDone())
      return { phi, theta, scale: frame.scale, cx: frame.cx, cy: frame.cy };
    const t = smooth(clock / INTRO_SECONDS);
    return {
      phi,
      theta,
      scale: frame.startScale + (frame.scale - frame.startScale) * ease(clock / INTRO_SECONDS),
      cx: width / 2 + (frame.cx - width / 2) * t,
      cy: height / 2 + (frame.cy - height / 2) * t,
    };
  }

  function drawGrid(v: View) {
    ctx.strokeStyle = css(colors.line, colors.dark ? 0.25 : 0.45);
    ctx.lineWidth = 0.6 * dpr;
    ctx.beginPath();
    const trace = (point: (i: number) => LatLon, count: number) => {
      let pen = false;
      for (let i = 0; i < count; i++) {
        const p = project(unit(point(i)), v, height);
        if (p.z < 0) {
          pen = false;
          continue;
        }
        if (pen)
          ctx.lineTo(p.x * dpr, p.y * dpr);
        else
          ctx.moveTo(p.x * dpr, p.y * dpr);
        pen = true;
      }
    };
    for (let lat = -75; lat <= 75; lat += 15)
      trace(i => [lat, i * 2.5 - 180], 145);
    for (let lon = -180; lon < 180; lon += 15)
      trace(i => [i * 2.5 - 90, lon], 73);
    ctx.stroke();
  }

  // All dots of one color go into a single path: one fill per layer, not per dot.
  function fillDots(dots: { x: number; y: number }[], radius: number, color: string) {
    ctx.fillStyle = color;
    ctx.beginPath();
    for (const d of dots) {
      ctx.moveTo((d.x + radius) * dpr, d.y * dpr);
      ctx.arc(d.x * dpr, d.y * dpr, radius * dpr, 0, Math.PI * 2);
    }
    ctx.fill();
  }

  function drawAmber(dots: { x: number; y: number }[], radius: number, alpha: number) {
    if (alpha <= 0.01 || radius < 0.3)
      return;
    fillDots(dots, radius, css(colors.accent, alpha));
  }

  function drawCrete(v: View) {
    const sphere = R * v.scale * height / 2; // sphere radius in CSS px
    const pxPerDeg = sphere * toRad(1);
    const zoom = v.scale / frame.scale;
    // Island while zoomed far in; one globe-sized dot from about 2.5× the settled zoom down.
    const island = smooth(clamp01((zoom - 2.5) / 3.5));
    // Keep the opening lattice until its dots close to 6 px apart, then crossfade to coarser ones.
    const openingPxPerDeg = R * frame.startScale * height / 2 * toRad(1);
    const opening = Math.round(Math.log2(Math.max(OPENING_SPACING * width, 18) / (ISLAND_SPACINGS[0] * openingPxPerDeg)));
    const level = clamp(Math.max(opening, Math.log2(MIN_SPACING_PX / (ISLAND_SPACINGS[0] * pxPerDeg))), 0, ISLAND_SPACINGS.length - 1);
    const lower = Math.floor(level);
    const upper = Math.min(lower + 1, ISLAND_SPACINGS.length - 1);
    const mix = smooth(level - lower);
    for (const [index, weight] of [[lower, 1 - mix], [upper, mix]]) {
      if (weight <= 0 || (index === upper && upper === lower))
        continue;
      const onScreen = ISLAND[index]
        .map(p => project(p, v, height))
        .filter(p => p.z > 0 && p.x > -10 && p.x < width + 10 && p.y > -10 && p.y < height + 10);
      drawAmber(onScreen, ISLAND_SPACINGS[index] * pxPerDeg * 0.36, island * weight);
    }
    const dot = project(CRETE_DOT, v, height);
    if (dot.z > 0)
      drawAmber([dot], sphere * DOT_RATIO * Math.sqrt(4 * Math.PI / DOT_COUNT), (1 - island) * clamp01(dot.z / (R * 0.15)));
  }

  function render() {
    if (!visible || document.hidden || !width || !height)
      return;
    const v = view();
    // Retain the editorial island opener; reveal the planet at the original scale.
    dotsCanvas.style.opacity = String(1 - smooth(clamp01((v.scale / frame.scale - 1.6) / 1.6)));
    if (!globe && landLoaded)
      globe = createDots(dotsCanvas, land);
    if (globe) {
      globe.setFarSideOpacity(colors.dark ? FAR_HEMISPHERE : 0);
      shaderPending = !globe.draw(v, width, height);
    }
    ctx.clearRect(0, 0, lines.width, lines.height);
    drawGrid(v);
    drawCrete(v);
  }

  const moving = () => shaderPending || !introDone() || opts.spin;

  function tick(ms: number) {
    raf = 0;
    const dt = last ? Math.min(0.05, (ms - last) / 1000) : 0;
    last = ms;
    if (!introDone()) {
      clock = Math.min(INTRO_SECONDS, clock + dt);
      // The zoom-out's eased tail barely moves, so the spin eases in over it and
      // reaches full speed as the intro ends: no pause before the globe turns.
      if (opts.spin)
        phi += SPIN * dt * smooth(clamp01((clock / INTRO_SECONDS - SPIN_IN) / (1 - SPIN_IN)));
    }
    else if (opts.spin)
      phi += SPIN * dt;
    render();
    if (moving() && visible && !document.hidden)
      raf = requestAnimationFrame(tick);
    else
      last = 0;
  }

  function wake() {
    if (!raf && visible && !document.hidden && moving()) {
      last = 0;
      raf = requestAnimationFrame(tick);
    }
  }

  new ResizeObserver(() => {
    size();
    render();
  }).observe(root);
  // The close-up opens on Crete alone while the land asset loads.
  let landLoaded = false;
  landReady.then(() => {
    landLoaded = true;
    render();
    wake();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(raf);
      raf = 0;
      last = 0;
    }
    else {
      render();
      wake();
    }
  });
  readColors();
  size();
  render();
  wake();

  return {
    setVisible(value) {
      visible = value;
      if (value) {
        render();
        wake();
      }
      else if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
        last = 0;
      }
    },
    refreshTheme() {
      readColors();
      render();
    },
  };
}
