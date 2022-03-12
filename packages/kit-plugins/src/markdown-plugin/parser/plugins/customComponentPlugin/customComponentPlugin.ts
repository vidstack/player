import type { PluginSimple } from 'markdown-it';

import { htmlBlockRule, HTMLBlockSequence } from './htmlBlockRule';
import { htmlInlineRule } from './htmlInlineRule';

/**
 * Svelte reserved tags.
 *
 * @see https://svelte.dev/docs#svelte_self
 */
export const svelteReservedTags = [
  'svelte:self',
  'svelte:component',
  'svelte:window',
  'svelte:body',
  'svelte:head',
  'svelte:options',
  'svelte:fragment',
  'slot',
];

const svelteHtmlBlockSequence: HTMLBlockSequence[] = [
  // Treat Svelte reserved tags as block tags.
  [new RegExp('^</?(' + svelteReservedTags.join('|') + ')(?=(\\s|/?>|$))', 'i'), /^$/, true],
];

/**
 * Replacing the default `htmlBlock` rule to allow using custom components in markdown.
 */
export const customComponentPlugin: PluginSimple = (parser) => {
  // Override default html block ruler.
  parser.block.ruler.at('html_block', htmlBlockRule(svelteHtmlBlockSequence), {
    alt: ['paragraph', 'reference', 'blockquote'],
  });

  // Override default html inline ruler.
  parser.inline.ruler.at('html_inline', htmlInlineRule);
};
