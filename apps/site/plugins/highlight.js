import { readFile } from 'fs/promises';
import path from 'path';
import { getHighlighter, renderToHtml } from 'shiki';

import { getSnippetPath, snippetsMap } from './snippets.js';

/**
 * @param {import('shiki').HighlighterOptions} options
 * @returns {import('vite').Plugin}
 */
export default (options = {}) => {
  /** @type {import('shiki').Highlighter} */
  let shiki;

  const fileToId = new Map();
  const highlightQueryRE = /\?highlight.*/;

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
      if (snippetsMap.has(id)) return id;

      if (highlightQueryRE.test(id)) {
        const resolvedFilePath =
          (
            await this.resolve(id.replace(highlightQueryRE, ''), importer, {
              skipSelf: true,
            })
          )?.id ?? '';

        const filePath = path.relative(process.cwd(), resolvedFilePath);
        const ext = path.extname(filePath);
        const lang = ext.slice(1);

        const snippetId = `:virtual/${filePath.replace(ext, '')}?highlight&lang=${lang}`;
        snippetsMap.set(snippetId, { filePath: filePath, lang });
        return snippetId;
      }
    },
    async load(id) {
      if (snippetsMap.has(id)) {
        const { filePath, lang } = /** @type {import('./snippets').Snippet} */ (
          snippetsMap.get(id)
        );

        fileToId.set(filePath, id);
        const code = await readFile(filePath, { encoding: 'utf-8' });
        const highlightedCode = await highlight(code, lang);

        return [
          `export const lang = "${lang}";`,
          `export const code = ${JSON.stringify(code)};`,
          `export const highlightedCode = ${JSON.stringify(highlightedCode)};`,
        ].join('\n');
      }

      return null;
    },
    async handleHotUpdate({ file, server }) {
      if (fileToId.has(file)) {
        const id = fileToId.get(file);
        const relativeFilePath = path.relative(process.cwd(), file);

        server.moduleGraph.invalidateModule(
          /** @type {import('vite').ModuleNode} */ (server.moduleGraph.getModuleById(id)),
        );

        server.ws.send({
          type: 'custom',
          event: 'vidstack::invalidate_snippet',
          data: {
            name: path.basename(relativeFilePath),
            file: relativeFilePath,
            importPath: `/${id}&t=${Date.now()}`,
            path: getSnippetPath(relativeFilePath),
          },
        });
      }
    },
  };
};
