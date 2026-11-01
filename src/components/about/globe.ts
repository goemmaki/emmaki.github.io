// COBE draws the world. This overlay uses the same projection for the grid,
// Crete's fine halftone and routes, so they stay registered through camera moves.
import createGlobe, { type Globe } from 'cobe';
type LatLon = [number, number];
type Vec3 = [number, number, number];
type Rgb = [number, number, number];
type View = {
  phi: number;
  theta: number;
  scale: number;
  width: number;
  height: number;
  cx: number;
  cy: number;
};
const CRETE: LatLon = [35.36, 24.47];
// Coastline vertices use longitude first, unlike LatLon.
const COAST: [number, number][] = [
  [23.57, 35.60], [23.75, 35.53], [24.02, 35.52], [24.18, 35.60],
  [24.30, 35.50], [24.47, 35.37], [24.75, 35.40], [25.13, 35.34],
  [25.40, 35.33], [25.72, 35.30], [25.72, 35.19], [25.95, 35.30],
  [26.15, 35.20], [26.30, 35.28], [26.25, 35.05], [26.10, 35.00],
  [25.74, 35.01], [25.30, 34.98], [24.90, 34.93], [24.75, 34.93],
  [24.40, 35.18], [24.14, 35.20], [23.68, 35.23], [23.53, 35.28],
];
const DESTINATIONS: { name: string; at: LatLon }[] = [
  { name: 'London', at: [51.51, -0.13] },
  { name: 'New York', at: [40.71, -74.01] },
  { name: 'Sydney', at: [-33.87, 151.21] },
];
const YOU = { towards: [28, -15] as LatLon, altitude: 0.4 };
const R = 0.8;
const INTRO_SECONDS = 3.3;
const ARC_START = 2.25, ARC_STAGGER = 0.32, ARC_DRAW = 0.8;
const FINAL_LON = 35;
const FINAL_TILT = 0.6;
const DRAG_SPEED = 0.0045;
const KEY_STEP = Math.PI / 24;
const MIN_ZOOM = 0.8, MAX_ZOOM = 4;
// Crete spans about 2.8° of longitude; below this on-screen width it is drawn magnified around Rethymno.
const CRETE_SPAN_DEG = 2.8, MIN_ISLAND_PX = 64;
const INTRO_END = ARC_START + (DESTINATIONS.length + 1) * ARC_STAGGER + ARC_DRAW;
const toRad = (deg: number) => deg * Math.PI / 180;
const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));
const clamp01 = (n: number) => clamp(n, 0, 1);
const ease = (t: number) => 1 - (1 - t) ** 4;
const smooth = (t: number) => t * t * (3 - 2 * t);
const phiFacing = (lon: number) => -Math.PI / 2 - toRad(lon);
function unit([lat, lon]: LatLon): Vec3 {
  const a = toRad(lat), b = toRad(lon) - Math.PI, c = Math.cos(a);
  return [-c * Math.cos(b), Math.sin(a), c * Math.sin(b)];
}
const scaleVec = (p: Vec3, k: number): Vec3 => [p[0] * k, p[1] * k, p[2] * k];
function inside(point: LatLon, polygon: LatLon[]) {
  const [y, x] = point;
  let hit = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i], [xj, yj] = polygon[j];
    if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi)
      hit = !hit;
  }
  return hit;
}

function halftone(): Vec3[] {
  const points: Vec3[] = [];
  for (let lat = 34.90; lat <= 35.63; lat += 0.06)
    for (let lon = 23.48; lon <= 26.36; lon += 0.06)
      if (inside([lat, lon], COAST))
        points.push(unit([lat, lon]));
  return points;
}
const ISLAND_DOTS = halftone();
function project(p: Vec3, v: View) {
  const ct = Math.cos(v.theta), st = Math.sin(v.theta), cp = Math.cos(v.phi), sp = Math.sin(v.phi);
  const x = cp * p[0] + sp * p[2];
  const y = sp * st * p[0] + ct * p[1] - cp * st * p[2];
  const z = -sp * ct * p[0] + st * p[1] + cp * ct * p[2];
  // COBE uses viewport height for both axes; offset shifts by scale / 2.
  const half = v.height / 2;
  return {
    x: v.cx + x * v.scale * half,
    y: v.cy - y * v.scale * half,
    visible: z >= 0 || x * x + y * y >= R * R,
    front: z >= 0
  };
}

type Projected = ReturnType<typeof project>;

// A raised route ending near the horizon descends away from the viewer and
// projects as a hook. Stop the line where its second half turns back.
function trimHook(points: Projected[]) {
  const first = points[0], last = points[points.length - 1];
  const cx = last.x - first.x, cy = last.y - first.y;
  for (let i = Math.ceil(points.length / 2); i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x, dy = points[i].y - points[i - 1].y;
    if (dx * cx + dy * cy < 0)
      return points.slice(0, i);
  }
  return points;
}

function slerp(a: Vec3, b: Vec3, t: number): Vec3 {
  const dot = clamp(a[0] * b[0] + a[1] * b[1] + a[2] * b[2], -1, 1), angle = Math.acos(dot);
  if (angle < 1e-5)
    return a;
  const d = Math.sin(angle);
  const wa = Math.sin((1 - t) * angle) / d, wb = Math.sin(t * angle) / d;
  return [a[0] * wa + b[0] * wb, a[1] * wa + b[1] * wb, a[2] * wa + b[2] * wb];
}

function greatArc(a: Vec3, b: Vec3, t: number): Vec3 {
  const angle = Math.acos(clamp(a[0] * b[0] + a[1] * b[1] + a[2] * b[2], -1, 1));
  // Scale lift with angular distance to keep short routes shallow.
  // The great-circle samples remain outside the sphere at every step.
  const h = (0.04 + 0.2 * angle) * Math.sin(Math.PI * t);
  return scaleVec(slerp(a, b, t), R + h);
}

function openArc(t: number): Vec3 {
  const a = unit(CRETE), b = unit(YOU.towards);
  return scaleVec(slerp(a, b, t), R + YOU.altitude * t);
}

function frameFor(width: number, height: number, gutter: number, statementBottom: number, rem: number) {
  const wide = width >= 1100;
  const phone = width < 640;
  const diameter = wide ? Math.min(height * 1.15, width * 0.8) : phone ? width * 1.2 : Math.min(height, width * 1.05);
  const scale = diameter / (R * height);
  // Bleed slightly farther on wide screens to keep the left edge near 42%
  // while preserving the large diameter. Narrow screens use a 15% bleed.
  const cx = phone ? width * 0.62 : width - gutter - (wide ? 0.28 : 0.35) * diameter;
  const cy = phone ? statementBottom + 1.5 * rem + diameter / 2 : height * 0.55;
  const lon = phone ? 15 : wide ? FINAL_LON : 25;
  const startScale = clamp(width * 0.5 / (0.04 * R * height / 2), scale * 3.2, 110);
  return {
    scale,
    cx,
    cy,
    lon,
    startScale
  };
}

function rgbOf(color: string): Rgb {
  const c = document.createElement('canvas').getContext('2d', { willReadFrequently: true })!;
  c.fillStyle = color;
  c.fillRect(0, 0, 1, 1);
  const [r, g, b] = c.getImageData(0, 0, 1, 1).data;
  return [r / 255, g / 255, b / 255];
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
export function mountGlobe(root: HTMLElement, opts: {
  animate: boolean;
  onState(): void;
}): GlobeHandle {
  const dotsCanvas = root.querySelector<HTMLCanvasElement>('[data-globe-dots]')!;
  const lines = root.querySelector<HTMLCanvasElement>('[data-globe-lines]')!;
  const stage = root.querySelector<HTMLElement>('[data-globe-stage]')!;
  const labels = new Map([...root.querySelectorAll<HTMLElement>('[data-globe-label]')].map(el => [el.dataset.globeLabel!, el]));
  const ctx = lines.getContext('2d')!;
  const dpr = Math.min(devicePixelRatio || 1, 2), reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = matchMedia('(pointer: coarse)').matches;
  let width = 0, height = 0, scaleFinal = 1, startScale = 1, finalCx = 0, finalCy = 0;
  let colors = {
    line: [1, 1, 1] as Rgb,
    ink: [1, 1, 1] as Rgb,
    accent: [1, 0.76, 0] as Rgb,
    dark: true
  };
  let clock = opts.animate ? 0 : INTRO_END, paused = false, visible = true, exploring = false, frame = 0, last = 0;
  let phi = 0, theta = FINAL_TILT, scale = 1, spinVelocityX = 0, spinVelocityY = 0;
  let globe: Globe | null = null;
  let finalLon = FINAL_LON;
  let cameraCx = 0, cameraCy = 0;
  let targetScale = 1;
  let transition: {
    fromScale: number;
    fromCx: number;
    fromCy: number;
    elapsed: number;
  } | null = null;
  const introLength = INTRO_END;
  function readColors() {
    const s = getComputedStyle(root);
    colors = {
      line: rgbOf(s.getPropertyValue('--color-fg-2')),
      ink: rgbOf(s.getPropertyValue('--color-fg-max')),
      accent: rgbOf(s.getPropertyValue('--color-yellow-splash')),
      dark: document.documentElement.dataset.theme !== 'light'
    };
  }

  function size() {
    width = root.clientWidth;
    height = root.clientHeight;
    const statement = root.querySelector<HTMLElement>('.about-globe-statement')!;
    // Resolve the fluid gutter through a layout property, not the custom
    // property's unevaluated clamp()/calc() text.
    const gutter = parseFloat(getComputedStyle(statement).left);
    const statementBottom = statement.getBoundingClientRect().bottom - root.getBoundingClientRect().top;
    root.style.setProperty('--statement-bottom', `${statementBottom}px`);
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const framing = frameFor(width, height, gutter, statementBottom, rem);
    scaleFinal = framing.scale;
    finalCx = framing.cx;
    finalCy = framing.cy;
    finalLon = framing.lon;
    startScale = framing.startScale;
    cameraCx = finalCx;
    cameraCy = finalCy;
    root.style.setProperty('--globe-cx', `${finalCx}px`);
    root.style.setProperty('--globe-cy', `${finalCy}px`);
    scale = targetScale = scaleFinal;
    transition = null;
    phi = phiFacing(finalLon);
    for (const c of [dotsCanvas, lines]) {
      c.width = Math.round(width * dpr);
      c.height = Math.round(height * dpr);
    }
  }
  const introProgress = () => smooth(clamp01(clock / INTRO_SECONDS));
  function view(): View {
    const t = introProgress();
    const cx = clock < INTRO_SECONDS ? width / 2 + (finalCx - width / 2) * t : cameraCx;
    const cy = clock < INTRO_SECONDS ? height / 2 + (finalCy - height / 2) * t : cameraCy;
    const s = startScale + (scaleFinal - startScale) * ease(clamp01(clock / INTRO_SECONDS));
    const centerLon = CRETE[1] + (finalLon - CRETE[1]) * t;
    const p = phiFacing(centerLon) + (phi - phiFacing(finalLon));
    const th = toRad(CRETE[0]) + (FINAL_TILT - toRad(CRETE[0])) * t + (theta - FINAL_TILT);
    return {
      phi: p,
      theta: th,
      scale: clock < INTRO_SECONDS ? s : scale,
      width,
      height,
      cx,
      cy
    };
  }

  function cobeOptions(v: View) {
    return {
      phi: v.phi,
      theta: v.theta,
      scale: v.scale,
      width,
      height,
      offset: [2 * (v.cx - width / 2) / v.scale, 2 * (v.cy - height / 2) / v.scale] as [number, number],
      dark: 1,
      diffuse: 1.4,
      mapSamples: 24000,
      mapBrightness: 12,
      mapBaseBrightness: 0,
      baseColor: [0.12, 0.12, 0.12] as Rgb,
      markerColor: colors.accent,
      glowColor: [0, 0, 0] as Rgb,
      markers: [],
      markerElevation: 0.005,
      opacity: 1
    };
  }

  function stroke(points: {
    x: number;
    y: number;
    visible: boolean;
  }[], color: Rgb, alpha: number, lineWidth: number) {
    ctx.strokeStyle = `rgb(${color.map(c => Math.round(c * 255)).join(' ')} / ${alpha})`;
    ctx.lineWidth = lineWidth * dpr;
    ctx.setLineDash([]);
    ctx.beginPath();
    let pen = false;
    for (const p of points) {
      if (!p.visible) {
        pen = false;
        continue;
      }
      if (pen)
        ctx.lineTo(p.x * dpr, p.y * dpr);
      else {
        ctx.moveTo(p.x * dpr, p.y * dpr);
        pen = true;
      }
    }
    ctx.stroke();
  }

  function placeLabel(key: string, p: {
    x: number;
    y: number;
    visible: boolean;
  }, ready: boolean) {
    const el = labels.get(key);
    if (!el)
      return;
    el.style.left = `${p.x}px`;
    el.style.top = `${p.y}px`;
    el.dataset.shown = String(ready && p.visible);
  }

  function drawIsland(v: View) {
    const origin = project(scaleVec(unit(CRETE), R + 0.003), v);
    const neighbor = project(scaleVec(unit([CRETE[0], CRETE[1] + 0.06]), R + 0.003), v);
    const trueSpacing = Math.hypot(neighbor.x - origin.x, neighbor.y - origin.y);
    // When the globe is small, enlarge the island around Rethymno so it stays identifiable.
    const magnify = Math.max(1, MIN_ISLAND_PX / (trueSpacing / 0.06 * CRETE_SPAN_DEG));
    const radius = clamp(trueSpacing * magnify * 0.38, 0.8, 6) * dpr;
    for (const point of ISLAND_DOTS) {
      const p = project(scaleVec(point, R + 0.003), v);
      if (!p.front)
        continue;
      const x = (origin.x + (p.x - origin.x) * magnify) * dpr;
      const y = (origin.y + (p.y - origin.y) * magnify) * dpr;
      ctx.beginPath();
      ctx.arc(x, y, radius + 0.45 * dpr, 0, Math.PI * 2);
      ctx.fillStyle = `rgb(${colors.ink.map(c => Math.round(c * 255)).join(' ')} / .48)`;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgb(${colors.accent.map(c => Math.round(c * 255)).join(' ')})`;
      ctx.fill();
    }
  }

  function drawMarker(v: View) {
    const p = project(scaleVec(unit(CRETE), R + 0.008), v);
    if (p.front) {
      ctx.beginPath();
      ctx.arc(p.x * dpr, p.y * dpr, 4 * dpr, 0, Math.PI * 2);
      ctx.strokeStyle = `rgb(${colors.ink.map(c => Math.round(c * 255)).join(' ')} / .9)`;
      ctx.lineWidth = dpr;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(p.x * dpr, p.y * dpr, 1.4 * dpr, 0, Math.PI * 2);
      ctx.fillStyle = `rgb(${colors.accent.map(c => Math.round(c * 255)).join(' ')})`;
      ctx.fill();
    }
  }

  function drawOverlay(v: View) {
    ctx.clearRect(0, 0, lines.width, lines.height);
    const wire = clock < INTRO_SECONDS ? 0.28 : 0.2;
    for (let lat = -75; lat <= 75; lat += 15)
      stroke(Array.from({ length: 145 }, (_, i) => project(scaleVec(unit([lat, i * 2.5 - 180]), R), v)), colors.line, wire, 0.6);
    for (let lon = -180; lon < 180; lon += 15)
      stroke(Array.from({ length: 73 }, (_, i) => project(scaleVec(unit([i * 2.5 - 90, lon]), R), v)), colors.line, wire, 0.6);
    drawIsland(v);
    DESTINATIONS.forEach((dest, i) => {
      const reveal = clamp01((clock - ARC_START - i * ARC_STAGGER) / ARC_DRAW), t = smooth(reveal), a = unit(CRETE), b = unit(dest.at);
      const pts = trimHook(Array.from({ length: 65 }, (_, k) => project(greatArc(a, b, k / 64 * t), v)));
      if (t > 0) {
        if (!colors.dark)
          stroke(pts, colors.ink, .42, 2.5);
        stroke(pts, colors.accent, .96, 1.35);
      }
      const end = reveal >= 1 ? pts[pts.length - 1] : project(scaleVec(b, R + 0.004), v);
      placeLabel(dest.name, end, reveal >= 1);
    });
    const reveal = clamp01((clock - ARC_START - DESTINATIONS.length * ARC_STAGGER) / ARC_DRAW), t = smooth(reveal);
    const pts = Array.from({ length: 65 }, (_, k) => project(openArc(k / 64 * t), v));
    if (t > 0)
      stroke(pts, colors.ink, .92, 1.25);
    placeLabel('you', project(openArc(1), v), reveal >= 1);
    drawMarker(v);
  }

  function render() {
    if (!width || !height)
      return;
    const v = view(), fade = clamp01((scaleFinal * 3.6 - v.scale) / (scaleFinal * 2.6));
    dotsCanvas.style.opacity = String(fade);
    if (!globe)
      globe = createGlobe(dotsCanvas, { devicePixelRatio: dpr, ...cobeOptions(v) });
    else
      globe.update(cobeOptions(v));
    drawOverlay(v);
    const facing = Math.round((((-(v.phi + Math.PI / 2) * 180 / Math.PI + 540) % 360) - 180));
    stage.setAttribute('aria-valuenow', String(facing));
    stage.setAttribute('aria-valuetext', `Facing ${Math.abs(facing)}° ${facing < 0 ? 'west' : 'east'}`);
  }
  const moving = () => (clock < introLength && !paused) || transition !== null ||
    (!drag && (Math.abs(spinVelocityX) > 0.0002 || Math.abs(spinVelocityY) > 0.0002));
  function tick(ms: number) {
    frame = 0;
    const dt = last ? Math.min(.05, (ms - last) / 1000) : 0;
    last = ms;
    if (clock < introLength && !paused)
      clock = Math.min(introLength, clock + dt);
    if (!drag && (Math.abs(spinVelocityX) > 0.0002 || Math.abs(spinVelocityY) > 0.0002)) {
      phi += spinVelocityX * dt * 60;
      theta = clamp(theta + spinVelocityY * dt * 60, -toRad(65), toRad(65));
      spinVelocityX *= .84;
      spinVelocityY *= .84;
    }
    else if (!drag) {
      spinVelocityX = spinVelocityY = 0;
    }
    if (transition) {
      transition.elapsed += dt;
      const t = ease(clamp01(transition.elapsed / 0.6));
      scale = transition.fromScale + (targetScale - transition.fromScale) * t;
      cameraCx = transition.fromCx + (finalCx - transition.fromCx) * t;
      cameraCy = transition.fromCy + (finalCy - transition.fromCy) * t;
      if (t >= 1)
        transition = null;
    }
    render();
    if (moving() && visible)
      frame = requestAnimationFrame(tick);
    else {
      last = 0;
      opts.onState();
    }
  }

  function wake() {
    if (!frame && visible) {
      last = 0;
      frame = requestAnimationFrame(tick);
    }
  }
  // Capture the rendered camera before stopping the intro; only framing eases,
  // while the captured rotation remains under the pointer's control.
  function settleFraming() {
    const current = view();
    clock = introLength;
    phi = current.phi;
    theta = current.theta;
    scale = current.scale;
    cameraCx = current.cx;
    cameraCy = current.cy;
    targetScale = scaleFinal;
    transition = reduced ? null : {
      fromScale: scale,
      fromCx: cameraCx,
      fromCy: cameraCy,
      elapsed: 0
    };
    if (reduced) {
      scale = scaleFinal;
      cameraCx = finalCx;
      cameraCy = finalCy;
    }
    wake();
  }
  let drag: {
    x: number;
    y: number;
    time: number;
  } | null = null;
  stage.addEventListener('pointerdown', e => {
    if (!exploring && (e.pointerType === 'touch' || coarse))
      return;
    if (clock < INTRO_SECONDS)
      settleFraming();
    clock = introLength;
    drag = { x: e.clientX, y: e.clientY, time: e.timeStamp };
    spinVelocityX = spinVelocityY = 0;
    root.dataset.dragging = '';
    stage.setPointerCapture(e.pointerId);
    e.preventDefault();
  });
  stage.addEventListener('pointermove', e => {
    if (e.pointerType === 'touch' && pinch)
      return;
    if (!drag)
      return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y, dt = Math.max(1, e.timeStamp - drag.time);
    drag = { x: e.clientX, y: e.clientY, time: e.timeStamp };
    phi += dx * DRAG_SPEED;
    theta = clamp(theta + dy * DRAG_SPEED, -toRad(65), toRad(65));
    if (!reduced) {
      const cap = .075;
      spinVelocityX = clamp(dx * DRAG_SPEED / (dt / 16.7), -cap, cap);
      spinVelocityY = clamp(dy * DRAG_SPEED / (dt / 16.7), -cap, cap);
    }
    clock = introLength;
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
  stage.addEventListener('touchstart', e => {
    if (exploring && e.touches.length === 2) {
      drag = null;
      delete root.dataset.dragging;
      spinVelocityX = spinVelocityY = 0;
      pinch = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
    }
  }, { passive: true });
  stage.addEventListener('touchend', () => {
    pinch = 0;
  }, { passive: true });
  stage.addEventListener('touchmove', e => {
    if (!exploring || e.touches.length !== 2)
      return;
    e.preventDefault();
    const n = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
    if (pinch) {
      zoom(n / pinch);
      render();
    }
    pinch = n;
  }, { passive: false });
  stage.addEventListener('wheel', e => {
    if (!exploring)
      return;
    e.preventDefault();
    zoom(Math.exp(-e.deltaY * .001));
    render();
  }, { passive: false });
  stage.addEventListener('keydown', e => {
    const steps: Record<string, number> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: 2,
      ArrowDown: -2
    };
    if (e.key in steps) {
      e.preventDefault();
      rotate(steps[e.key]);
    }
    else if (exploring && e.key === '+') {
      e.preventDefault();
      zoom(1.12);
      render();
    }
    else if (exploring && e.key === '-') {
      e.preventDefault();
      zoom(1 / 1.12);
      render();
    }
    else if (e.key === 'Home') {
      e.preventDefault();
      reset();
    }
  });
  function zoom(factor: number) {
    if (!exploring)
      return;
    const current = view();
    clock = introLength;
    phi = current.phi;
    theta = current.theta;
    cameraCx = current.cx;
    cameraCy = current.cy;
    scale = current.scale;
    targetScale = clamp(targetScale * factor, scaleFinal * MIN_ZOOM, scaleFinal * MAX_ZOOM);
    transition = reduced ? null : {
      fromScale: scale,
      fromCx: cameraCx,
      fromCy: cameraCy,
      elapsed: 0
    };
    if (reduced)
      scale = targetScale;
    wake();
  }

  function rotate(steps: number) {
    if (clock < INTRO_SECONDS)
      settleFraming();
    clock = introLength;
    scale = scale || scaleFinal;
    spinVelocityX = spinVelocityY = 0;
    if (Math.abs(steps) === 2)
      theta = clamp(theta + Math.sign(steps) * KEY_STEP, -toRad(65), toRad(65));
    else
      phi += steps * KEY_STEP;
    render();
  }

  function reset() {
    transition = null;
    cameraCx = finalCx;
    cameraCy = finalCy;
    targetScale = scaleFinal;
    clock = introLength;
    phi = phiFacing(finalLon);
    theta = FINAL_TILT;
    scale = scaleFinal;
    spinVelocityX = spinVelocityY = 0;
    render();
  }
  new ResizeObserver(() => {
    size();
    render();
  }).observe(root);
  readColors();
  size();
  render();
  if (opts.animate)
    wake();
  const handle: GlobeHandle = {
    play() {
      if (reduced)
        return;
      if (clock >= introLength) {
        reset();
        clock = 0;
      }
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
      phi = phiFacing(finalLon);
      theta = FINAL_TILT;
      scale = scaleFinal;
      spinVelocityX = spinVelocityY = 0;
      paused = false;
      wake();
      opts.onState();
    },
    rotate,
    zoom(f) {
      zoom(f);
      render();
    },
    reset,
    setExploring(value) {
      exploring = value;
      root.toggleAttribute('data-explored', value);
      if (value) {
        if (clock < INTRO_SECONDS)
          settleFraming();
        clock = introLength;
      }
      else {
        settleFraming();
      }
      render();
      if (!reduced)
        wake();
    },
    setVisible(value) {
      visible = value;
      if (value && moving())
        wake();
      else if (!value && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
        last = 0;
      }
    },
    refreshTheme() {
      readColors();
      render();
    },
    get paused() {
      return paused;
    },
    get settled() {
      return clock >= introLength;
    },
  };
  queueMicrotask(opts.onState);
  return handle;
}
