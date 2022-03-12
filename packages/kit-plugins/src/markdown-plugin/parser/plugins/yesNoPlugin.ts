import type { PluginSimple } from 'markdown-it';
import type Token from 'markdown-it/lib/token';
import container from 'markdown-it-container';

import type { MarkdownParser } from '../types';

export const yesNoPlugin: PluginSimple = (parser: MarkdownParser) => {
  parser.use(...createYes()).use(...createNo());
};

type ContainerArgs = [
  typeof container,
  string,
  {
    marker?: string;
    render(tokens: Token[], idx: number): string;
  },
];

function createYes(): ContainerArgs {
  return [
    container,
    'yes',
    {
      render(tokens, idx) {
        const token = tokens[idx];
        if (token.nesting === 1) {
          return `<Yes>${token.content}`;
        } else {
          return `</Yes>\n`;
        }
      },
    },
  ];
}

function createNo(): ContainerArgs {
  return [
    container,
    'no',
    {
      render(tokens, idx) {
        const token = tokens[idx];
        if (token.nesting === 1) {
          return `<No>${token.content}`;
        } else {
          return `</No>\n`;
        }
      },
    },
  ];
}
