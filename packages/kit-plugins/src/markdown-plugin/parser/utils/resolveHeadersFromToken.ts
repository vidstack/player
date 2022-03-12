import type Token from 'markdown-it/lib/token';

import type { MarkdownHeader } from '../types';
import { resolveTitleFromToken } from './resolveTitleFromToken';
import { slugify } from './slugify';

/**
 * Resolve headers from `markdown-it` tokens.
 */
export const resolveHeadersFromTokens = (
  tokens: Token[],
  {
    level,
    allowHtml,
    escapeText,
  }: {
    level: number[];
    allowHtml: boolean;
    escapeText: boolean;
  },
): MarkdownHeader[] => {
  const headers: MarkdownHeader[] = [];

  // A temp headers stack for generating the headers tree.
  const stack: MarkdownHeader[] = [];

  // Push a header to the headers tree.
  const push = (header: MarkdownHeader): void => {
    while (stack.length !== 0 && header.level <= stack[0].level) {
      stack.shift();
    }

    if (stack.length === 0) {
      headers.push(header);
      stack.push(header);
    } else {
      stack[0].children.push(header);
      stack.unshift(header);
    }
  };

  tokens.forEach((_, idx) => {
    const token = tokens[idx];

    // If the token type does not match, skip.
    if (token?.type !== 'heading_open') {
      return;
    }

    // Get the level from the tag, `h1 -> 1`.
    const headerLevel = Number.parseInt(token.tag.slice(1), 10);

    // If the level should not be extracted, skip.
    if (!level.includes(headerLevel)) {
      return;
    }

    // The next token of 'heading_open' contains the heading content.
    const nextToken = tokens[idx + 1];

    // If the next token does not exist, skip.
    if (!nextToken) {
      return;
    }

    const title = resolveTitleFromToken(nextToken, {
      allowHtml,
      escapeText,
    });

    /**
     * The id of the heading anchor is the slugified result of `markdown-it-anchor` if the id
     * does not exist, we'll slugify the title ourselves.
     */
    const slug = token.attrGet('id') ?? slugify(title);

    // Push the header to tree.
    push({
      level: headerLevel,
      title,
      slug,
      children: [],
    });
  });

  return headers;
};
