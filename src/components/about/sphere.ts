import landUrl from './land.png?url';

export type LatLon = [number, number];
export type Vec3 = [number, number, number];
export type Rgb = [number, number, number];
export type View = { phi: number; theta: number; scale: number; cx: number; cy: number };

export const R = 0.8;
export const toRad = (deg: number) => deg * Math.PI / 180;
export const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));
export const clamp01 = (n: number) => clamp(n, 0, 1);
export const smooth = (t: number) => t * t * (3 - 2 * t);

export function unit([lat, lon]: LatLon): Vec3 {
  const a = toRad(lat);
  const b = toRad(lon) - Math.PI;
  return [-Math.cos(a) * Math.cos(b), Math.sin(a), Math.cos(a) * Math.sin(b)];
}

// Shared orthographic projection; x and y in CSS pixels.
export function project(p: Vec3, v: View, height: number) {
  const ct = Math.cos(v.theta), st = Math.sin(v.theta);
  const cp = Math.cos(v.phi), sp = Math.sin(v.phi);
  const x = cp * p[0] + sp * p[2];
  const y = sp * st * p[0] + ct * p[1] - cp * st * p[2];
  const z = -sp * ct * p[0] + st * p[1] + cp * ct * p[2];
  const half = R * v.scale * height / 2;
  return { x: v.cx + x * half, y: v.cy - y * half, z };
}

export function rgbOf(color: string): Rgb {
  const c = document.createElement('canvas').getContext('2d', { willReadFrequently: true })!;
  c.fillStyle = color;
  c.fillRect(0, 0, 1, 1);
  const [r, g, b] = c.getImageData(0, 0, 1, 1).data;
  return [r / 255, g / 255, b / 255];
}
export const css = (c: Rgb, alpha = 1) => `rgb(${c.map(n => Math.round(n * 255)).join(' ')} / ${alpha})`;

export const land = new Image();
land.src = landUrl;
export const landReady = land.decode();

export function hasWebGL() {
  const c = document.createElement('canvas');
  return Boolean(c.getContext('webgl2'));
}

// A software renderer can draw the globe but not animate it smoothly.
export function hasGpu() {
  const gl = document.createElement('canvas').getContext('webgl2', { failIfMajorPerformanceCaveat: true });
  if (!gl)
    return false;
  const info = gl.getExtension('WEBGL_debug_renderer_info');
  const renderer = String(gl.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : gl.RENDERER));
  return !/swiftshader|llvmpipe|softpipe|software|basic render/i.test(renderer);
}
