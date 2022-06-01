import { readable } from 'svelte/store';

import { env } from '$src/env';

export function mediaQuery(query: string) {
  if (!env.browser) return readable(false);

  const mediaQuery = window.matchMedia(query);

  return readable(mediaQuery.matches, (set) => {
    const handler = (event: MediaQueryListEvent) => {
      set(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => {
      mediaQuery.removeEventListener('change', handler);
    };
  });
}
