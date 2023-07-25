import { readable } from 'svelte/store';

import { IS_BROWSER } from '../utils/env';

export function mediaQuery(query: string) {
  if (!IS_BROWSER) return readable(false);

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
