import { createDots, FAR_HEMISPHERE } from './about/globedots';
import { clamp, clamp01, css, hasGpu, hasWebGL, land, landReady, project, R, rgbOf, smooth, toRad, unit, type LatLon, type Rgb, type View } from './about/sphere';

const PIXEL_BUDGET = 8e6;
const SPIN = (2 * Math.PI) / 100;
const TURN_MS = 1200;
const TAU = 2 * Math.PI;
const SETTLE_S = 0.8; // After a flick, the spin eases back to SPIN over about this long.
const DRAG_SLOP = 4; // Pixels a press can move before it counts as a drag, not a pin click.
const phiFacing = (lon: number) => -Math.PI / 2 - toRad(lon);
const angleDelta = (to: number, from: number) => ((to - from + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI;

type Pin = { button: HTMLButtonElement; point: ReturnType<typeof unit>; lat: number; lng: number; index: number };

export function mountTestimonialGlobe(root: HTMLElement) {
  const sphere = root.querySelector<HTMLElement>('[data-sphere]')!;
  const dotsCanvas = root.querySelector<HTMLCanvasElement>('[data-sphere-dots]')!;
  const gridCanvas = root.querySelector<HTMLCanvasElement>('[data-sphere-grid]')!;
  const ctx = gridCanvas.getContext('2d')!;
  const reviews = [...root.querySelectorAll<HTMLElement>('[data-review]')];
  const count = root.querySelector<HTMLElement>('[data-count]')!;
  const stack = root.querySelector<HTMLElement>('[data-review-card]')!;
  const timerLine = root.querySelector<HTMLElement>('.testimonial-timer')!;
  const fill = () => timerLine.querySelector<HTMLElement>('[data-fill]')!;
  const pins: Pin[] = [...root.querySelectorAll<HTMLButtonElement>('[data-pin]')].map(button => {
    const lat = Number(button.dataset.lat), lng = Number(button.dataset.lng);
    return { button, lat, lng, point: unit([lat, lng]), index: Number(button.dataset.index) };
  });
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const webgl = hasWebGL();
  const gpu = webgl && hasGpu();
  let canMove = gpu && !motion.matches;
  let visible = true, held = false, autoplay = canMove, raf = 0, last = 0;
  let width = 0, height = 0, dpr = 1, globe: ReturnType<typeof createDots> | null = null;
  let colors: { line: Rgb; dark: boolean } = { line: [1, 1, 1], dark: true };
  let current = 0, phi = phiFacing(pins[0].lng), theta = toRad(pins[0].lat);
  // dir: +1 spins east to west (phi rising), -1 west to east; the last drag sets it and autoplay follows it.
  let dir = 1, velocity = SPIN;
  let drag: { id: number; x: number; y: number; t: number; moved: boolean; turned: number } | null = null, dragged = false;
  let transition: { startPhi: number; deltaPhi: number; startTheta: number; targetTheta: number; startTime: number } | null = null;

  if (!webgl)
    root.dataset.noWebgl = '';

  function view(): View {
    return { phi, theta, scale: 1, cx: width / 2, cy: height / 2 };
  }

  function readColors() {
    const style = getComputedStyle(root);
    colors = { line: rgbOf(style.getPropertyValue('--color-fg-2')), dark: document.documentElement.dataset.theme !== 'light' };
  }

  function size() {
    width = sphere.clientWidth;
    height = sphere.clientHeight;
    if (!width || !height)
      return;
    dpr = Math.min(devicePixelRatio || 1, 2, Math.sqrt(PIXEL_BUDGET / (width * height)));
    for (const canvas of [dotsCanvas, gridCanvas]) {
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
    }
  }

  function drawGrid(v: View) {
    ctx.clearRect(0, 0, gridCanvas.width, gridCanvas.height);
    ctx.strokeStyle = css(colors.line, colors.dark ? 0.25 : 0.45);
    ctx.lineWidth = 0.6 * dpr;
    ctx.beginPath();
    const trace = (point: (i: number) => LatLon, steps: number) => {
      let pen = false;
      for (let i = 0; i < steps; i++) {
        const p = project(unit(point(i)), v, height);
        if (p.z < 0) { pen = false; continue; }
        if (pen) ctx.lineTo(p.x * dpr, p.y * dpr);
        else ctx.moveTo(p.x * dpr, p.y * dpr);
        pen = true;
      }
    };
    for (let lat = -75; lat <= 75; lat += 15) trace(i => [lat, i * 2.5 - 180], 145);
    for (let lon = -180; lon < 180; lon += 15) trace(i => [i * 2.5 - 90, lon], 73);
    ctx.stroke();
  }

  function placePins(v: View) {
    const front: Pin[] = [];
    for (const pin of pins) {
      const p = project(pin.point, v, height);
      const facing = p.z > 0;
      pin.button.style.left = `${p.x}px`;
      pin.button.style.top = `${p.y}px`;
      pin.button.style.opacity = String(facing ? clamp01(p.z / 0.24) : 0);
      pin.button.inert = !facing;
      pin.button.tabIndex = -1;
      pin.button.toggleAttribute('data-active', pin.index === current);
      if (facing) front.push(pin);
    }
    const roving = front.find(pin => pin.index === current) ?? front[0];
    if (roving) roving.button.tabIndex = 0;
  }

  function render() {
    if (!visible || document.hidden || !width || !height)
      return;
    const v = view();
    if (globe) {
      globe.setFarSideOpacity(colors.dark ? FAR_HEMISPHERE : 0);
      globe.draw(v, width, height);
    }
    drawGrid(v);
    placePins(v);
  }

  function moveCamera(now: number) {
    if (transition) {
      const progress = clamp01((now - transition.startTime) / TURN_MS);
      const eased = smooth(progress);
      phi = transition.startPhi + transition.deltaPhi * eased;
      theta = transition.startTheta + (transition.targetTheta - transition.startTheta) * eased;
      if (progress >= 1)
        transition = null;
    }
    else if (canMove && last && !drag?.moved) {
      const dt = Math.min(0.05, (now - last) / 1000);
      velocity += (dir * SPIN - velocity) * (1 - Math.exp(-dt / SETTLE_S));
      phi += velocity * dt;
    }
  }

  function tick(now: number) {
    raf = 0;
    moveCamera(now);
    last = now;
    render();
    if ((transition || canMove) && visible && !document.hidden)
      raf = requestAnimationFrame(tick);
    else
      last = 0;
  }

  function wake() {
    if (!raf && visible && !document.hidden && (transition || canMove)) {
      last = 0;
      raf = requestAnimationFrame(tick);
    }
  }

  // The shared fill line is the autoplay clock: it runs while autoplay is on and nothing holds it,
  // and its animationend (7 s, in globals.css) brings the next review. Paused, it resumes where it was.
  function scheduleAutoplay() {
    timerLine.toggleAttribute('data-off', !autoplay);
    fill().toggleAttribute('data-held', !autoplay || held || !visible || document.hidden || Boolean(drag?.moved));
  }

  function restartFill() {
    const next = fill().cloneNode(false) as HTMLElement;
    fill().replaceWith(next);
    scheduleAutoplay();
  }

  // How far the globe must still turn, in its spin direction, to face a longitude.
  const ahead = (lng: number) => ((dir * (phiFacing(lng) - phi)) % TAU + TAU) % TAU;

  // The next city the spin will bring round, whichever way the globe is turning.
  function nextInSpin() {
    const others = pins.filter(pin => pin.index !== current);
    return others.reduce((best, pin) => ahead(pin.lng) < ahead(best.lng) ? pin : best).index;
  }

  // Ease the card from its old height to its new one (a long review opening or giving way to a short one).
  function animateHeight(from: number) {
    const to = stack.offsetHeight;
    if (from === to || motion.matches)
      return;
    stack.style.height = `${from}px`;
    void stack.offsetHeight;
    stack.style.height = `${to}px`;
    stack.addEventListener('transitionend', () => { stack.style.height = ''; }, { once: true });
  }

  // Long quotes clamp at five lines; See more opens them to full height and See less closes them again.
  function setOpen(review: HTMLElement, open: boolean, animate = true) {
    const quote = review.querySelector<HTMLElement>('[data-quote]')!;
    const more = review.querySelector<HTMLButtonElement>('[data-more]')!;
    more.textContent = open ? 'See less' : 'See more';
    more.setAttribute('aria-expanded', String(open));
    if (open) {
      quote.toggleAttribute('data-open', true);
      quote.style.maxHeight = `${quote.scrollHeight}px`;
      return;
    }
    quote.style.maxHeight = '';
    if (!animate || motion.matches || !quote.hasAttribute('data-open'))
      quote.removeAttribute('data-open');
    else
      quote.addEventListener('transitionend', () => { if (!quote.style.maxHeight) quote.removeAttribute('data-open'); }, { once: true });
  }

  function markLong() {
    for (const review of reviews) {
      const quote = review.querySelector<HTMLElement>('[data-quote]')!;
      if (!quote.hasAttribute('data-open'))
        review.toggleAttribute('data-long', quote.scrollHeight > quote.clientHeight + 1);
    }
  }

  function select(index: number, manual: boolean) {
    if (manual) {
      autoplay = false;
      scheduleAutoplay();
    }
    if (index === current)
      return;
    moveCamera(performance.now());
    current = index;
    const previous = reviews.find(review => review.hasAttribute('data-current'));
    const from = stack.offsetHeight;
    reviews.forEach((review, i) => review.toggleAttribute('data-current', i === current));
    animateHeight(from);
    // An opened review closes once it has faded out, ready to start clamped next time.
    if (previous?.querySelector('[data-quote][data-open]'))
      window.setTimeout(() => { if (!previous.hasAttribute('data-current')) setOpen(previous, false, false); }, 400);
    count.textContent = `${String(current + 1).padStart(2, '0')} / ${String(reviews.length).padStart(2, '0')}`;
    const pin = pins[current];
    const targetPhi = phiFacing(pin.lng);
    transition = canMove ? {
      startPhi: phi,
      deltaPhi: manual ? angleDelta(targetPhi, phi) : dir * ahead(pin.lng),
      startTheta: theta,
      targetTheta: toRad(pin.lat),
      startTime: performance.now(),
    } : null;
    velocity = 0;
    if (!canMove) {
      phi = targetPhi;
      theta = toRad(pin.lat);
    }
    render();
    wake();
    if (manual) scheduleAutoplay();
  }

  // Grab and turn the globe. Horizontal drags spin it, vertical ones tilt it (mouse and pen; touch keeps vertical scrolling).
  sphere.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    dragged = false;
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY, t: event.timeStamp, moved: false, turned: 0 };
  });
  sphere.addEventListener('pointermove', event => {
    if (!drag || event.pointerId !== drag.id) return;
    const dx = event.clientX - drag.x, dy = event.clientY - drag.y;
    if (!drag.moved) {
      if (Math.hypot(dx, dy) < DRAG_SLOP) return;
      drag.moved = true;
      transition = null;
      sphere.setPointerCapture(event.pointerId);
      sphere.dataset.dragging = '';
      scheduleAutoplay();
    }
    const radius = R * height / 2, dt = Math.max(1, event.timeStamp - drag.t) / 1000;
    const turn = dx / radius;
    phi += turn;
    theta = clamp(theta + dy / radius, -1.2, 1.2);
    velocity = velocity * 0.6 + (turn / dt) * 0.4;
    drag = { ...drag, x: event.clientX, y: event.clientY, t: event.timeStamp, turned: drag.turned + turn };
    render();
  });
  const endDrag = (event: PointerEvent) => {
    if (!drag || event.pointerId !== drag.id) return;
    if (drag.moved) {
      dragged = true;
      delete sphere.dataset.dragging;
      // The globe keeps turning the way it was dragged; a flick (released while moving) carries momentum.
      if (Math.abs(drag.turned) > 0.02) dir = Math.sign(drag.turned);
      velocity = canMove && event.timeStamp - drag.t < 120 ? clamp(velocity, -3, 3) : 0;
    }
    drag = null;
    wake();
    scheduleAutoplay();
  };
  sphere.addEventListener('pointerup', endDrag);
  sphere.addEventListener('pointercancel', endDrag);
  // A drag that ends on a pin is not a click on it.
  sphere.addEventListener('click', event => { if (dragged) { event.stopPropagation(); dragged = false; } }, true);

  for (const review of reviews) {
    const more = review.querySelector<HTMLButtonElement>('[data-more]')!;
    more.addEventListener('click', () => setOpen(review, more.getAttribute('aria-expanded') !== 'true'));
  }
  new ResizeObserver(markLong).observe(stack);

  timerLine.addEventListener('animationend', () => { if (autoplay) { select(nextInSpin(), false); restartFill(); } });

  root.querySelector('[data-prev]')?.addEventListener('click', () => select((current + reviews.length - 1) % reviews.length, true));
  root.querySelector('[data-next]')?.addEventListener('click', () => select((current + 1) % reviews.length, true));
  for (const pin of pins)
    pin.button.addEventListener('click', () => select(pin.index, true));

  root.addEventListener('pointerenter', () => { held = true; scheduleAutoplay(); });
  root.addEventListener('pointerleave', () => { held = false; scheduleAutoplay(); });
  root.addEventListener('focusin', () => { held = true; scheduleAutoplay(); });
  root.addEventListener('focusout', event => {
    if (!root.contains(event.relatedTarget as Node)) { held = false; scheduleAutoplay(); }
  });
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (!visible) {
      cancelAnimationFrame(raf); raf = 0; last = 0; scheduleAutoplay();
    }
    else { render(); wake(); scheduleAutoplay(); }
  }).observe(root);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(raf); raf = 0; last = 0; scheduleAutoplay(); }
    else { render(); wake(); scheduleAutoplay(); }
  });
  new MutationObserver(() => { readColors(); render(); }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  motion.addEventListener('change', event => {
    canMove = gpu && !event.matches;
    if (!canMove) {
      autoplay = false;
      transition = null;
      cancelAnimationFrame(raf); raf = 0; last = 0;
    }
    render(); wake(); scheduleAutoplay();
  });
  new ResizeObserver(() => { size(); render(); }).observe(sphere);

  if (webgl) {
    landReady.then(() => {
      if (!globe) globe = createDots(dotsCanvas, land, { hiddenIndex: -1 });
      render(); wake();
    });
  }
  readColors();
  size();
  render();
  scheduleAutoplay();
  wake();
}
