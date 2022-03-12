import type { ComponentMeta } from '@vidstack/eliza';
import type { Plugin } from 'vite';

import { getComponentNameFromId } from './utils';

export const PLUGIN_NAME = '@vidstack/component-headings' as const;

const MD_ID_RE = /\.md$/;
const PLAYER_DOCS_ID_RE = /\/docs\/player\/components\//;
const API_ID_RE = /api\.md$/;

export const headingsPlugin = (components: ComponentMeta[]): Plugin => {
  return {
    name: PLUGIN_NAME,
    enforce: 'pre' as const,
    transform(markdown, id) {
      if (PLAYER_DOCS_ID_RE.test(id) && MD_ID_RE.test(id) && !API_ID_RE.test(id)) {
        const { tagName, title: componentTitle } = getComponentNameFromId(id);
        const component = components.find((component) => component.tagName === tagName);

        if (component) {
          const isReact = /\/react\/?/.test(id);
          const titlePostfix = isReact ? ' (React)' : '';
          const title = `${componentTitle} Docs${titlePostfix}`;

          const frontmatter = [`title: ${title}`].join('\n');

          return markdown.startsWith('---\n')
            ? markdown.replace('---\n', `---\n${frontmatter}`)
            : ['---', frontmatter, '---'].join('\n') + markdown;
        }
      }

      return null;
    },
  };
};
