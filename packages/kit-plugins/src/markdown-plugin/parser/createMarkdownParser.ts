import MarkdownIt from 'markdown-it';

import {
  admonitionPlugin,
  anchorPlugin,
  codePlugin,
  createShikiPlugin,
  customComponentPlugin,
  emojiPlugin,
  extractHeadersPlugin,
  extractTitlePlugin,
  hoistTagsPlugin,
  importCodePlugin,
  linksPlugin,
  responsiveTablePlugin,
  stepsPlugin,
  tocPlugin,
  yesNoPlugin,
} from './plugins';
import { type MarkdownParser } from './types';

export async function createMarkdownParser(): Promise<MarkdownParser> {
  const parser = MarkdownIt({
    html: true,
  });

  parser.use(emojiPlugin);
  parser.use(anchorPlugin);
  parser.use(tocPlugin);
  parser.use(extractHeadersPlugin);
  parser.use(extractTitlePlugin);
  parser.use(customComponentPlugin);
  parser.use(linksPlugin);
  parser.use(codePlugin);
  parser.use(yesNoPlugin);
  parser.use(importCodePlugin);
  parser.use(responsiveTablePlugin);
  parser.use(await createShikiPlugin());
  parser.use(admonitionPlugin);
  parser.use(stepsPlugin);
  parser.use(hoistTagsPlugin);

  return parser;
}
