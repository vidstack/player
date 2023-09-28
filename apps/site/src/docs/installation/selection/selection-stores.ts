import { currentCSSLibrary, currentJSLibrary } from '~/stores/libraries';
import { IS_BROWSER } from '~/utils/env';
import { writable } from 'svelte/store';

export type JSSelection =
  | 'angular'
  | 'react'
  | 'svelte'
  | 'vue'
  | 'web-components'
  | 'cdn'
  | 'solid';

export type CSSSelection = 'css' | 'default-theme' | 'default-layout' | 'tailwind-css';

export type ProviderSelection = 'audio' | 'video' | 'hls';

export const selections = {
  js: writable<JSSelection>(initJSSelection()),
  css: writable<CSSSelection>(initCSSSelection()),
  provider: writable<ProviderSelection>('video'),
};

selections.js.subscribe((lib) => {
  lib && currentJSLibrary.set(lib === 'react' ? 'react' : 'web-components');
});

selections.css.subscribe((lib) => {
  lib &&
    currentCSSLibrary.set(
      lib === 'tailwind-css' ? 'tailwind-css' : lib.startsWith('default') ? 'default-theme' : 'css',
    );
});

function initJSSelection(): JSSelection {
  let pathname = IS_BROWSER ? location.pathname : undefined;

  if (!pathname) return 'react';

  pathname = pathname.replace(/\/$/, '');

  if (pathname.endsWith('angular')) {
    return 'angular';
  } else if (pathname.endsWith('svelte')) {
    return 'svelte';
  } else if (pathname.endsWith('vue')) {
    return 'vue';
  } else if (pathname.endsWith('web-components')) {
    return 'web-components';
  } else if (pathname.endsWith('cdn')) {
    return 'cdn';
  } else if (pathname.endsWith('solid')) {
    return 'solid';
  }

  return pathname.includes('docs/wc') ? 'web-components' : 'react';
}

function initCSSSelection(): CSSSelection {
  let href = IS_BROWSER ? location.href : undefined;

  if (!href) return 'default-layout';

  const url = new URL(href),
    param = url.searchParams.get('styling');

  return (param as CSSSelection) ?? 'default-layout';
}
