import type { PluginSimple } from 'markdown-it';
import type Token from 'markdown-it/lib/token';
import container from 'markdown-it-container';

import type { MarkdownParser } from '../types';

export const admonitionPlugin: PluginSimple = (parser: MarkdownParser) => {
  parser
    .use(...createAdmonition('note'))
    .use(...createAdmonition('tip'))
    .use(...createAdmonition('info'))
    .use(...createAdmonition('warning'))
    .use(...createAdmonition('danger'));
};

type ContainerArgs = [
  typeof container,
  string,
  {
    render(tokens: Token[], idx: number): string;
  },
];

function createAdmonition(type: string): ContainerArgs {
  return [
    container,
    type,
    {
      render(tokens, idx) {
        const token = tokens[idx];
        const title = token.info.trim().slice(type.length).trim();
        if (token.nesting === 1) {
          return `<Admonition type="${type}"${title ? `title="${title}"` : ''}>`;
        } else {
          return `</Admonition>\n`;
        }
      },
    },
  ];
}
