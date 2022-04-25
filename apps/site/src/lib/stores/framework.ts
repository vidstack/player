import type { ResolvedSidebarConfig } from '@svelteness/kit-docs';
import { derived, type Readable, writable } from 'svelte/store';

export type FrameworkType = 'html' | 'react';

export const framework = writable<FrameworkType>('html');

const stripFrameworkRE = /\/react\/?/;
const componentsRe = /\/components\//;

export const frameworkSpecificSidebar = (sidebar: Readable<ResolvedSidebarConfig>) =>
  derived([framework, sidebar], ([$framework, $sidebar]) => {
    const isReact = $framework === 'react';

    const frameworkSidebar = { links: {}, ...($sidebar ?? {}) };

    for (const item of Object.values(frameworkSidebar.links).flat()) {
      if (componentsRe.test(item.slug)) {
        item.slug = `${item.slug.replace(stripFrameworkRE, '')}${isReact ? '/react' : ''}`;
      }
    }

    return frameworkSidebar;
  });
