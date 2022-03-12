import type { PluginSimple } from 'markdown-it';
import rawAnchorPlugin from 'markdown-it-anchor';

import { slugify } from '../utils/slugify';

export const anchorPlugin: PluginSimple = (parser) => {
  return rawAnchorPlugin(parser, {
    level: [2, 3, 4, 5, 6],
    slugify,
    permalink: rawAnchorPlugin.permalink.ariaHidden({
      class: 'header-anchor',
      symbol: '#',
      space: true,
      placement: 'before',
      // renderAttrs: () => ({ 'sveltekit:noscroll': '' })
    }),
  });
};
