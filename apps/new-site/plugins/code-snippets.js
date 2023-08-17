// @ts-check

import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { globby } from 'globby';
import { LRUCache } from 'lru-cache';

const snippetsRE = /snippets\//;

const SNIPPETS_ID = ':code_snippets',
  SNIPPETS_REQ_ID = `/${SNIPPETS_ID}`;

const startHighlightRE = /\/\/\s\@hl-start/,
  stripHighlightsRE = /\s*?\/\/\s\@hl-(start|end)(\n|\r)/g,
  prettierRE = /\s*?\/\/\sprettier.*?(\n|\r)/g;

/**
 * @typedef {{
 *  id: string;
 *  width: number;
 *  lines: number;
 *  framework?: 'html' | 'react';
 *  loader: string;
 *  highlights?: string;
 * }} CodeSnippet
 */

/**
 * @typedef {{
 *  filePath: string;
 *  source: string;
 *  ext: string;
 * }} CodeSnippetMeta
 */

/** @type {LRUCache<string, CodeSnippetMeta>} */
export const snippetsMap = new LRUCache({
  maxSize: 512,
  sizeCalculation(value) {
    return 1;
  },
});

/** @returns {import('vite').Plugin}  */
export default () => {
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
  /** @type {CodeSnippet[]} */
  let snippets = [];

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
        framework = filePath.includes('.html')
          ? 'html'
          : filePath.includes('.react')
          ? 'react'
          : undefined,
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
        framework,
        highlights,
        loader: `() => import('${loaderId}')`,
      });
    }),
  );

  return snippets;
}

const stripImportQuotesRE = /"\(\) => import\((.+)\)"/g;

/** @param {string} json */
export function stripImportQuotesFromJson(json) {
  return json.replace(stripImportQuotesRE, `() => import($1)`);
}

/** @param {string} content */
export function stripComments(content) {
  return content.replace(stripHighlightsRE, '').replace(prettierRE, '\n');
}

/**
 * @param {string} filePath
 * @param {string} content
 * @returns {string | undefined}
 */
export function resolveCodeHighlights(filePath, content) {
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
