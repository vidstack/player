import { slash } from '@vitebook/core/node';
import { readFile } from 'fs/promises';
import path from 'path';
import { getHighlighter, renderToHtml } from 'shiki';

import { getSnippetPath } from './snippets.js';

/**
 * @param {import('shiki').HighlighterOptions} options
 * @returns {import('vite').Plugin}
 */
export default (options = {}) => {
  /** @type {import('shiki').Highlighter} */
  let shiki;

  const queryRE = /\?highlight.*/;

  const idToFile = new Map();
  const fileToId = new Map();

  const theme =
    (typeof options.theme === 'string' ? options.theme : options.theme?.name) ??
    'material-palenight';

  /**
   * @param {string} code
   * @param {string} lang
   */
  const highlight = async (code, lang) => {
    const tokens = shiki.codeToThemedTokens(code, lang);
    return renderToHtml(tokens, {
      fg: shiki.getForegroundColor(theme),
      // bg: shiki.getBackgroundColor(theme),
    })
      .replace(/^<pre(.*?)>/, '')
      .replace(/<\/pre(.*?)>$/, '')
      .trim();
  };

  return {
    name: '@vidstack/highlight',
    enforce: 'pre',
    async configResolved() {
      shiki = await getHighlighter({
        theme: 'material-palenight',
        langs: [],
        ...options,
      });
    },
    async resolveId(id, importer) {
      // We have to resolve a new ID to prevent any Vite plugins trying to transform these files.
      if (queryRE.test(id)) {
        const lang = new URLSearchParams(id).get('lang');
        const cleanId = `${id.replace(queryRE, '')}${lang ? `.${lang}` : ''}`;

        const filePath = idToFile.has(id)
          ? idToFile.get(id)
          : (await this.resolve(cleanId, importer, { skipSelf: true })).id;

        const ext = path.extname(filePath);
        const resolvedId = `${slash(filePath.replace(ext, ''))}?highlight&lang=${
          lang ?? ext.slice(1)
        }`;

        fileToId.set(filePath, resolvedId);
        idToFile.set(resolvedId, filePath);

        return { id: resolvedId };
      }
    },
    async load(id) {
      if (!idToFile.has(id)) return null;

      const file = idToFile.get(id);
      const code = await readFile(file, { encoding: 'utf-8' });
      const lang = new URLSearchParams(id).get('lang');
      const highlightedCode = await highlight(code, lang);

      return [
        `export const lang = "${lang}";`,
        `export const code = ${JSON.stringify(code)};`,
        `export const highlightedCode = ${JSON.stringify(highlightedCode)};`,
      ].join('\n');
    },
    async handleHotUpdate({ file, server }) {
      if (fileToId.has(file)) {
        const id = fileToId.get(file);
        const ext = path.extname(file);
        const lang = ext.slice(1);
        const relativeFilePath = path.relative(process.cwd(), file);
        const filePathNoExt = relativeFilePath.replace(ext, '');

        idToFile.delete(id);
        server.moduleGraph.invalidateModule(server.moduleGraph.getModuleById(id));

        server.ws.send({
          type: 'custom',
          event: 'vidstack::invalidate_snippet',
          data: {
            name: path.basename(relativeFilePath),
            file: relativeFilePath,
            importPath: `/${filePathNoExt}?highlight&lang=${lang}&t=${Date.now()}`,
            path: getSnippetPath(relativeFilePath),
          },
        });
      }
    },
  };
};
