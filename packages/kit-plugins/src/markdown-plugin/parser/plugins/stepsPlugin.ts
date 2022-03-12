import type { PluginSimple } from 'markdown-it';
import type Token from 'markdown-it/lib/token';
import container from 'markdown-it-container';

import type { MarkdownParser } from '../types';

export const stepsPlugin: PluginSimple = (parser: MarkdownParser) => {
  parser.use(...createSteps()).use(...createStep());
};

type ContainerArgs = [
  typeof container,
  string,
  {
    marker?: string;
    render(tokens: Token[], idx: number): string;
  },
];

function createSteps(): ContainerArgs {
  return [
    container,
    'steps',
    {
      render(tokens, idx) {
        const token = tokens[idx];
        if (token.nesting === 1) {
          return `<Steps>`;
        } else {
          return `</Steps>\n`;
        }
      },
    },
  ];
}

function createStep(): ContainerArgs {
  let parser;
  return [
    (md, ...args) => {
      parser = md;
      return container(md, ...args);
    },
    'step',
    {
      marker: '!',
      render(tokens, idx) {
        const token = tokens[idx];
        const [, headingTag = 'h3', title] =
          token.info.trim().match(/:title(\[h[1-9]\])?=(.*?)(?::|$)/) ?? [];
        const [, description] = token.info.trim().match(/:desc=(.*?)(?::|$)/) ?? [];
        const [, orientation] = token.info.trim().match(/:orientation=(.*?)(?::|$)/) ?? [];

        const props = [orientation && `orientation="${orientation}"`].filter(Boolean).join(' ');

        const content = [
          title && `<${headingTag} slot="title" class="not-prose">${title}</${headingTag}>`,
          description &&
            `<svelte:fragment slot="description">${parser.render(description)}</svelte:fragment>`,
        ];

        if (token.nesting === 1) {
          return `<Step ${props}>\n ${content.join('\n ')}`;
        } else {
          return `</Step>\n`;
        }
      },
    },
  ];
}
