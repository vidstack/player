import type { AstroIntegration } from 'astro';
import type * as mdast from 'mdast';
import remarkDirective from 'remark-directive';
import type * as unified from 'unified';
import { visit } from 'unist-util-visit';

import { createComponentNode } from './create-component';

const NoTagName = 'AutoImportedNo';

export const noAutoImport: Record<string, [string, string][]> = {
  './src/components/docs/no.astro': [['default', NoTagName]],
};

/**
 * Remark plugin that converts blocks delimited with `:::no` into instances of the `<No>`
 * component.
 */
function createPlugin(): unified.Plugin<[], mdast.Root> {
  const transformer: unified.Transformer<mdast.Root> = (tree) => {
    visit(tree, (node: any, index, parent) => {
      if (!parent || index === null || node.type !== 'containerDirective') return;

      const type = node.name;
      if (type !== 'no') return;

      parent.children[index!] = createComponentNode(NoTagName, {}, ...node.children);
    });
  };

  return function attacher() {
    return transformer;
  };
}

export function mdxNo(): AstroIntegration {
  return {
    name: '@vidstack/no',
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
