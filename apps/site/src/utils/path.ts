import { route } from '@vitebook/svelte';
import { get } from 'svelte/store';

export function getSelectionFromPath<T extends string>(values: T[]): T | null {
  const pathname = get(route).url.pathname;

  for (const value of values) {
    if (pathname.includes(`/${value}`)) return value;
  }

  return null;
}
