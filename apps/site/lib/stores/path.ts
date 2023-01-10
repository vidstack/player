import { route } from '@vessel-js/svelte';
import { derived } from 'svelte/store';

import { stripJSLibFromPath } from './js-lib';

export const isComponentsPath = derived(route, ($route) =>
  /\/components\/?/.test($route.matchedURL.pathname),
);

export const isApiPath = derived(route, ($route) => /\/api$/.test($route.matchedURL.pathname));

export const cleanPathname = derived(route, ($route) => {
  return stripJSLibFromPath($route.matchedURL.pathname).replace('/docs/player/', '');
});
