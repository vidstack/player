import type { PluginSimple } from 'markdown-it';

import type { MarkdownHeader, MarkdownParserEnv } from '../types';
import { resolveHeadersFromTokens } from '../utils/resolveHeadersFromToken';

/**
 * Extracting markdown headers to `env`. Would be used for generating sidebar nav and toc.
 */
export const extractHeadersPlugin: PluginSimple = (parser) => {
  const level = [2, 3];

  let headers: MarkdownHeader[];

  // Push the rule to the end of the chain, and resolve headers from the parsed tokens.
  parser.core.ruler.push('resolveExtractHeaders', (state) => {
    headers = resolveHeadersFromTokens(state.tokens, {
      level,
      allowHtml: false,
      escapeText: false,
    });
    return true;
  });

  // Extract headers to `env`.
  const render = parser.render.bind(parser);
  parser.render = (src, env: MarkdownParserEnv = {}) => {
    const result = render(src, env);
    env.headers = headers;
    return result;
  };
};
