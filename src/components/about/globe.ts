// The About hero globe: COBE draws the dotted continents; a 2D overlay draws the
// wireframe, the connection arcs and the "YOU?" arc with the same projection as
// COBE's (cobe 2.0.1, function O in dist/index.esm.js), so they stay locked to it.
// Nothing renders unless something moves: the intro, a drag or a key press.
import createGlobe, { type Globe } from 'cobe';

type LatLon = [number, number];
type Rgb = [number, number, number];

const CRETE: LatLon = [35.24, 24.81];
const DESTINATIONS: { name: string; at: LatLon }[] = [
  { name: 'London', at: [51.51, -0.13] },
  { name: 'New York', at: [40.71, -74.01] },
  { name: 'Sydney', at: [-33.87, 151.21] },
];
// The open arc: it leaves Crete towards the Atlantic and stops in space.
const YOU = { towards: [28, -38] as LatLon, altitude: 0.55, label: 'YOU?' };

const R = 0.8; // COBE's sphere radius in clip units (half the canvas height is 1)
const ARC_HEIGHT = 0.22;
const INTRO = { zoom: 2.6, arcsFrom: 1.1, arcStagger: 0.35, arcDraw: 1.3 }; // seconds
const START_SCALE = 5.5;
const FINAL_LON = 0; // the settled view faces the meridian, Crete right of centre
const TILT = 0.38; // settled latitude tilt (radians)
const DRAG_SPEED = 0.005; // radians per CSS pixel
const KEY_STEP = Math.PI / 18; // 10°

const toRad = (deg: number) => (deg * Math.PI) / 180;
const easeOut = (t: number) => 1 - (1 - t) ** 3;
const easeInOut = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

/** COBE's unit vector for a location. */
function unit([lat, lon]: LatLon): [number, number, number] {
  const a = toRad(lat), b = toRad(lon) - Math.PI, c = Math.cos(a);
  return [-c * Math.cos(b), Math.sin(a), c * Math.sin(b)];
}

/** phi that puts a longitude at the centre (COBE: c = cos(lat)·cos(phi + lon) = 0, facing the viewer). */
const phiFacing = (lon: number) => -Math.PI / 2 - toRad(lon);

type View = { phi: number; theta: number; scale: number; width: number; height: number };

/** Screen position in CSS pixels, and whether the point is in front of the globe or outside its disc. */
function project(p: [number, number, number], v: View) {
  const ct = Math.cos(v.theta), st = Math.sin(v.theta), cp = Math.cos(v.phi), sp = Math.sin(v.phi);
  const x = cp * p[0] + sp * p[2];
  const y = sp * st * p[0] + ct * p[1] - cp * st * p[2];
  const z = -sp * ct * p[0] + st * p[1] + cp * ct * p[2];
  const half = v.height / 2;
  return { x: v.width / 2 + x * v.scale * half, y: half - y * v.scale * half, visible: z >= 0 || x * x + y * y >= R * R };
}

const scaleVec = (p: number[], k: number) => [p[0] * k, p[1] * k, p[2] * k] as [number, number, number];

/** COBE's arc: a quadratic Bézier from a to b through a control point lifted above their midpoint. */
function arcPoint(a: [number, number, number], b: [number, number, number], t: number, lift = ARC_HEIGHT) {
  const mid = [a[0] + b[0], a[1] + b[1], a[2] + b[2]], len = Math.hypot(...mid);
  const ctrl = scaleVec(mid, (R + lift) / len), from = scaleVec(a, R), to = scaleVec(b, R), s = 1 - t;
  return [0, 1, 2].map(i => s * s * from[i] + 2 * s * t * ctrl[i] + t * t * to[i]) as [number, number, number];
}

/** The open arc rises from Crete to a point in space above `towards`. */
function openArcPoint(t: number) {
  const a = scaleVec(unit(CRETE), R), end = scaleVec(unit(YOU.towards), R + YOU.altitude);
  const mid = [a[0] + end[0], a[1] + end[1], a[2] + end[2]], len = Math.hypot(...mid);
  const ctrl = scaleVec(mid, (R + YOU.altitude * 0.9) / len), s = 1 - t;
  return [0, 1, 2].map(i => s * s * a[i] + 2 * s * t * ctrl[i] + t * t * end[i]) as [number, number, number];
}

/** A CSS colour (any syntax) as 0–1 RGB. */
function rgbOf(color: string): Rgb {
  const ctx = document.createElement('canvas').getContext('2d', { willReadFrequently: true })!;
  ctx.fillStyle = color; ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return [r / 255, g / 255, b / 255];
}

export function hasWebGL() {
  const canvas = document.createElement('canvas');
  return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
}

export type GlobeHandle = {
  play(): void; pause(): void; replay(): void; rotate(steps: number): void; resetRotation(): void;
  setVisible(visible: boolean): void; refreshTheme(): void; readonly paused: boolean; readonly settled: boolean;
};

export function mountGlobe(root: HTMLElement, opts: { animate: boolean; onState(): void }): GlobeHandle {
  const dotsCanvas = root.querySelector<HTMLCanvasElement>('[data-globe-dots]')!;
  const lines = root.querySelector<HTMLCanvasElement>('[data-globe-lines]')!;
  const slider = root.querySelector<HTMLElement>('[data-globe-slider]')!;
  const labels = new Map([...root.querySelectorAll<HTMLElement>('[data-globe-label]')].map(el => [el.dataset.globeLabel!, el]));
  const stage = root.querySelector<HTMLElement>('[data-globe-stage]')!;
  const ctx = lines.getContext('2d')!;
  const dpr = Math.min(devicePixelRatio || 1, 2);

  let width = 0, height = 0, finalScale = 1;
  let colors = { line: [1, 1, 1] as Rgb, ink: [1, 1, 1] as Rgb, accent: [1, 0.8, 0] as Rgb, dark: true };
  let clock = opts.animate ? 0 : Infinity; // intro seconds elapsed
  let paused = false, visible = true, frame = 0, last = 0;
  let spin = 0, spinVelocity = 0; // user rotation (radians), with release inertia
  let globe: Globe | null = null;
  const introLength = INTRO.arcsFrom + (DESTINATIONS.length) * INTRO.arcStagger + INTRO.arcDraw;

  function readColors() {
    const style = getComputedStyle(root);
    colors = {
      line: rgbOf(style.getPropertyValue('--color-fg-muted')),
      ink: rgbOf(style.getPropertyValue('--color-fg-max')),
      accent: rgbOf(style.getPropertyValue('--color-yellow-splash')),
      dark: document.documentElement.dataset.theme !== 'light',
    };
  }

  function size() {
    width = root.clientWidth; height = root.clientHeight;
    // The settled globe: about three quarters of the hero's height, never wider than the window.
    const diameter = Math.min(height * 0.78, width * 0.94);
    finalScale = diameter / (2 * R * (height / 2));
    for (const c of [dotsCanvas, lines]) { c.width = Math.round(width * dpr); c.height = Math.round(height * dpr); }
  }

  /** The view at the current intro time and rotation. */
  function view(): View {
    const z = easeOut(clamp01(clock / INTRO.zoom));
    const zoomScale = START_SCALE + (finalScale - START_SCALE) * z;
    const lon = CRETE[1] + (FINAL_LON - CRETE[1]) * easeInOut(clamp01(clock / INTRO.zoom));
    const theta = toRad(CRETE[0]) + (TILT - toRad(CRETE[0])) * z;
    return { phi: phiFacing(lon) + spin, theta, scale: zoomScale, width, height };
  }

  function cobeOptions(v: View) {
    const d = colors.dark;
    return {
      phi: v.phi, theta: v.theta, scale: v.scale, width, height,
      dark: d ? 1 : 0, diffuse: 1.4, mapSamples: 24000, mapBrightness: d ? 12 : 9, mapBaseBrightness: 0,
      // The sphere body is black (dark) or white (light) so the wrapper's screen/multiply blend
      // removes it: COBE has no option for a transparent ocean.
      // Dark: land is base × (brightness + 0.1), clipped to white; the ocean is base × 0.1, which a dim base keeps near black.
      baseColor: (d ? colors.ink.map(c => c * 0.12) : [1, 1, 1]) as Rgb,
      markerColor: colors.accent, glowColor: (d ? [0.05, 0.05, 0.055] : [1, 1, 1]) as Rgb,
      markers: [{ location: CRETE, size: 0.035 }], markerElevation: 0.005, opacity: 1,
    };
  }

  function stroke(points: { x: number; y: number; visible: boolean }[], color: Rgb, alpha: number, lineWidth: number, dash: number[] = []) {
    ctx.strokeStyle = `rgb(${color.map(c => Math.round(c * 255)).join(' ')} / ${alpha})`;
    ctx.lineWidth = lineWidth * dpr; ctx.setLineDash(dash.map(d => d * dpr));
    ctx.beginPath();
    let pen = false;
    for (const p of points) {
      if (!p.visible) { pen = false; continue; }
      if (pen) ctx.lineTo(p.x * dpr, p.y * dpr); else { ctx.moveTo(p.x * dpr, p.y * dpr); pen = true; }
    }
    ctx.stroke();
  }

  function drawOverlay(v: View) {
    ctx.clearRect(0, 0, lines.width, lines.height);
    const settle = clamp01((clock - INTRO.zoom * 0.5) / (INTRO.zoom * 0.5));
    // Wireframe: every 15° of latitude and longitude, on the near side only.
    const wire = 0.22 * (0.35 + 0.65 * settle);
    for (let lat = -75; lat <= 75; lat += 15) stroke(Array.from({ length: 145 }, (_, i) => project(scaleVec(unit([lat, i * 2.5 - 180]), R), v)), colors.line, wire, 0.6);
    for (let lon = -180; lon < 180; lon += 15) stroke(Array.from({ length: 73 }, (_, i) => project(scaleVec(unit([i * 2.5 - 90, lon]), R), v)), colors.line, wire, 0.6);

    // Arcs grow out of Crete one after another.
    DESTINATIONS.forEach((dest, i) => {
      const t = easeInOut(clamp01((clock - INTRO.arcsFrom - i * INTRO.arcStagger) / INTRO.arcDraw));
      const a = unit(CRETE), b = unit(dest.at);
      const points = Array.from({ length: 65 }, (_, k) => project(arcPoint(a, b, (k / 64) * t), v));
      if (t > 0) stroke(points, colors.ink, 0.85, 1.1);
      placeLabel(dest.name, project(scaleVec(b, R), v), t >= 1);
    });
    const tYou = easeInOut(clamp01((clock - INTRO.arcsFrom - DESTINATIONS.length * INTRO.arcStagger) / INTRO.arcDraw));
    const open = Array.from({ length: 65 }, (_, k) => project(openArcPoint((k / 64) * tYou), v));
    if (tYou > 0) stroke(open, colors.accent, 0.95, 1.1, [4, 5]);
    placeLabel('you', open[64], tYou >= 1);
  }

  function placeLabel(key: string, p: { x: number; y: number; visible: boolean }, ready: boolean) {
    const el = labels.get(key);
    if (!el) return;
    el.style.translate = `${p.x}px ${p.y}px`;
    el.dataset.shown = String(ready && p.visible);
  }

  function render() {
    if (!width || !height) return;
    const v = view();
    if (!globe) globe = createGlobe(dotsCanvas, { devicePixelRatio: dpr, ...cobeOptions(v) });
    else globe.update(cobeOptions(v));
    drawOverlay(v);
    const lon = ((-(v.phi + Math.PI / 2) * 180) / Math.PI) % 360;
    const facing = Math.round(((lon + 540) % 360) - 180);
    slider.setAttribute('aria-valuenow', String(facing));
    slider.setAttribute('aria-valuetext', `Facing ${Math.abs(facing)}° ${facing < 0 ? 'west' : 'east'}`);
  }

  const moving = () => (clock < introLength && !paused) || Math.abs(spinVelocity) > 1e-4;

  function tick(ms: number) {
    frame = 0;
    const dt = last ? Math.min(0.05, (ms - last) / 1000) : 0;
    last = ms;
    if (clock < introLength && !paused) clock = Math.min(introLength, clock + dt);
    if (Math.abs(spinVelocity) > 1e-4) { spin += spinVelocity * dt * 60; spinVelocity *= 0.92; } else spinVelocity = 0;
    render();
    if (moving() && visible) frame = requestAnimationFrame(tick);
    else { last = 0; opts.onState(); }
  }

  function wake() {
    if (!frame && visible) { last = 0; frame = requestAnimationFrame(tick); }
  }

  // Drag rotates around the vertical axis only; the tilt stays put.
  let dragX: number | null = null, lastMove = 0;
  stage.addEventListener('pointerdown', event => {
    dragX = event.clientX; lastMove = event.timeStamp; spinVelocity = 0;
    root.dataset.dragging = '';
    stage.setPointerCapture(event.pointerId);
  });
  stage.addEventListener('pointermove', event => {
    if (dragX === null) return;
    const dx = event.clientX - dragX, dt = Math.max(1, event.timeStamp - lastMove);
    dragX = event.clientX; lastMove = event.timeStamp;
    spin += dx * DRAG_SPEED;
    spinVelocity = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : (dx * DRAG_SPEED) / (dt / 16.7);
    render();
  });
  const release = () => { if (dragX === null) return; dragX = null; delete root.dataset.dragging; wake(); };
  stage.addEventListener('pointerup', release);
  stage.addEventListener('pointercancel', release);

  slider.addEventListener('keydown', event => {
    const steps = { ArrowLeft: -1, ArrowDown: -1, ArrowRight: 1, ArrowUp: 1, PageDown: -3, PageUp: 3 }[event.key];
    if (steps) { event.preventDefault(); handle.rotate(steps); }
    else if (event.key === 'Home') { event.preventDefault(); handle.resetRotation(); }
  });

  new ResizeObserver(() => { size(); render(); }).observe(root);
  readColors(); size(); render();
  if (opts.animate) wake();

  const handle: GlobeHandle = {
    play() { if (clock >= introLength) clock = 0; paused = false; wake(); opts.onState(); },
    pause() { paused = true; opts.onState(); },
    replay() { clock = 0; spin = 0; spinVelocity = 0; paused = false; wake(); opts.onState(); },
    rotate(steps) { spinVelocity = 0; spin += steps * KEY_STEP; render(); },
    resetRotation() { spin = 0; spinVelocity = 0; render(); },
    setVisible(next) { visible = next; if (next && moving()) wake(); else if (!next && frame) { cancelAnimationFrame(frame); frame = 0; last = 0; } },
    refreshTheme() { readColors(); render(); },
    get paused() { return paused; },
    get settled() { return clock >= introLength; },
  };
  return handle;
}
