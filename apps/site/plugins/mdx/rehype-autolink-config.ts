// FROM: https://github.com/withastro/docs/blob/main/plugins/rehype-autolink-config.ts

import { toString } from 'hast-util-to-string';
import { h } from 'hastscript';
import { escape } from 'html-escaper';
import type { Options } from 'rehype-autolink-headings';

const AnchorLinkIcon = h(
  'span',
  { ariaHidden: 'true', class: 'anchor-icon' },
  h(
    'svg',
    {
      width: 18,
      height: 18,
      version: 1.1,
      viewBox: '0 0 24 24',
      xlmns: 'http://www.w3.org/2000/svg',
    },
    h(
      'g',
      {
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 2,
        strokeLinecap: 'round',
      },
      [
        h('path', {
          d: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71',
        }),
        h('path', {
          d: 'M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71',
        }),
      ],
    ),
  ),
);

const createSROnlyLabel = (text: string) => {
  return h('span', { 'is:raw': true, class: 'sr-only' }, `Section titled ${escape(text)}`);
};

/**
 * Configuration for the `rehype-autolink-headings` plugin.
 * This set-up was informed by https://amberwilson.co.uk/blog/are-your-anchor-links-accessible
 */
export const autolinkConfig: Options = {
  properties: { class: 'anchor-link' },
  behavior: 'after',
  group: ({ tagName }) => h('div', { tabIndex: -1, class: `heading-wrapper level-${tagName}` }),
  content: (heading) => [AnchorLinkIcon, createSROnlyLabel(toString(heading))],
};
