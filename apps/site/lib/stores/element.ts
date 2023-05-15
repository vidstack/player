import { route } from '@vessel-js/svelte';
import { derived } from 'svelte/store';

import { kebabToTitleCase } from '../utils/string';
import { formatElementHeading } from './format';

export const elementTagName = derived(route, ($route) =>
  getTagNameFromPath($route.matchedURL.pathname),
);

const elementNameRE = /\/components\/.*?\/(.*?)($|\/|\#)/;
export function getTagNameFromPath(path: string) {
  const name = path.match(elementNameRE)?.[1];
  return name ? `media-${name.replace(/^media\-/, '')}` : '';
}

const leaveMediaPrefix = new Set(['media-outlet']);

export const elementHeading = derived(elementTagName, ($elementTagName) => {
  return `${formatElementHeading(
    kebabToTitleCase(
      leaveMediaPrefix.has($elementTagName)
        ? $elementTagName
        : $elementTagName.replace('media-', ''),
    ),
  )}`;
});
