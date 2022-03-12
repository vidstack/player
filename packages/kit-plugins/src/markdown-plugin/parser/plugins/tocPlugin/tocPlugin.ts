import type { PluginSimple } from 'markdown-it';

import type { MarkdownHeader } from '../../types';
import { resolveHeadersFromTokens } from '../../utils/resolveHeadersFromToken';
import { createTocBlockRule } from './createTocBlockRule';

/**
 * Generate table of contents.
 *
 * Forked and modified from `markdown-it-toc-done-right`:
 *
 * - Allows `html_inline` tags in headings to support custom components.
 * - Allows custom tags for links.
 * - Code refactor and optimizations.
 *
 * @see https://github.com/nagaozen/markdown-it-toc-done-right
 */
export const tocPlugin: PluginSimple = (parser) => {
  const pattern = /^\[\[toc\]\]$/i;
  const level = [2, 3];

  let headers: MarkdownHeader[];

  // Push the rule to the end of the chain, and resolve headers from the parsed tokens.
  parser.core.ruler.push('resolveTocHeaders', (state) => {
    headers = resolveHeadersFromTokens(state.tokens, {
      level,
      allowHtml: true,
      escapeText: true,
    });
    return true;
  });

  // Add toc syntax as a block rule.
  parser.block.ruler.before('heading', 'toc', createTocBlockRule({ pattern }), {
    alt: ['paragraph', 'reference', 'blockquote'],
  });

  // Custom toc_body render rule.
  parser.renderer.rules.toc_open = () => {
    if (!headers) {
      return '';
    }

    return `<TableOfContents headers={\`${JSON.stringify(headers, [
      'title',
      'slug',
      'children',
    ])}\`}>`;
  };
};
