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

export const NAV_MOBILE_MAX_WIDTH_QUERY = '(max-width: 824px)';
export const NAV_DESKTOP_MIN_WIDTH_QUERY = '(min-width: 825px)';

export const isLargeScreen = mediaQuery('(min-width: 992px)');
export const isExtraLargeScreen = mediaQuery('(min-width: 1280px)');
