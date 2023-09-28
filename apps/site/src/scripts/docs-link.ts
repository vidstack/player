import { currentCSSLibrary, currentJSLibrary } from '~/stores/libraries';
import { animationFrameThrottle } from '~/utils/dom';
import { get } from 'svelte/store';

const updateLinks = animationFrameThrottle(() => {
  const jsLib = get(currentJSLibrary),
    cssLib = get(currentCSSLibrary);

  for (const anchor of document.querySelectorAll('a')) {
    const url = new URL(anchor.href);

    if (
      !url.pathname.startsWith('/docs') ||
      url.pathname.includes('getting-started/installation/')
    ) {
      continue;
    }

    url.pathname = url.pathname.replace(/docs\/(wc\/)?/, `docs/${jsLib === 'react' ? '' : 'wc/'}`);
    url.searchParams.set('styling', cssLib);

    anchor.href = url.href;
  }
});

window.addEventListener('DOMContentLoaded', () => {
  currentJSLibrary.subscribe(updateLinks);
  currentCSSLibrary.subscribe(updateLinks);
  document.addEventListener('astro:page-load', updateLinks);
});
