// COBE and the overlay share one orthographic projection through every camera move.
import createGlobe, { type Globe } from 'cobe';
import { CRETE_COAST, REGIONAL_LAND, type Coast } from './geo';

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
const DESTINATIONS: { name: string; at: LatLon }[] = [
  { name: 'London', at: [51.51, -0.13] },
  { name: 'New York', at: [40.71, -74.01] },
  { name: 'Sydney', at: [-33.87, 151.21] },
];
const YOU = { towards: [28, -15] as LatLon, altitude: 0.18 };
const R = 0.8;
const INTRO_SECONDS = 3.3;
const ARC_START = 2.85;
const ARC_STAGGER = 0.32;
const ARC_DRAW = 0.8;
const FINAL_LON = 27;
const FINAL_TILT = 0.6;
const DRAG_SPEED = 0.0045;
const KEY_STEP = Math.PI / 24;
const MIN_ZOOM = 0.8;
const MAX_ZOOM = 4;
const DOT_SPACING = 0.025;
const INTRO_END = ARC_START + DESTINATIONS.length * ARC_STAGGER + ARC_DRAW;
const toRad = (deg: number) => deg * Math.PI / 180;
const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));
const clamp01 = (n: number) => clamp(n, 0, 1);
const ease = (t: number) => 1 - (1 - t) ** 4;
const smooth = (t: number) => t * t * (3 - 2 * t);
const phiFacing = (lon: number) => -Math.PI / 2 - toRad(lon);
function unit([lat, lon]: LatLon): Vec3 {
  const a = toRad(lat);
  const b = toRad(lon) - Math.PI;
  const c = Math.cos(a);
  return [-c * Math.cos(b), Math.sin(a), c * Math.sin(b)];
}
const scaleVec = (p: Vec3, k: number): Vec3 => [p[0] * k, p[1] * k, p[2] * k];
const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

// A rotated hex lattice in Crete's local tangent plane. Doubling the spacing
// selects a subset of the same lattice, allowing a gradual detail handover.
const LATTICE_ANGLE = toRad(17);
const COS_LAT = Math.cos(toRad(CRETE[0]));
function tangent([lon, lat]: [number, number]): [number, number] {
  const x = (lon - CRETE[1]) * COS_LAT;
  const y = lat - CRETE[0];
  return [x * Math.cos(LATTICE_ANGLE) + y * Math.sin(LATTICE_ANGLE),
    -x * Math.sin(LATTICE_ANGLE) + y * Math.cos(LATTICE_ANGLE)];
}
function geographic(x: number, y: number): LatLon {
  return [CRETE[0] + x * Math.sin(LATTICE_ANGLE) + y * Math.cos(LATTICE_ANGLE),
    CRETE[1] + (x * Math.cos(LATTICE_ANGLE) - y * Math.sin(LATTICE_ANGLE)) / COS_LAT];
}
type DotTile = { center: Vec3; levels: Vec3[][] };
function halftone(polygons: Coast[], levelCount: number) {
  const rings = polygons.map(polygon => polygon.map(tangent));
  const tiles = new Map<string, DotTile>();
  const ys = rings.flatMap(ring => ring.map(p => p[1]));
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  for (let level = 0; level < levelCount; level++) {
    const spacing = DOT_SPACING * 2 ** level;
    const rowHeight = spacing * Math.sqrt(3) / 2;
    for (let row = Math.ceil(minY / rowHeight); row * rowHeight <= maxY; row++) {
      const y = row * rowHeight;
      const crossings: number[] = [];
      for (const ring of rings) {
        for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
          const [ax, ay] = ring[i];
          const [bx, by] = ring[j];
          if ((ay > y) !== (by > y))
            crossings.push(ax + (bx - ax) * (y - ay) / (by - ay));
        }
      }
      crossings.sort((a, b) => a - b);
      for (let i = 0; i + 1 < crossings.length; i += 2) {
        for (let col = Math.ceil(crossings[i] / spacing - row / 2);
          (col + row / 2) * spacing < crossings[i + 1]; col++) {
          const at = geographic((col + row / 2) * spacing, y);
          const latTile = Math.floor(at[0]);
          const lonTile = Math.floor(at[1]);
          const key = `${latTile}:${lonTile}`;
          let tile = tiles.get(key);
          if (!tile) {
            tile = { center: unit([latTile + 0.5, lonTile + 0.5]),
              levels: Array.from({ length: levelCount }, () => []) };
            tiles.set(key, tile);
          }
          tile.levels[level].push(unit(at));
        }
      }
    }
  }
  return [...tiles.values()];
}
const ISLAND_TILES = halftone([CRETE_COAST], 5);
const REGIONAL_TILES = halftone(REGIONAL_LAND, 7);

function project(p: Vec3, v: View) {
  const ct = Math.cos(v.theta);
  const st = Math.sin(v.theta);
  const cp = Math.cos(v.phi);
  const sp = Math.sin(v.phi);
  const x = cp * p[0] + sp * p[2];
  const y = sp * st * p[0] + ct * p[1] - cp * st * p[2];
  const z = -sp * ct * p[0] + st * p[1] + cp * ct * p[2];
  // COBE uses viewport height for both axes; offset shifts by scale / 2.
  const half = v.height / 2;
  return {
    x: v.cx + x * v.scale * half,
    y: v.cy - y * v.scale * half,
    z,
    visible: z >= 0 || x * x + y * y >= R * R,
    front: z >= 0
  };
}
function slerp(a: Vec3, b: Vec3, t: number): Vec3 {
  const angle = Math.acos(clamp(dot(a, b), -1, 1));
  if (angle < 1e-5)
    return a;
  const d = Math.sin(angle);
  const wa = Math.sin((1 - t) * angle) / d;
  const wb = Math.sin(t * angle) / d;
  return [a[0] * wa + b[0] * wb, a[1] * wa + b[1] * wb, a[2] * wa + b[2] * wb];
}
function greatArc(a: Vec3, b: Vec3, t: number): Vec3 {
  const angle = Math.acos(clamp(dot(a, b), -1, 1));
  // A shallow, asymmetric lift keeps short routes from curling at arrival.
  // The surface endpoints and every intermediate sample stay outside R.
  const height = Math.min(0.2, 0.03 + 0.12 * angle);
  const altitude = height * Math.sin(Math.PI * t) * (1 - 0.35 * t);
  return scaleVec(slerp(a, b, t), R + altitude);
}
function openArc(t: number): Vec3 {
  return scaleVec(slerp(unit(CRETE), unit(YOU.towards), t), R + YOU.altitude * t + 0.06 * Math.sin(Math.PI * t));
}
function routePoints(at: LatLon | null, amount: number, v: View) {
  const a = unit(CRETE);
  const b = unit(at ?? YOU.towards);
  const normal: Vec3 = [a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  // As the route plane turns edge-on, flatten its lift smoothly. Its great
  // circle stays visible without a raised silhouette folding back on itself.
  const planeFacing = Math.abs(project(normal, v).z) / Math.hypot(...normal);
  const lift = clamp01(planeFacing / 0.45) ** 2;
  return Array.from({ length: 129 }, (_, i) => {
    const t = i / 128 * amount;
    const surface = project(scaleVec(slerp(a, b, t), R), v);
    const raised = at ? greatArc(a, b, t) : openArc(t);
    const radius = R + (Math.hypot(...raised) - R) * lift;
    const p = project(scaleVec(slerp(a, b, t), radius), v);
    // Hide the far hemisphere even when a high route clears the silhouette.
    // Fade before its surface tangent: there is no back-of-limb return hook.
    const alpha = smooth(clamp01((surface.z / R - 0.12) / 0.22));
    return { ...p, alpha, visible: p.visible && alpha > 0.001 };
  });
}
function frameFor(width: number, height: number, _gutter: number, statementBottom: number, rem: number) {
  const wide = width >= 1100;
  const phone = width < 640;
  const diameter = wide ? Math.min(height * 1.4, width * 0.95)
    : phone ? width * 1.5 : Math.min(height * 1.08, width * 1.15);
  const scale = diameter / (R * height);
  const cx = width * (phone ? 0.54 : wide ? 0.60 : 0.57);
  const cy = phone ? statementBottom + 1.5 * rem + diameter / 2 : height * 0.62;
  const lon = FINAL_LON;
  // Crete's 2.80° coastline spans about 0.040 radians in this projection.
  const startScale = width * 0.52 / (0.040 * R * height / 2);
  return { scale, cx, cy, lon, startScale };
}

function cssRgb(color: Rgb, alpha = 1) {
  return `rgb(${color.map(c => Math.round(c * 255)).join(' ')} / ${alpha})`;
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
  const body = root.querySelector<HTMLElement>('[data-globe-body]')!;
  const dotsLayer = root.querySelector<HTMLElement>('[data-globe-dots-layer]')!;
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
      // COBE multiplies land AND ocean by baseColor; zero would erase both.
      // The canvas contrast filter removes its 0.1 * baseColor ocean pedestal.
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
    alpha?: number;
  }[], color: Rgb, alpha: number, lineWidth: number) {
    ctx.lineWidth = lineWidth * dpr;
    ctx.lineCap = 'round';
    ctx.setLineDash([]);
    if (points[0]?.alpha === undefined) {
      ctx.strokeStyle = cssRgb(color, alpha);
      ctx.beginPath();
      let pen = false;
      for (const p of points) {
        if (!p.visible) {
          pen = false;
          continue;
        }
        if (pen)
          ctx.lineTo(p.x * dpr, p.y * dpr);
        else
          ctx.moveTo(p.x * dpr, p.y * dpr);
        pen = true;
      }
      ctx.stroke();
      return;
    }
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1];
      const b = points[i];
      if (!a.visible || !b.visible)
        continue;
      ctx.strokeStyle = cssRgb(color, alpha * Math.min(a.alpha ?? 1, b.alpha ?? 1));
      ctx.beginPath();
      ctx.moveTo(a.x * dpr, a.y * dpr);
      ctx.lineTo(b.x * dpr, b.y * dpr);
      ctx.stroke();
    }
  }

  // A label is either legible or hidden: never half-faded where its route meets the horizon.
  const readable = (points: { alpha: number }[]) => points[points.length - 1].alpha >= 0.5;

  function placeLabel(key: string, p: {
    x: number;
    y: number;
    visible: boolean;
  }, opacity: number) {
    const el = labels.get(key);
    if (!el)
      return;
    el.style.left = `${p.x}px`;
    el.style.top = `${p.y}px`;
    el.style.opacity = String(p.visible ? opacity : 0);
  }

  function drawHalftone(tiles: DotTile[], v: View, spacing: number, color: Rgb, alpha: number, island = false) {
    if (alpha <= 0)
      return;
    const level = clamp(Math.log2(spacing / DOT_SPACING), 0, tiles[0].levels.length - 1);
    const lower = Math.floor(level);
    const upper = Math.min(lower + 1, tiles[0].levels.length - 1);
    const mix = smooth(level - lower);
    const pixelsPerRadian = R * v.scale * v.height / 2;
    for (const tile of tiles) {
      const center = project(scaleVec(tile.center, R), v);
      // A one-degree tile's chord fits inside this conservative screen radius.
      const reach = pixelsPerRadian * toRad(1.5);
      if (center.x + reach < 0 || center.x - reach > width ||
        center.y + reach < 0 || center.y - reach > height || center.z < -R * toRad(1.5))
        continue;
      for (const [detail, weight] of [[lower, 1 - mix], [upper, mix]]) {
        if (weight <= 0)
          continue;
        const dotSpacing = toRad(DOT_SPACING * 2 ** detail) * pixelsPerRadian;
        ctx.fillStyle = cssRgb(color, alpha * weight);
        for (const point of tile.levels[detail]) {
          const p = project(scaleVec(point, R), v);
          if (!p.front || p.x < -8 || p.x > width + 8 || p.y < -8 || p.y > height + 8)
            continue;
          // The minimum projected spacing contracts toward the limb. No minimum
          // radius: fine dots merge into a true-size island as the camera recedes.
          const radius = dotSpacing * 0.36 * Math.max(0.05, p.z / R) * dpr;
          if (island && !colors.dark) {
            ctx.beginPath();
            ctx.arc(p.x * dpr, p.y * dpr, radius * 1.35, 0, Math.PI * 2);
            ctx.fillStyle = cssRgb(colors.ink, 0.65 * weight);
            ctx.fill();
            ctx.fillStyle = cssRgb(color, alpha * weight);
          }
          ctx.beginPath();
          ctx.arc(p.x * dpr, p.y * dpr, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }

  function drawRoutes(v: View) {
    const zoom = v.scale / scaleFinal;
    const opening = smooth(clamp01((clock - 2.5) / 0.45));
    const alpha = opening * (1 - smooth(clamp01((zoom - 1.45) / 0.4)));
    ctx.globalAlpha = alpha;
    DESTINATIONS.forEach((dest, i) => {
      const reveal = clamp01((clock - ARC_START - i * ARC_STAGGER) / ARC_DRAW);
      const points = routePoints(dest.at, smooth(reveal), v);
      if (reveal > 0 && alpha > 0) {
        if (!colors.dark)
          stroke(points, colors.ink, 0.48, 2.5);
        stroke(points, colors.accent, 0.96, 1.35);
      }
      const end = project(scaleVec(unit(dest.at), R), v);
      placeLabel(dest.name, end, reveal >= 1 && readable(points) ? alpha : 0);
    });
    const reveal = clamp01((clock - ARC_START - DESTINATIONS.length * ARC_STAGGER) / ARC_DRAW);
    const points = routePoints(null, smooth(reveal), v);
    if (reveal > 0 && alpha > 0)
      stroke(points, colors.ink, 0.92, 1.25);
    const end = points[points.length - 1];
    placeLabel('you', end, reveal >= 1 && readable(points) ? alpha : 0);
    if (alpha > 0)
      drawMarker(v);
    ctx.globalAlpha = 1;
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
    const zoom = v.scale / scaleFinal;
    const regionalAlpha = smooth(clamp01((zoom - 2.4) / 2.4));
    // Around the handover, 1.3° matches COBE's 24,000-point Fibonacci spacing.
    const spacing = clamp(1.3 * (2.8 / zoom) ** 3, DOT_SPACING, 1.3);
    drawHalftone(REGIONAL_TILES, v, spacing, colors.ink, regionalAlpha * 0.8);
    const wire = colors.dark ? 0.25 : 0.48;
    for (let lat = -75; lat <= 75; lat += 15)
      stroke(Array.from({ length: 145 }, (_, i) => project(scaleVec(unit([lat, i * 2.5 - 180]), R), v)), colors.line, wire, 0.6);
    for (let lon = -180; lon < 180; lon += 15)
      stroke(Array.from({ length: 73 }, (_, i) => project(scaleVec(unit([i * 2.5 - 90, lon]), R), v)), colors.line, wire, 0.6);
    // Keep island dots about 3px apart, so Crete stays an amber halftone patch when the globe is small.
    const islandSpacing = clamp(3 / (R * v.scale * v.height / 2 * toRad(1)), DOT_SPACING, 0.4);
    drawHalftone(ISLAND_TILES, v, islandSpacing, colors.accent, 1, true);
    drawRoutes(v);
  }

  function render() {
    if (!width || !height)
      return;
    const v = view();
    const fade = 1 - smooth(clamp01((v.scale / scaleFinal - 2.4) / 2.4));
    dotsLayer.style.opacity = String(fade);
    const radius = R * v.scale * height / 2;
    body.style.width = body.style.height = `${radius * 2}px`;
    body.style.left = `${v.cx - radius}px`;
    body.style.top = `${v.cy - radius}px`;
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
