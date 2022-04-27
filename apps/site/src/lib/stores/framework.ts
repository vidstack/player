import type { ResolvedSidebarConfig } from '@svelteness/kit-docs';
import { derived, type Readable, writable } from 'svelte/store';

// eslint-disable-next-line import/no-unresolved
import ExperimentalIcon from '~icons/ri/test-tube-fill';

import { EXPERIMENTAL_TAG_NAMES } from './element';

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

        const tagName = `vds-${item.title.replace(/\s/g, '-').toLowerCase()}`;
        if (EXPERIMENTAL_TAG_NAMES.has(tagName)) {
          item.icon = { after: ExperimentalIcon };
        }
      }
    }

    return frameworkSidebar;
  });
