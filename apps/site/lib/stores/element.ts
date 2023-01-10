import { route } from '@vessel-js/svelte';
import { derived } from 'svelte/store';

import { kebabToTitleCase } from '$lib/utils/string';

export const elementTagName = derived(route, ($route) =>
  getTagNameFromPath($route.matchedURL.pathname),
);

const elementNameRE = /\/components\/.*?\/(.*?)($|\/|\#)/;
export function getTagNameFromPath(path: string) {
  const name = path.match(elementNameRE)?.[1];
  return name ? `vds-${name}` : '';
}

export const comingSoonElement = derived(elementTagName, ($tagName) =>
  /vds-(youtube|vimeo)/.test($tagName),
);

/** Auto-generate in the future by using doc tags in `vidstack`. */
export const EXPERIMENTAL_TAG_NAMES = new Set(['vds-media-visibility', 'vds-gesture']);

export const isElementExperimental = derived(elementTagName, ($tagName) =>
  EXPERIMENTAL_TAG_NAMES.has($tagName),
);

export const elementHeading = derived(elementTagName, ($elementTagName) => {
  return `${formatElementHeading(kebabToTitleCase($elementTagName.replace('vds-', '')))}`;
});

export function formatElementHeading(name: string) {
  if (name === 'Hls') return 'HLS';
  if (name === 'Youtube') return 'YouTube';
  return name;
}
