import type { AstroIntegration } from 'astro';
import type * as mdast from 'mdast';
import remarkDirective from 'remark-directive';
import type * as unified from 'unified';
import { remove } from 'unist-util-remove';
import { visit } from 'unist-util-visit';

import { createComponentNode } from './create-component';

const CodeSnippetTagName = 'AutoImportedCodeSnippet';

export const codeSnippetAutoImport: Record<string, [string, string][]> = {
  './src/components/code-snippet/code-snippet.astro': [['default', CodeSnippetTagName]],
};

/**
 * Remark plugin that converts blocks delimited with `::code` into instances of the `<CodeSnippet>`
 * component.
 */
function createPlugin(): unified.Plugin<[], mdast.Root> {
  const transformer: unified.Transformer<mdast.Root> = (tree, file) => {
    visit(tree, (node: any, index, parent) => {
      if (!parent || index === null || node.type !== 'leafDirective') {
        return;
      }

      const type = node.name;
      if (type !== 'code') return;

      let { title, copy, numbered } = node.attributes,
        id: string | undefined;

      remove(node, (child: any) => {
        if ('value' in child) {
          id = child.value;
          return true;
        }
      });

      if (!id) {
        file.fail('Missing code snippet id', node);
      }

      parent.children[index!] = createComponentNode(CodeSnippetTagName, {
        attributes: { type, title, copy: !!copy, numbered: !!numbered, id },
      });
    });
  };

  return function attacher() {
    return transformer;
  };
}

export function mdxCodeSnippets(): AstroIntegration {
  return {
    name: '@vidstack/code-snippets',
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
