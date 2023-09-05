import { derived, get, writable } from 'svelte/store';
import { IS_BROWSER } from '../utils/env.js';
import { mediaQuery } from './media-query.js';

export type ColorScheme = 'light' | 'dark' | 'system';

const LOCAL_STORAGE_KEY = 'vidstack::color-scheme';

const prefersDarkColorScheme = mediaQuery('(prefers-color-scheme: dark)');

export const colorSchemes: ColorScheme[] = ['light', 'dark', 'system'];

const __colorScheme = writable<ColorScheme>(currentColorScheme());

export const colorScheme = {
  ...__colorScheme,
  set(scheme: ColorScheme) {
    saveColorScheme(scheme);
    __colorScheme.set(scheme);
  },
};

export const isDarkColorScheme = derived(
  [colorScheme, prefersDarkColorScheme],
  ([$scheme, $prefersDark]) => $scheme === 'dark' || ($scheme === 'system' && $prefersDark),
);

function currentColorScheme(): ColorScheme {
  const savedValue = IS_BROWSER && localStorage[LOCAL_STORAGE_KEY];
  return savedValue ? savedValue : 'system';
}

function saveColorScheme(scheme: ColorScheme) {
  if (!IS_BROWSER) return;

  localStorage[LOCAL_STORAGE_KEY] = scheme;

  const isDarkScheme = scheme === 'dark' || (scheme === 'system' && get(prefersDarkColorScheme)),
    element = document.documentElement;

  if (isDarkScheme) {
    element.classList.add('dark');
    element.classList.remove('light');
  } else {
    element.classList.add('light');
    element.classList.remove('dark');
  }
}
