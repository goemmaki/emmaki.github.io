import { useEffect } from 'react';
import { AboutConcepts as Source } from '@/components/about-concepts';

function enhance(root: ParentNode) {
  const logos = [
    ...(root instanceof Element && root.matches('.client-slot-logo') ? [root as HTMLElement] : []),
    ...root.querySelectorAll<HTMLElement>('.client-slot-logo'),
  ];
  for (const logo of logos) {
    for (const img of logo.querySelectorAll<HTMLImageElement>('img:not([data-color-copy])')) {
      if (img.nextElementSibling?.hasAttribute('data-color-copy')) continue;
      const copy = img.cloneNode(false) as HTMLImageElement;
      copy.removeAttribute('id');
      copy.alt = '';
      copy.setAttribute('aria-hidden', 'true');
      copy.dataset.colorCopy = '';
      copy.classList.add('client-logo-color-copy');
      img.after(copy);
    }
  }
}

export function AboutConcepts() {
  useEffect(() => {
    const island = document.querySelector('astro-island[component-url*="AboutConcepts"]') ?? document.body;
    enhance(island);
    const observer = new MutationObserver((records) => {
      for (const record of records) for (const node of record.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE) enhance(node as Element);
      }
    });
    observer.observe(island, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);
  return <Source />;
}
