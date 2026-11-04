// One viewport-relative track per step; no wheel interception (owner, 2026-11-04).
export function initApproachStory(root: HTMLElement) {
  const media = matchMedia('(min-width: 1024px) and (min-height: 760px) and (prefers-reduced-motion: no-preference)');
  const items = [...root.querySelectorAll<HTMLElement>('[data-story-item]')];
  const dashes = [...root.querySelectorAll<HTMLElement>('[data-story-dash]')];
  const timers = new Map<HTMLElement, ReturnType<typeof setTimeout>>();
  let imageObserver: IntersectionObserver | undefined;
  let active = -1;
  let frame = 0;
  const enabled = () => media.matches && 'onbeforematch' in document.documentElement;
  const stepLength = () => (root.offsetHeight - innerHeight) / items.length;
  const show = (next: number, animate = true) => {
    if (next === active) return;
    const previous = active;
    active = next;
    dashes.forEach((dash, i) => dash.toggleAttribute('data-active', i === next));
    items.forEach((item, i) => {
      clearTimeout(timers.get(item));
      timers.delete(item);
      const offset = i < next ? -1 : i > next ? 1 : 0;
      if (i === next) {
        item.removeAttribute('hidden');
        item.removeAttribute('aria-hidden');
        // Commit the incoming position before moving the whole text/photo pair.
        item.style.setProperty('--story-offset', String(previous < next ? 1 : -1));
        void item.offsetHeight;
      } else {
        item.setAttribute('aria-hidden', 'true');
      }
      item.toggleAttribute('data-active', i === next);
      item.style.setProperty('--story-offset', String(offset));
      if (i !== next) {
        // aria-hidden keeps exiting text out of speech; until-found preserves native search.
        const hide = () => { item.setAttribute('hidden', 'until-found'); timers.delete(item); };
        if (animate && i === previous) timers.set(item, setTimeout(hide, parseFloat(getComputedStyle(root).getPropertyValue('--story-duration'))));
        else hide();
      }
    });
  };
  const update = () => {
    frame = 0;
    if (!enabled()) return;
    const progress = -root.getBoundingClientRect().top / stepLength();
    show(Math.max(0, Math.min(items.length - 1, Math.floor(progress))));
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
  const configure = () => {
    root.removeAttribute('data-story-live');
    timers.forEach(clearTimeout);
    timers.clear();
    active = -1;
    root.toggleAttribute('data-story-enhanced', enabled());
    if (enabled()) {
      imageObserver ??= new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        root.querySelectorAll<HTMLImageElement>('.story-card img').forEach((image) => { image.loading = 'eager'; });
        imageObserver?.disconnect();
        imageObserver = undefined;
      }, { rootMargin: '100% 0px' });
      imageObserver.observe(root);
      update();
      requestAnimationFrame(() => { root.dataset.storyLive = ''; });
    } else {
      imageObserver?.disconnect();
      imageObserver = undefined;
      items.forEach((item) => { item.removeAttribute('hidden'); item.removeAttribute('aria-hidden'); item.style.removeProperty('--story-offset'); });
      dashes.forEach((dash, i) => dash.toggleAttribute('data-active', i === 0));
    }
  };
  const reveal = (i: number) => {
    if (!enabled()) return;
    // Search must measure settled text, not its incoming animated position.
    root.removeAttribute('data-story-live');
    show(i, false);
    void items[i].offsetHeight;
    const top = scrollY + root.getBoundingClientRect().top + (i + .25) * stepLength();
    // Run after the browser's own reveal/scroll so it cannot dislodge the sticky stage.
    requestAnimationFrame(() => {
      window.scrollTo({ top, behavior: 'instant' });
      requestAnimationFrame(() => { root.dataset.storyLive = ''; });
    });
  };
  items.forEach((item, i) => item.addEventListener('beforematch', () => reveal(i)));
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  media.addEventListener('change', configure);
  configure();
}
