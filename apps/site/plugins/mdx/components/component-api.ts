import type { AstroIntegration } from 'astro';
import type * as mdast from 'mdast';
import remarkDirective from 'remark-directive';
import type * as unified from 'unified';
import { visit } from 'unist-util-visit';

import { createComponentNode } from './create-component';

const ComponentAPITagName = 'AutoImportedComponentAPI';

export const componentApiAutoImport: Record<string, [string, string][]> = {
  './src/components/docs/component-api.astro': [['default', ComponentAPITagName]],
};

/**
 * Remark plugin that converts blocks delimited with `::component_api` into instances of the
 * `<ComponentAPI>` component.
 */
function createPlugin(): unified.Plugin<[], mdast.Root> {
  const transformer: unified.Transformer<mdast.Root> = (tree) => {
    visit(tree, (node: any, index, parent) => {
      if (!parent || index === null || node.type !== 'leafDirective') return;

      const type = node.name;
      if (type !== 'component_api') return;

      parent.children[index!] = createComponentNode(ComponentAPITagName, {});
    });
  };

  return function attacher() {
    return transformer;
  };
}

export function mdxComponentAPI(): AstroIntegration {
  return {
    name: '@vidstack/component-api',
    hooks: {
      'astro:config:setup': ({ updateConfig }) => {
        updateConfig({
          markdown: {
            remarkPlugins: [remarkDirective, createPlugin()],
          },
        });
      },
    },
  };
}
