import { writable } from 'svelte/store';

import { IS_BROWSER } from '../utils/env';

export type JSLibrary = 'web-components' | 'react';

export const jsLibraries: JSLibrary[] = ['web-components', 'react'];

export const currentJSLibrary = writable<JSLibrary>(initJSLibraryFromURL());

function initJSLibraryFromURL(): JSLibrary {
  if (!IS_BROWSER) return 'react';
  return location.href.includes('/wc') ? 'web-components' : 'react';
}
