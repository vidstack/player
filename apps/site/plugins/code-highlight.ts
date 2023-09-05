import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { getHighlighter, renderToHtml, type Highlighter } from 'shiki';
import type { Plugin } from 'vite';

import { resolveCodeHighlights, snippetsMap, stripComments } from './code-snippets.js';

export default (): Plugin => {
  let shiki: Highlighter;

  const fileToId = new Map(),
    highlightQueryRE = /\?highlight.*/;

  function highlight(code: string, lang: string, colorScheme: 'light' | 'dark') {
    if (lang === 'cjs' || lang === 'mjs') lang = 'js';

    const theme = `github-${colorScheme}`,
      tokens = shiki.codeToThemedTokens(code, lang, theme);
    return renderToHtml(tokens, {
      fg: shiki.getForegroundColor(theme),
      // bg: shiki.getBackgroundColor(theme),
    })
      .replace(/^<pre(.*?)>/, '')
      .replace(/<\/pre(.*?)>$/, '')
      .replace('<code', `<code data-${colorScheme} data-lang-${lang}`)
      .trim();
  }

  return {
    name: '@vidstack/highlight',
    enforce: 'pre',
    async configResolved() {
      shiki = await getHighlighter({
        theme: 'github-light',
        themes: ['github-light', 'github-dark'],
      });
    },
    async resolveId(id, importer) {
      if (id.includes(':')) id = id.replace(/^.*\:/, ':');

      if (snippetsMap.has(id)) return id;
      if (id.startsWith(':code_snippet/')) return id;
      if (id.startsWith(':code_tokens/')) return id;

      if (highlightQueryRE.test(id)) {
        const resolvedFilePath = await this.resolve(id.replace(highlightQueryRE, ''), importer, {
          skipSelf: true,
        });

        if (!resolvedFilePath) return;

        const filePath = path.relative(process.cwd(), resolvedFilePath.id),
          ext = path.extname(filePath),
          snippetId = `:code_snippet/${filePath.replace(ext, '')}`,
          content = await readFile(filePath, 'utf-8');

        snippetsMap.set(snippetId, {
          filePath,
          ext,
          source: stripComments(content),
        });

        return snippetId;
      }
    },
    load(id) {
      if (id.startsWith(':code_tokens/')) {
        id = id.replace(':code_tokens/', '');

        const theme = id.endsWith('?dark') ? 'dark' : 'light';
        id = id.replace(/\?dark$/, '');

        const snippet = snippetsMap.get(id);
        if (!snippet) return;

        const { ext, source } = snippet;
        return `export default ${JSON.stringify(highlight(source, ext.slice(1), theme))};`;
      }

      if (id.startsWith(':code_snippet/')) {
        id = id.replace(':code_snippet/', '');

        const snippet = snippetsMap.get(id);
        if (!snippet) return;

        const { filePath, ext, source } = snippet;

        fileToId.set(filePath, `:code_snippet/${id}`);

        return `export default { ${[
          `source: ${JSON.stringify(source)}`,
          `code: { ${[
            `lang: "${ext.slice(1)}"`,
            `light: () => import(":code_tokens/${id}")`,
            `dark: () => import(":code_tokens/${id}?dark")`,
          ].join('\n, ')} }`,
        ].join(',\n ')} };`;
      }

      return null;
    },
    async handleHotUpdate({ file, server }) {
      const relativeFilePath = path.relative(process.cwd(), file);

      if (fileToId.has(relativeFilePath)) {
        const id = fileToId.get(relativeFilePath),
          baseId = id.replace(`:code_snippet/`, ''),
          tokensId = `:code_tokens/${baseId}`;

        const content = await readFile(file, 'utf8'),
          lines = stripComments(content).split(/\n|\r/g).length - 1,
          highlights = resolveCodeHighlights(file, content);

        [
          server.moduleGraph.getModuleById(id),
          server.moduleGraph.getModuleById(tokensId),
          server.moduleGraph.getModuleById(tokensId + '?dark'),
        ].map((mod) => mod && server.moduleGraph.invalidateModule(mod));

        server.ws.send({
          type: 'custom',
          event: ':invalidate_code_snippet',
          data: {
            id: baseId,
            lines,
            highlights,
            imports: {
              snippet: `/@id/${id}?t=${Date.now()}`,
              code: {
                light: `/@id/${tokensId}?t=${Date.now()}`,
                dark: `/@id/${tokensId}?dark&t=${Date.now()}`,
              },
            },
          },
        });
      }
    },
  };
};
