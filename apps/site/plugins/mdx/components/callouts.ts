// From: https://github.com/withastro/docs/blob/main/integrations/astro-asides.ts

import type { AstroIntegration } from 'astro';
import type * as mdast from 'mdast';
import remarkDirective from 'remark-directive';
import type * as unified from 'unified';
import { remove } from 'unist-util-remove';
import { visit } from 'unist-util-visit';

import { createComponentNode } from './create-component';

const CalloutTagName = 'AutoImportedCallout';

export const calloutAutoImport: Record<string, [string, string][]> = {
  './src/docs/components/callout.svelte': [['default', CalloutTagName]],
};

const calloutTypes = new Set(['note', 'info', 'tip', 'warning', 'danger', 'experimental']);

/**
 * Remark plugin that converts blocks delimited with `:::callout` into instances of the `<Callout>`
 * component.
 */
function createPlugin(): unified.Plugin<[], mdast.Root> {
  const transformer: unified.Transformer<mdast.Root> = (tree) => {
    visit(tree, (node: any, index, parent) => {
      if (!parent || index === null || node.type !== 'containerDirective') return;

      const type = node.name;

      if (!calloutTypes.has(type)) return;

      let title: string | undefined;

      remove(node, (child: any) => {
        if (child.data?.directiveLabel) {
          if ('children' in child && 'value' in child.children[0]) {
            title = child.children[0].value;
          }
          return true;
        }
      });

      parent.children[index!] = createComponentNode(
        CalloutTagName,
        { attributes: { type, title } },
        ...node.children,
      );
    });
  };

  return function attacher() {
    return transformer;
  };
}

export function mdxCallouts(): AstroIntegration {
  return {
    name: '@vidstack/callouts',
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
