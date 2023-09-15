import { currentCSSLibrary, currentJSLibrary } from '~/stores/libraries';
import { writable } from 'svelte/store';

export type JSSelection = 'angular' | 'react' | 'svelte' | 'vue' | 'web-components' | 'cdn';
export type CSSSelection = 'css' | 'default-theme' | 'default-layout' | 'tailwind-css';
export type ProviderSelection = 'audio' | 'video' | 'hls';

export const selections = {
  js: writable<JSSelection>(),
  css: writable<CSSSelection>('default-layout'),
  provider: writable<ProviderSelection>('video'),
};

selections.js.subscribe((lib) => {
  lib && currentJSLibrary.set(lib === 'react' ? 'react' : 'web-components');
});

selections.css.subscribe((lib) => {
  lib &&
    currentCSSLibrary.set(
      lib === 'tailwind-css' ? 'tailwind' : lib.startsWith('default') ? 'default-theme' : 'css',
    );
});
