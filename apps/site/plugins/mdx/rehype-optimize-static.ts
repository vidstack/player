// FROM: https://github.com/withastro/docs/blob/main/plugins/rehype-optimize-static.ts

import type { Root } from 'hast';
import { toHtml } from 'hast-util-to-html';
import type { Transformer } from 'unified';
import { walk } from 'unist-util-walker';

// accessing untyped hast and mdx types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Node = any;

const headingRe = /h([0-6])/;

/**
 * For MDX only, collapse static subtrees of the hast into `set:html`. Subtrees
 * do not include any MDX elements or headings (for `rehypeHeadingIds` to work).
 * This optimization reduces the JS output as more content are represented as a
 * string instead, which also reduces the AST size that Rollup holds in memory.
 */
export function rehypeOptimizeStatic(): Transformer<Root, Root> {
  return (tree) => {
    // All possible elements that could be the root of a subtree
    const allPossibleElements = new Set<Node>();
    // The current collapsible element stack while traversing the tree
    const elementStack: Node[] = [];

    walk(tree, {
      enter(node) {
        // @ts-expect-error test tagName naively
        const isHeading = node.tagName && headingRe.test(node.tagName);
        // For nodes that can't be optimized, eliminate all elements in the
        // `elementStack` from the `allPossibleElements` set.
        if (node.type.startsWith('mdx') || isHeading) {
          for (const el of elementStack) {
            allPossibleElements.delete(el);
          }
        }
        // If is heading node, skip it and its children. This prevents the content
        // from being optimized, as the content is used to generate the heading text.
        if (isHeading) {
          this.skip();
          return;
        }
        // For possible subtree root nodes, record them
        if (node.type === 'element' || node.type === 'mdxJsxFlowElement') {
          elementStack.push(node);
          allPossibleElements.add(node);
        }
      },
      leave(node, parent) {
        // Similar as above, but pop the `elementStack`
        if (node.type === 'element' || node.type === 'mdxJsxFlowElement') {
          elementStack.pop();
          // Many possible elements could be part of a subtree, in order to find
          // the root, we check the parent of the element we're popping. If the
          // parent exists in `allPossibleElements`, then we're definitely not
          // the root, so remove ourselves. This will work retroactively as we
          // climb back up the tree.
          if (allPossibleElements.has(parent)) {
            allPossibleElements.delete(node);
          }
        }
      },
    });

    // For all possible subtree roots, collapse them into `set:html` and
    // strip of their children
    for (const el of allPossibleElements) {
      if (el.type === 'mdxJsxFlowElement') {
        el.attributes.push({
          type: 'mdxJsxAttribute',
          name: 'set:html',
          value: toHtml(el.children),
        });
      } else {
        el.properties['set:html'] = toHtml(el.children);
      }
      el.children = [];
    }
  };
}
