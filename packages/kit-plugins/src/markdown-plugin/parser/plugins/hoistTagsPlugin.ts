import type { PluginSimple } from 'markdown-it';

import type { MarkdownParserEnv } from '../types';

/**
 * Avoid rendering Svelte script/style blocks. Extract them into `env`, and hoist them root level.
 */
export const hoistTagsPlugin: PluginSimple = (parser) => {
  const tags = ['script', 'style', 'svelte:head'];
  const hoistTagsRegexp = new RegExp(`^<(${tags.join('|')})(?=(\\s|>|$))`, 'i');

  const rawRule = parser.renderer.rules.html_block!;

  parser.renderer.rules.html_block = (tokens, idx, options, env: MarkdownParserEnv, self) => {
    const content = tokens[idx].content;
    const hoistedTags = env.hoistedTags || (env.hoistedTags = []);

    // Push hoisted tags to `env` and do not render them.
    if (hoistTagsRegexp.test(content.trim())) {
      hoistedTags.push(content);
      return '';
    }

    return rawRule(tokens, idx, options, env, self);
  };
};
