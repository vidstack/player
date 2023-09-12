import type { AstroIntegration } from 'astro';
import type * as mdast from 'mdast';
import remarkDirective from 'remark-directive';
import type * as unified from 'unified';
import { visit } from 'unist-util-visit';

import { createComponentNode } from './create-component';

const CodeExamplesTagName = 'AutoImportedCodeExamples';

export const codeExamplesAutoImport: Record<string, [string, string][]> = {
  './src/docs/components/code-examples.astro': [['default', CodeExamplesTagName]],
};

/**
 * Remark plugin that converts blocks delimited with `::examples` into instances of
 * the `<CodeExamples>` component.
 */
function createPlugin(): unified.Plugin<[], mdast.Root> {
  const transformer: unified.Transformer<mdast.Root> = (tree, file) => {
    visit(tree, (node: any, index, parent) => {
      if (!parent || index === null || node.type !== 'leafDirective') {
        return;
      }

      const type = node.name;
      if (type !== 'examples') return;

      parent.children[index!] = createComponentNode(CodeExamplesTagName, {
        attributes: { type },
      });
    });
  };

  return function attacher() {
    return transformer;
  };
}

export function mdxCodeExamples(): AstroIntegration {
  return {
    name: '@vidstack/code-examples',
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
