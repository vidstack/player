import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { globby } from 'globby';
import { LRUCache } from 'lru-cache';
import type { Plugin } from 'vite';

const snippetsRE = /snippets\//;

const SNIPPETS_ID = ':code_snippets',
  SNIPPETS_REQ_ID = `/${SNIPPETS_ID}`;

const startHighlightRE = /\/\/\s\@hl-start/,
  stripHighlightsRE = /\s*?\/\/\s\@hl-(start|end)(\n|\r)/g,
  prettierRE = /\s*?\/\/\sprettier.*?(\n|\r)/g;

interface CodeSnippet {
  id: string;
  width: number;
  lines: number;
  loader: string;
  highlights?: string;
}

interface CodeSnippetMeta {
  filePath: string;
  source: string;
  ext: string;
}

export const snippetsMap = new LRUCache<string, CodeSnippetMeta>({
  maxSize: 512,
  sizeCalculation(value) {
    return 1;
  },
});

export default (): Plugin => {
  return {
    name: '@vidstack/snippets',
    enforce: 'pre',
    config() {
      return {
        resolve: {
          alias: {
            [SNIPPETS_ID]: SNIPPETS_REQ_ID,
          },
        },
      };
    },
    resolveId(id) {
      if (id === SNIPPETS_REQ_ID) return id;
    },
    async load(id) {
      if (id === SNIPPETS_REQ_ID) {
        const json = JSON.stringify(await getSnippets(), null, 2);
        return `export default ${stripImportQuotesFromJson(json)}`;
      }
    },
    handleHotUpdate({ file, server }) {
      if (snippetsRE.test(file)) {
        const mod = server.moduleGraph.getModuleById(SNIPPETS_REQ_ID);
        if (mod) return [mod];
      }
    },
  };
};

async function getSnippets() {
  let snippets: CodeSnippet[] = [];

  const files = await globby('snippets/**/*');

  await Promise.all(
    files.map(async (filePath) => {
      const content = await readFile(filePath, { encoding: 'utf-8' });

      let source = stripComments(content),
        lines = source.split('\n'),
        ext = path.extname(filePath),
        highlights = resolveCodeHighlights(filePath, content),
        width = Math.max(...lines.map((line) => line.length));

      if (lines[lines.length - 1] === '') {
        lines = lines.slice(0, -1);
        source = source.slice(0, -1);
      }

      const id = filePath
          .replace(/^snippets\//, '')
          .replace(ext, '')
          .replace(/\.(html|react)$/, ''),
        loaderId = `:code_snippet/${id}`;

      snippetsMap.set(id, {
        filePath,
        ext,
        source,
      });

      snippets.push({
        id,
        width,
        lines: lines.length,
        highlights,
        loader: `() => import('${loaderId}')`,
      });
    }),
  );

  return snippets;
}

const stripImportQuotesRE = /"\(\) => import\((.+)\)"/g;

export function stripImportQuotesFromJson(json: string): string {
  return json.replace(stripImportQuotesRE, `() => import($1)`);
}

export function stripComments(content: string): string {
  return content.replace(stripHighlightsRE, '').replace(prettierRE, '\n');
}

export function resolveCodeHighlights(filePath: string, content: string): string | undefined {
  if (!startHighlightRE.test(content)) return undefined;

  let lines = content.split(/\n|\r/g),
    start = -1,
    highlights = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (start !== -1) {
      if (line.startsWith('// @hl-end')) {
        highlights.push(`${start}-${i - 1}`);
        start = -1;
      }
    } else if (line.startsWith('// @hl-start')) {
      start = i + 1;
    }
  }

  if (start !== -1) {
    console.warn(
      `[:code_snippets]: highlight comment is missing closing comment\n\nfile: ${filePath}\nstart line: ${start}\n`,
    );
  }

  return highlights.length ? highlights.join(',') : undefined;
}
