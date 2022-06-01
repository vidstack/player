import { route } from '@vitebook/svelte';
import { derived } from 'svelte/store';

import { stripJSLibFromPath } from './js-lib';

export const isComponentsPath = derived(route, ($route) =>
  /\/components\/?/.test($route.url.pathname),
);

export const isApiPath = derived(route, ($route) => /\/api\.html/.test($route.url.pathname));

export const simplePathname = derived(route, ($route) =>
  stripJSLibFromPath($route.url.pathname)
    .replace('/docs/player/', '')
    .replace(/\/\w*?(?:\.html)?$/, ''),
);
