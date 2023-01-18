import { route } from '@vessel-js/svelte';
import { get } from 'svelte/store';

export function getSelectionFromPath<T extends string>(values: T[]): T | null {
  const pathname = get(route).matchedURL.pathname;

  for (const value of values) {
    if (pathname.includes(`/${value}`)) return value;
  }

  return null;
}
