import { route } from '@vessel-js/svelte';
import { derived } from 'svelte/store';

import { kebabToTitleCase } from '$lib/utils/string';

export const elementTagName = derived(route, ($route) =>
  getTagNameFromPath($route.matchedURL.pathname),
);

const elementNameRE = /\/components\/.*?\/(.*?)($|\/|\#)/;
export function getTagNameFromPath(path: string) {
  const name = path.match(elementNameRE)?.[1];
  return name ? `media-${name}` : '';
}

export const elementHeading = derived(elementTagName, ($elementTagName) => {
  return `${formatElementHeading(kebabToTitleCase($elementTagName.replace('media-', '')))}`;
});

export function formatElementHeading(name: string) {
  if (name === 'Pip Button') return 'PIP Button';
  if (name === 'Youtube') return 'YouTube';
  return name;
}
