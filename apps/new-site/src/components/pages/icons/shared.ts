import { writable } from 'svelte/store';

import { IS_BROWSER } from '../../../utils/env';
import { kebabToPascalCase } from '../../../utils/string';

export type IconLibrary = 'html' | 'react';

export const currentIconLibrary = writable<IconLibrary>(getIconLibFromSearchParams());

export const iconSearchText = writable('');

export const iconLibraryOptions = ['HTML', 'React'].map((label) => ({
  label,
  value: label.toLowerCase() as IconLibrary,
}));

export function getIconLibFromSearchParams(): IconLibrary {
  if (!IS_BROWSER) return 'react';
  const searchParams = new URLSearchParams(location.search),
    lib = searchParams.get('lib');
  return isIconLibrary(lib) ? lib : 'react';
}

export function getIconTypeFromSearchParams(): string {
  if (!IS_BROWSER) return '';
  const searchParams = new URLSearchParams(location.search);
  return searchParams.get('icon') ?? '';
}

export function isIconLibrary(value?: string | null): value is IconLibrary {
  return value === 'html' || value === 'react';
}

export function formatIconName(name: string, library: IconLibrary) {
  return library === 'react' ? kebabToPascalCase(name) + 'Icon' : name;
}
