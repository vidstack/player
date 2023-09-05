import type { AstroIntegration } from 'astro';
import type * as mdast from 'mdast';
import type * as unified from 'unified';
import { visit } from 'unist-util-visit';

import { createComponentNode } from './create-component';

const TableWrapperTagName = 'AutoImportedTableWrapper';

export const tableAutoImport: Record<string, [string, string][]> = {
  './src/components/table-wrapper.astro': [['default', TableWrapperTagName]],
};

function createPlugin(): unified.Plugin<[], mdast.Root> {
  const transformer: unified.Transformer<mdast.Root> = (tree) => {
    visit(tree, (node, index, parent) => {
      if (!parent || index === null || node.type !== 'table') return;
      parent.children[index!] = createComponentNode(TableWrapperTagName, node.data, {
        type: 'table',
        children: node.children as any,
      });
    });
  };

  return function attacher() {
    return transformer;
  };
}

export function mdxTable(): AstroIntegration {
  return {
    name: '@vidstack/table',
    hooks: {
      'astro:config:setup': ({ updateConfig }) => {
        updateConfig({
          markdown: {
            remarkPlugins: [createPlugin()],
          },
        });
      },
    },
  };
}
