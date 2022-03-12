import type { PluginSimple } from 'markdown-it';

import type { MarkdownParserEnv } from '../types';
import { resolveTitleFromToken } from '../utils/resolveTitleFromToken';

/**
 * Extracting markdown title to parser env.
 */
export const extractTitlePlugin: PluginSimple = (parser) => {
  let title: string;

  // Push the rule to the end of the chain, and resolve title from the parsed tokens.
  parser.core.ruler.push('resolveExtractTitle', (state) => {
    const tokenIdx = state.tokens.findIndex((token) => token.tag === 'h1');
    if (tokenIdx > -1) {
      title = resolveTitleFromToken(state.tokens[tokenIdx + 1], {
        escapeText: false,
        allowHtml: false,
      });
    } else {
      title = '';
    }
    return true;
  });

  // Extract title to env.
  const render = parser.render.bind(parser);
  parser.render = (src, env: MarkdownParserEnv = {}) => {
    const result = render(src, env);
    env.title = (env.frontmatter?.title as string) ?? title;
    return result;
  };
};
