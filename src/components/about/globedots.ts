import { createSpherePass, nearestLattice, unitVector, type View as CameraView } from 'globedots';

// The exported sphere pass lets our existing controller own interaction and scheduling.
// These shader edits target the exact 0.1.1 pin. They affect this context only, and
// fail explicitly if an upgrade changes an anchor. No WebGL prototypes are modified.
// Far-side dot opacity in dark mode (owner, 2026-11-02); light mode turns it off.
export const FAR_HEMISPHERE = 0.12;
export const DOT_COUNT = 30_000;
export const DOT_RATIO = 0.42;
export const DOT_MASK_WIDTH = 256;
export const DOT_MASK_HEIGHT = Math.ceil(DOT_COUNT / DOT_MASK_WIDTH);
export const CRETE_DOT_TARGET: [number, number] = [35.35, 24.55];
export const CRETE_LATTICE = nearestLattice(unitVector(...CRETE_DOT_TARGET), DOT_COUNT);

export type GlobeView = { phi: number; theta: number; scale: number; cx: number; cy: number };

function replace(source: string, before: string, after: string) {
  if (!source.includes(before))
    throw new Error('Globedots 0.1.1 shader adapter: source anchor changed');
  return source.replace(before, after);
}

export function createDots(canvas: HTMLCanvasElement, land: HTMLImageElement) {
  const gl = canvas.getContext('webgl2', { alpha: true, antialias: false });
  if (!gl)
    throw new Error('Globedots requires WebGL2');
  let center: [number, number] = [0, 0];
  let farSideOpacity = FAR_HEMISPHERE;
  const shaderSource = gl.shaderSource.bind(gl);
  gl.shaderSource = (shader, source) => {
    if (source.includes('out vec3 vRay;')) {
      source = replace(source, 'out vec3 vRay;', 'out vec3 vRay;\nuniform vec2 uCenter;');
      source = replace(source,
        'vRay = uForward + (uRight * ndc.x * uAspect + uUp * ndc.y) / uFocal;',
        'vRay = (uRight * (ndc.x * uAspect - uCenter.x) + uUp * (ndc.y - uCenter.y)) / uFocal;');
    }
    else if (source.includes('vec3 nearestLattice(')) {
      source = replace(source, 'out vec4 fragColor;',
        'out vec4 fragColor;\nuniform int uLandCols;\nuniform int uCreteIndex;\nuniform float uFarSideOpacity;');
      // Parallel rays reproduce the original orthographic framing exactly, including
      // the giant opening scale. A distant perspective camera loses float precision.
      const start = source.indexOf('  vec3 rd = normalize(vRay);');
      const end = source.indexOf('  float dist, index;', start);
      if (start < 0 || end < 0)
        throw new Error('Globedots 0.1.1 shader adapter: ray anchors changed');
      source = source.slice(0, start) + `
  float disc = 1.0 - dot(vRay, vRay);
  if (disc < 0.0) { fragColor = vec4(0.0); return; }
  vec3 p = vRay + uCamPos * sqrt(disc);
` + source.slice(end);
      source = replace(source, 'float isLand = max(texture(uLand, uv).r, uOceanDots);', `
  // The amber Crete overlay replaces this one fixed-lattice dot; surrounding land stays white.
  float isLand = int(index) == uCreteIndex ? 0.0
    : max(texelFetch(uLand, ivec2(int(index) % uLandCols, int(index) / uLandCols), 0).r, uOceanDots);`);
      source = replace(source, '  // Night. The terminator', `
  // The exit intersection uses the same land texture and Fibonacci lattice.
  // It is visible through empty sea only; it never dims a front-facing dot.
  if (uFarSideOpacity > 0.0) {
    vec3 back = vRay - uCamPos * sqrt(disc);
    float backDist, backIndex;
    vec3 backDot = nearestLattice(back.xzy, backDist, backIndex).xzy;
    float backAA = fwidth(backDist);
    float backCoverage = 1.0 - smoothstep(uDotRadius - backAA, uDotRadius + backAA, backDist);
    float backLand = texelFetch(uLand, ivec2(int(backIndex) % uLandCols, int(backIndex) / uLandCols), 0).r;
    color += uDot * uFarSideOpacity * backCoverage * backLand
      * pow(sqrt(disc), uDiffuse) * (1.0 - coverage * isLand);
  }

  // Night. The terminator`);
    }
    shaderSource(shader, source);
  };
  let pass: ReturnType<typeof createSpherePass>;
  try {
    pass = createSpherePass(gl, {
      dotPitch: 0, dotRatio: DOT_RATIO, diffuse: 1.4, oceanDots: 0,
      dots: DOT_COUNT, base: '#000000', dot: '#ffffff', rim: 0, glowWidth: 0, night: 0, graticule: 0,
    });
  }
  finally {
    gl.shaderSource = shaderSource;
  }
  // Set our extra uniform immediately before the sphere's draw call. This wrapper
  // belongs to this one context, which has no other passes or built-in interaction.
  const drawArrays = gl.drawArrays.bind(gl);
  gl.drawArrays = (mode, first, count) => {
    const program = gl.getParameter(gl.CURRENT_PROGRAM) as WebGLProgram;
    gl.uniform2f(gl.getUniformLocation(program, 'uCenter'), ...center);
    gl.uniform1i(gl.getUniformLocation(program, 'uLandCols'), land.naturalWidth);
    gl.uniform1i(gl.getUniformLocation(program, 'uCreteIndex'), CRETE_LATTICE.index);
    gl.uniform1f(gl.getUniformLocation(program, 'uFarSideOpacity'), farSideOpacity);
    drawArrays(mode, first, count);
  };
  if (land.naturalHeight !== DOT_MASK_HEIGHT || land.naturalWidth !== DOT_MASK_WIDTH)
    throw new Error(`Expected ${DOT_MASK_WIDTH}×${DOT_MASK_HEIGHT} fixed-lattice land mask, got ${land.naturalWidth}×${land.naturalHeight}`);
  const image = document.createElement('canvas');
  image.width = land.naturalWidth;
  image.height = land.naturalHeight;
  const ctx = image.getContext('2d', { willReadFrequently: true })!;
  ctx.drawImage(land, 0, 0);
  const rgba = ctx.getImageData(0, 0, image.width, image.height).data;
  const mask = new Uint8Array(image.width * image.height);
  for (let i = 0; i < mask.length; i++)
    mask[i] = rgba[i * 4];
  pass.setLand(mask, image.width, image.height);

  return {
    setFarSideOpacity(value: number) {
      farSideOpacity = value;
    },
    draw(v: GlobeView, width: number, height: number) {
      const cp = Math.cos(v.phi), sp = Math.sin(v.phi);
      const ct = Math.cos(v.theta), st = Math.sin(v.theta);
      const camera: CameraView = {
        position: [-cp * ct, st, -sp * ct], forward: [cp * ct, -st, sp * ct],
        right: [-sp, 0, cp], up: [cp * st, ct, sp * st],
        focal: 0.8 * v.scale, aspect: width / height,
      };
      center = [2 * (v.cx - width / 2) / height, -2 * (v.cy - height / 2) / height];
      gl.viewport(0, 0, canvas.width, canvas.height);
      return pass.draw(camera, height);
    },
  };
}
