// COBE draws the globe and its land. A 2D overlay, sharing COBE's projection,
// adds the grid and an amber Crete: a halftone island in the close-up that
// becomes one amber globe dot as the camera pulls back.
import createGlobe, { type Globe } from 'cobe';
import { CRETE_COAST } from './geo';
// Natural Earth 1:10m land (v5.1.1), rasterised to 1024×512 equirectangular.
// COBE's own 256×128 map fattens coastlines and closes the Channel, Skagerrak and Red Sea.
import landUrl from './land.png?url';

type LatLon = [number, number];
type Vec3 = [number, number, number];
type Rgb = [number, number, number];
type View = { phi: number; theta: number; scale: number; cx: number; cy: number };

const CRETE: LatLon = [35.3, 24.8];
const R = 0.8;
const INTRO_SECONDS = 3.3;
// The globe faces Crete until it starts to turn.
const FINAL_LON = CRETE[1];
const FINAL_TILT = CRETE[0] * Math.PI / 180;
const SPIN = (2 * Math.PI) / 100; // One revolution every 100 s.
const DRAG_SPEED = 0.0045;
const KEY_STEP = Math.PI / 24;
const MIN_ZOOM = 0.8;
const MAX_ZOOM = 4;
// COBE fades each dot out over a chord of 0.008 on the unit sphere; this is its visible radius.
const COBE_DOT_RADIUS = 0.006;
const MAP_SAMPLES = 24000;
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

// COBE places its dots on a spherical Fibonacci lattice (dot j at height 1 − 2j/n, turned by
// fract(0.618034·j) of a revolution). The amber dot takes the lattice point nearest Crete,
// so it sits exactly where COBE would put a dot; the land map leaves Crete out.
function nearestGlobeDot(target: Vec3, samples: number): Vec3 {
  let best: Vec3 = target, distance = Infinity;
  for (let j = 0; j < samples; j++) {
    const y = 1 - 2 * j / samples;
    const r = Math.sqrt(1 - y * y);
    const angle = (j * 0.618034 % 1) * Math.PI * 2;
    const p: Vec3 = [Math.cos(angle) * r, y, Math.sin(angle) * r];
    const d = (p[0] - target[0]) ** 2 + (p[1] - target[1]) ** 2 + (p[2] - target[2]) ** 2;
    if (d < distance) {
      best = p;
      distance = d;
    }
  }
  return best;
}
const CRETE_DOT = nearestGlobeDot(unit(CRETE), MAP_SAMPLES);

// Same orthographic projection as COBE's shader; x and y in CSS pixels.
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

// Two adjustments to COBE 2.0.1, which offers no option for either:
// - It computes each dot's longitude with acos(-d.x/cos(j)); rounding pushes the argument
//   just past 1 along one meridian, acos returns NaN and a strip of the western Sahara
//   loses its dots. Clamp it while COBE compiles its shaders.
// - It uploads its built-in map image once that loads; upload our land map instead.
function createPatchedGlobe(canvas: HTMLCanvasElement, options: Parameters<typeof createGlobe>[1]) {
  const contexts = [WebGLRenderingContext, globalThis.WebGL2RenderingContext].filter(Boolean);
  const shaderSources = contexts.map(c => c.prototype.shaderSource);
  const texImages = contexts.map(c => c.prototype.texImage2D as (...args: unknown[]) => void);
  contexts.forEach((c, i) => {
    c.prototype.shaderSource = function (shader: WebGLShader, source: string) {
      shaderSources[i].call(this, shader, source.replace('acos(-d.x/cos(j))', 'acos(clamp(-d.x/cos(j),-1.,1.))'));
    };
    c.prototype.texImage2D = function (this: WebGLRenderingContext, ...args: unknown[]) {
      if (args.length === 6 && args[5] instanceof HTMLImageElement) {
        args[5] = land;
        contexts.forEach((c, i) => {
          c.prototype.texImage2D = texImages[i] as typeof c.prototype.texImage2D;
        });
      }
      texImages[i].apply(this, args);
    } as typeof c.prototype.texImage2D;
  });
  try {
    return createGlobe(canvas, options);
  }
  finally {
    contexts.forEach((c, i) => {
      c.prototype.shaderSource = shaderSources[i];
    });
  }
}

export function hasWebGL() {
  const c = document.createElement('canvas');
  return Boolean(c.getContext('webgl2') || c.getContext('webgl'));
}

export type GlobeHandle = {
  play(): void;
  pause(): void;
  replay(): void;
  rotate(steps: number): void;
  zoom(factor: number): void;
  reset(): void;
  setExploring(value: boolean): void;
  setVisible(value: boolean): void;
  refreshTheme(): void;
  readonly paused: boolean;
  readonly settled: boolean;
};

export function mountGlobe(root: HTMLElement, opts: { animate: boolean; onState(): void }): GlobeHandle {
  const dotsCanvas = root.querySelector<HTMLCanvasElement>('[data-globe-dots]')!;
  const lines = root.querySelector<HTMLCanvasElement>('[data-globe-lines]')!;
  const stage = root.querySelector<HTMLElement>('[data-globe-stage]')!;
  const ctx = lines.getContext('2d')!;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = matchMedia('(pointer: coarse)').matches;

  let width = 0, height = 0, dpr = 1;
  let frame = { scale: 1, cx: 0, cy: 0, startScale: 1 };
  let colors = { line: [1, 1, 1] as Rgb, accent: [1, 0.76, 0] as Rgb, dark: true };
  let clock = opts.animate ? 0 : INTRO_SECONDS;
  let paused = false, visible = true, exploring = false, raf = 0, last = 0;
  // The settled camera: rotation, zoom and center, plus inertia from a drag.
  let phi = phiFacing(FINAL_LON), theta = FINAL_TILT;
  let scale = 1, cx = 0, cy = 0, targetScale = 1;
  let velocityX = 0, velocityY = 0;
  let glide: { from: View; elapsed: number } | null = null;
  let drag: { x: number; y: number; time: number } | null = null;
  let globe: Globe | null = null;

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
    scale = targetScale = frame.scale;
    cx = frame.cx;
    cy = frame.cy;
    glide = null;
    for (const c of [dotsCanvas, lines]) {
      c.width = Math.round(width * dpr);
      c.height = Math.round(height * dpr);
    }
  }

  // During the intro the camera pulls back from Crete, centered and enlarged, to the settled framing.
  function view(): View {
    if (introDone())
      return { phi, theta, scale, cx, cy };
    const t = smooth(clock / INTRO_SECONDS);
    return {
      phi,
      theta,
      scale: frame.startScale + (frame.scale - frame.startScale) * ease(clock / INTRO_SECONDS),
      cx: width / 2 + (frame.cx - width / 2) * t,
      cy: height / 2 + (frame.cy - height / 2) * t,
    };
  }

  function cobeOptions(v: View) {
    return {
      phi: v.phi,
      theta: v.theta,
      scale: v.scale,
      width,
      height,
      // COBE shifts its center by offset * scale / 2 CSS pixels.
      offset: [2 * (v.cx - width / 2) / v.scale, 2 * (v.cy - height / 2) / v.scale] as [number, number],
      dark: 1,
      diffuse: 1.4,
      mapSamples: MAP_SAMPLES,
      mapBrightness: 12,
      mapBaseBrightness: 0,
      // COBE multiplies land and ocean by baseColor; the canvas contrast filter
      // removes the faint ocean it leaves, so only the dots remain.
      baseColor: [0.12, 0.12, 0.12] as Rgb,
      markerColor: colors.accent,
      glowColor: [0, 0, 0] as Rgb,
      markers: [],
      opacity: 1,
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
      drawAmber([dot], sphere * COBE_DOT_RADIUS, (1 - island) * clamp01(dot.z / (R * 0.15)));
  }

  function render() {
    if (!width || !height)
      return;
    const v = view();
    // COBE's dots are huge in the close-up; bring them in as the camera pulls back.
    dotsCanvas.style.opacity = String(1 - smooth(clamp01((v.scale / frame.scale - 1.6) / 1.6)));
    if (globe)
      globe.update(cobeOptions(v));
    else if (landLoaded)
      globe = createPatchedGlobe(dotsCanvas, { devicePixelRatio: dpr, ...cobeOptions(v) });
    ctx.clearRect(0, 0, lines.width, lines.height);
    drawGrid(v);
    drawCrete(v);
    const facing = Math.round(((-(v.phi + Math.PI / 2) * 180 / Math.PI) % 360 + 540) % 360 - 180);
    if (facing !== lastFacing) {
      lastFacing = facing;
      stage.setAttribute('aria-valuenow', String(facing));
      stage.setAttribute('aria-valuetext', `Facing ${Math.abs(facing)}° ${facing < 0 ? 'west' : 'east'}`);
    }
  }
  let lastFacing = NaN;

  const spinning = () => introDone() && !paused && !reduced && !drag;
  // Pause stops the intro and the spin; zoom glides and drag inertia still finish.
  const moving = () => !reduced && (glide !== null || Math.abs(velocityX) > 1e-4 || Math.abs(velocityY) > 1e-4
    || (!paused && (!introDone() || spinning())));

  function tick(ms: number) {
    raf = 0;
    const dt = last ? Math.min(0.05, (ms - last) / 1000) : 0;
    last = ms;
    if (!introDone() && !paused)
      clock = Math.min(INTRO_SECONDS, clock + dt);
    if (spinning())
      phi += SPIN * dt;
    if (!drag && (Math.abs(velocityX) > 1e-4 || Math.abs(velocityY) > 1e-4)) {
      phi += velocityX * dt * 60;
      theta = clamp(theta + velocityY * dt * 60, -toRad(65), toRad(65));
      velocityX *= 0.9;
      velocityY *= 0.9;
    }
    if (glide) {
      glide.elapsed += dt;
      const t = ease(clamp01(glide.elapsed / 0.6));
      scale = glide.from.scale + (targetScale - glide.from.scale) * t;
      cx = glide.from.cx + (frame.cx - glide.from.cx) * t;
      cy = glide.from.cy + (frame.cy - glide.from.cy) * t;
      if (t >= 1)
        glide = null;
    }
    render();
    if (moving() && visible)
      raf = requestAnimationFrame(tick);
    else
      last = 0;
  }

  function wake() {
    if (!raf && visible && moving()) {
      last = 0;
      raf = requestAnimationFrame(tick);
    }
  }

  // Take over from the intro (or a zoom) wherever the camera is, then ease the framing home.
  function takeOver() {
    const current = view();
    clock = INTRO_SECONDS;
    phi = current.phi;
    theta = current.theta;
    scale = current.scale;
    cx = current.cx;
    cy = current.cy;
    if (reduced) {
      scale = targetScale;
      cx = frame.cx;
      cy = frame.cy;
      glide = null;
    }
    else {
      glide = { from: current, elapsed: 0 };
    }
    opts.onState();
  }

  function zoom(factor: number) {
    if (!exploring)
      return;
    targetScale = clamp(targetScale * factor, frame.scale * MIN_ZOOM, frame.scale * MAX_ZOOM);
    takeOver();
    render();
    wake();
  }

  function rotate(steps: number) {
    if (!introDone())
      takeOver();
    velocityX = velocityY = 0;
    if (Math.abs(steps) === 2)
      theta = clamp(theta + Math.sign(steps) * KEY_STEP, -toRad(65), toRad(65));
    else
      phi += steps * KEY_STEP;
    render();
    wake();
  }

  function reset() {
    clock = INTRO_SECONDS;
    phi = phiFacing(FINAL_LON);
    theta = FINAL_TILT;
    scale = targetScale = frame.scale;
    cx = frame.cx;
    cy = frame.cy;
    glide = null;
    velocityX = velocityY = 0;
    render();
    wake();
  }

  stage.addEventListener('pointerdown', e => {
    if (!exploring && (e.pointerType === 'touch' || coarse))
      return;
    if (!introDone())
      takeOver();
    drag = { x: e.clientX, y: e.clientY, time: e.timeStamp };
    velocityX = velocityY = 0;
    root.dataset.dragging = '';
    stage.setPointerCapture(e.pointerId);
    e.preventDefault();
    wake();
  });
  stage.addEventListener('pointermove', e => {
    if (!drag || pinch)
      return;
    const dx = e.clientX - drag.x;
    const dy = e.clientY - drag.y;
    const frames = Math.max(1, e.timeStamp - drag.time) / 16.7;
    drag = { x: e.clientX, y: e.clientY, time: e.timeStamp };
    phi += dx * DRAG_SPEED;
    theta = clamp(theta + dy * DRAG_SPEED, -toRad(65), toRad(65));
    if (!reduced) {
      velocityX = clamp(dx * DRAG_SPEED / frames, -0.06, 0.06);
      velocityY = clamp(dy * DRAG_SPEED / frames, -0.06, 0.06);
    }
    if (!raf)
      render();
  });
  const release = () => {
    if (!drag)
      return;
    drag = null;
    delete root.dataset.dragging;
    wake();
  };
  stage.addEventListener('pointerup', release);
  stage.addEventListener('pointercancel', release);

  let pinch = 0;
  const spread = (e: TouchEvent) =>
    Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
  stage.addEventListener('touchstart', e => {
    if (exploring && e.touches.length === 2) {
      release();
      pinch = spread(e);
    }
  }, { passive: true });
  stage.addEventListener('touchend', () => {
    pinch = 0;
  }, { passive: true });
  stage.addEventListener('touchmove', e => {
    if (!exploring || e.touches.length !== 2)
      return;
    e.preventDefault();
    const now = spread(e);
    if (pinch)
      zoom(now / pinch);
    pinch = now;
  }, { passive: false });
  stage.addEventListener('wheel', e => {
    if (!exploring)
      return;
    e.preventDefault();
    zoom(Math.exp(-e.deltaY * 0.001));
  }, { passive: false });
  stage.addEventListener('keydown', e => {
    const steps: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: 2, ArrowDown: -2 };
    if (e.key in steps)
      rotate(steps[e.key]);
    else if (e.key === '+' || e.key === '=')
      zoom(1.12);
    else if (e.key === '-')
      zoom(1 / 1.12);
    else if (e.key === 'Home')
      reset();
    else
      return;
    e.preventDefault();
  });

  new ResizeObserver(() => {
    size();
    render();
  }).observe(root);
  // COBE waits for the land map; the close-up opens on Crete alone, so nothing is missed.
  let landLoaded = false;
  landReady.then(() => {
    landLoaded = true;
    render();
  });
  readColors();
  size();
  render();
  wake();

  queueMicrotask(opts.onState);
  return {
    play() {
      paused = false;
      wake();
      opts.onState();
    },
    pause() {
      paused = true;
      opts.onState();
    },
    replay() {
      if (reduced)
        return;
      reset();
      clock = 0;
      paused = false;
      wake();
      opts.onState();
    },
    rotate,
    zoom,
    reset,
    setExploring(value) {
      exploring = value;
      root.toggleAttribute('data-explored', value);
      if (!value) {
        targetScale = frame.scale;
        takeOver();
      }
      else if (!introDone()) {
        takeOver();
      }
      wake();
    },
    setVisible(value) {
      visible = value;
      if (value)
        wake();
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
    get paused() {
      return paused || reduced;
    },
    get settled() {
      return introDone();
    },
  };
}
