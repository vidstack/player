import type { ResolvedSidebarConfig } from '@svelteness/kit-docs';
import { derived, type Readable, writable } from 'svelte/store';

// eslint-disable-next-line import/no-unresolved
import ExperimentalIcon from '~icons/ri/test-tube-fill';

import { EXPERIMENTAL_TAG_NAMES } from './element';

export type LibType = 'html' | 'react';

export const lib = writable<LibType>('html');

const stripFrameworkRE = /\/react\/?/;
const componentsRe = /\/components\//;

export const libSpecificSidebar = (sidebar: Readable<ResolvedSidebarConfig>) =>
  derived([lib, sidebar], ([$lib, $sidebar]) => {
    const isReact = $lib === 'react';

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
