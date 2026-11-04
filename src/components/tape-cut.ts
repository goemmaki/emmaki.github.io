// One visit, one joke; decorative effects never take focus or own scrolling (owner, 2026-11-04).
export function initTapeCut(root: HTMLElement) {
  const tape = root.querySelector<HTMLElement>('[data-tape]');
  if (!tape) throw new Error('TapeCut requires its CautionTape');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const halves = [...tape.querySelectorAll<HTMLElement>('[data-tape-half]')];
  let played = false;
  let previousY = scrollY;
  let scrollFrame = 0;
  let confettiFrame = 0;
  let burstTimer = 0;
  let clearTimer = 0;
  let canvas: HTMLCanvasElement | undefined;
  let message: HTMLDivElement | undefined;
  const animations: Animation[] = [];
  let resize: (() => void) | undefined;

  function stopWatching() {
    window.removeEventListener('scroll', onScroll);
    cancelAnimationFrame(scrollFrame);
  }
  function clearEffects() {
    clearTimeout(burstTimer);
    clearTimeout(clearTimer);
    cancelAnimationFrame(confettiFrame);
    for (const animation of animations) animation.cancel();
    canvas?.remove();
    message?.remove();
    if (resize) window.removeEventListener('resize', resize);
    tape!.setAttribute('data-cleared', '');
    motion.removeEventListener('change', onMotion);
    window.removeEventListener('pagehide', clearEffects);
  }
  function onMotion() {
    if (!motion.matches) return;
    played = true;
    stopWatching();
    clearEffects();
  }
  function celebrate() {
    canvas = document.createElement('canvas');
    canvas.className = 'tape-cut-confetti';
    canvas.setAttribute('aria-hidden', 'true');
    const context = canvas.getContext('2d');
    if (!context) throw new Error('TapeCut needs a 2D canvas context');
    message = document.createElement('div');
    message.className = 'tape-cut-message';
    message.setAttribute('aria-hidden', 'true');
    message.textContent = 'Why so serious?';
    document.body.append(canvas, message);
    // Resolve aliases through a color property so canvas receives a concrete theme color.
    const colors = ['--color-brand-yellow-splash', '--color-green-crisp', '--color-fg-max'].map(token => {
      canvas!.style.color = `var(${token})`;
      return getComputedStyle(canvas!).color;
    });
    let width = innerWidth, height = innerHeight;
    resize = () => {
      width = innerWidth; height = innerHeight;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas!.width = Math.round(width * dpr); canvas!.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });
    const particles = Array.from({ length: 190 }, (_, i) => ({
      x: Math.random(), y: Math.random() * .7 - .3,
      vx: (Math.random() - .5) * 320, vy: -160 + Math.random() * 280,
      width: 4 + Math.random() * 6, height: i % 3 === 0 ? 18 : 7,
      spin: (Math.random() - .5) * 10, phase: Math.random() * Math.PI * 2,
      color: colors[i % colors.length],
    }));
    const start = performance.now();
    const draw = (now: number) => {
      const elapsed = now - start, seconds = elapsed / 1000;
      context.clearRect(0, 0, width, height);
      context.globalAlpha = Math.min(1, (2800 - elapsed) / 600);
      for (const p of particles) {
        context.save();
        context.translate(p.x * width + p.vx * seconds + Math.sin(seconds * 3 + p.phase) * 24, p.y * height + p.vy * seconds + 230 * seconds * seconds);
        context.rotate(p.phase + p.spin * seconds);
        context.scale(1, Math.cos(p.phase + seconds * 8));
        context.fillStyle = p.color;
        context.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
        context.restore();
      }
      if (elapsed < 2800) confettiFrame = requestAnimationFrame(draw);
      else clearEffects();
    };
    confettiFrame = requestAnimationFrame(draw);
    animations.push(message.animate([
      { opacity: 0, transform: 'scale(.65)', offset: 0 },
      { opacity: 1, transform: 'scale(1.06)', offset: .12 },
      { opacity: 1, transform: 'scale(1)', offset: .18 },
      { opacity: 1, transform: 'scale(1)', offset: .65 },
      { opacity: 0, transform: 'scale(.96)', offset: 1 },
    ], { duration: 2400, easing: 'ease-out', fill: 'forwards' }));
  }
  function cut() {
    played = true;
    stopWatching();
    tape!.setAttribute('data-cut', '');
    for (const half of halves) {
      const direction = half.dataset.tapeHalf === 'left' ? -1 : 1;
      animations.push(half.animate([
        { transform: 'translate(0, 0) rotate(0)', opacity: 1, offset: 0 },
        { transform: `translate(${direction * 12}px, 12px) rotate(${direction * 9}deg)`, opacity: 1, offset: .3 },
        { transform: `translate(${direction * 60}px, 180px) rotate(${direction * 32}deg)`, opacity: 0, offset: 1 },
      ], { duration: 600, easing: 'cubic-bezier(.4, 0, 1, 1)', fill: 'forwards' }));
    }
    clearTimer = window.setTimeout(() => tape!.setAttribute('data-cleared', ''), 600);
    burstTimer = window.setTimeout(celebrate, 450);
  }
  function onScroll() {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(() => {
      scrollFrame = 0;
      const delta = scrollY - previousY;
      const box = tape!.getBoundingClientRect(), center = box.top + box.height / 2;
      // Include a fast wheel/touch step that crosses the entire middle third between frames.
      const previousCenter = center + delta;
      previousY = scrollY;
      if (!played && delta > 0 && previousCenter >= innerHeight / 3 && center <= innerHeight * 2 / 3) cut();
    });
  }
  if (motion.matches) { onMotion(); return; }
  window.addEventListener('scroll', onScroll, { passive: true });
  motion.addEventListener('change', onMotion);
  window.addEventListener('pagehide', clearEffects);
}
