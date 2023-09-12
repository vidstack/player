import { h } from 'hastscript';
import type { Options } from 'rehype-external-links';

const ExternalLinkIcon = h(
  'svg',
  {
    class: 'external-link-icon',
    version: 1.1,
    viewBox: '0 0 24 24',
    xlmns: 'http://www.w3.org/2000/svg',
    ariaHidden: 'true',
  },
  h('path', {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 3,
    strokeLinecap: 'round',
    strokeLineJoin: 'round',
    d: 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6m4-3h6v6m-11 5L21 3',
  }),
);

/**
 * Configuration for the `rehype-external-links` plugin.
 */
export const externalLinksConfig: Options = {
  target: '_blank',
  rel: 'noreferrer',
  content: [ExternalLinkIcon],
};
