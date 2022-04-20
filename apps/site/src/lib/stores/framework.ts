import type { ResolvedSidebarConfig } from '@svelteness/kit-docs';
import { derived, type Readable } from 'svelte/store';

import { isReactPath } from './path';

export type FrameworkType = 'html' | 'react';

export const framework = derived(isReactPath, ($isReactPath) => ($isReactPath ? 'react' : 'html'));

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
