import { lstatSync } from 'fs-extra';
import { type PluginSimple } from 'markdown-it';
import { dirname, relative, resolve } from 'path';

import { isLinkExternal } from '../utils/isLink';

const ROUTES_DIR = resolve(process.cwd(), 'src/routes');

/**
 * Resolves link URLs.
 */
export const linksPlugin: PluginSimple = (parser) => {
  // Attrs that going to be added to external links.
  const externalAttrs = {
    target: '_blank',
    rel: 'noopener noreferrer',
  };

  parser.renderer.rules.link_open = (tokens, idx, _, env) => {
    const token = tokens[idx];
    const hrefIndex = token.attrIndex('href');

    const props: string[] = [];

    if (hrefIndex >= 0) {
      const hrefAttr = token.attrs?.[hrefIndex];
      const hrefLink = hrefAttr![1];

      const internalLinkMatch = hrefLink.match(/^((?:.*)(?:\/|\.md|\.html))(#.*)?$/);

      if (isLinkExternal(hrefLink, '/')) {
        Object.entries(externalAttrs ?? {}).forEach(([key, val]) => {
          token.attrSet(key, val);
        });
      } else if (internalLinkMatch) {
        const rawPath = internalLinkMatch?.[1];
        const rawHash = internalLinkMatch?.[2] ?? '';

        const { filePath } = env;

        const absolutePath = rawPath?.startsWith('/')
          ? '.' + rawPath
          : resolve(lstatSync(filePath).isDirectory() ? filePath : dirname(filePath), rawPath);

        const route = relative(ROUTES_DIR, absolutePath)
          .replace(/\/index/, '')
          .replace(/\.(md|html)/, '');

        // Set new path.
        hrefAttr![1] = '/' + route + rawHash;

        const links = env.links || (env.links = []);
        links.push(hrefAttr![1]);
      }

      if (token.attrs) {
        for (const [name, value] of token.attrs) {
          props.push(`${name}="${value}"`);
        }
      }
    }

    return `<Link ${props.filter(Boolean).join(' ')}>${token.content}`;
  };

  parser.renderer.rules.link_close = () => {
    return '</Link>';
  };
};
