import { uppercaseFirstLetter } from '@vidstack/foundation';
import { derived, get, type Readable, writable } from 'svelte/store';

import ExperimentalIcon from '~icons/ri/test-tube-fill';
import { type SidebarLinks } from '$src/layouts/sidebar/context';

import { EXPERIMENTAL_TAG_NAMES } from './element';

export type JSLibType = 'html' | 'react' | 'svelte' | 'vue';

export const jsLibs: JSLibType[] = [
  'html',
  'react',
  // 'svelte',
  // 'vue'
];

export const jsLib = writable<JSLibType>('html');

export const stripJSLibRE = /\/?docs\/player\/(react|svelte|vue)\/?/;
export const componentsRE = /\/components\//;
export const reactPathRE = /docs\/player\/react/;
export const sveltePathRE = /docs\/player\/svelte/;
export const vuePathRE = /docs\/player\/vue/;

export function stripJSLibFromPath(path: string) {
  return path.replace(stripJSLibRE, '/docs/player/');
}

export function addJSLibToPath(path: string, lib: JSLibType = get(jsLib)) {
  const libPath = lib !== 'html' ? `/${lib}` : '';
  return stripJSLibFromPath(path).replace('/docs/player/', `/docs/player${libPath}/`);
}

export function titleCaseJSLib(lib: string) {
  if (lib === 'html') {
    return 'HTML';
  }

  return uppercaseFirstLetter(lib);
}

export const currentJSLibTitle = derived(jsLib, titleCaseJSLib);

export function getJSLibFromPath(path: string): JSLibType {
  if (reactPathRE.test(path)) {
    return 'react';
  } else if (sveltePathRE.test(path)) {
    return 'svelte';
  } else if (vuePathRE.test(path)) {
    return 'vue';
  }

  return 'html';
}

export const currentJSLibSidebar = (links: Readable<SidebarLinks>) =>
  derived([jsLib, links], ([$jsLib, $links]) => {
    const libLinks = { ...$links };

    for (const item of Object.values(libLinks).flat()) {
      item.slug = addJSLibToPath(item.slug, $jsLib);

      const tagName = `vds-${item.title.replace(/\s/g, '-').toLowerCase()}`;
      if (EXPERIMENTAL_TAG_NAMES.has(tagName)) {
        item.icon = { after: ExperimentalIcon };
      }
    }

    return libLinks;
  });

export const jsLibExts = derived(jsLib, ($jsLib) => getJSLibFileExts($jsLib));

export function getJSLibFileExts(lib: JSLibType) {
  switch (lib) {
    case 'react':
      return ['.jsx', '.tsx'];
    case 'html':
      return ['.html', '.js', '.ts'];
    default:
      return [`.${lib}`];
  }
}
