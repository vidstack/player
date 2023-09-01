import path from 'node:path';

import { globby } from 'globby';
import type { Plugin } from 'vite';

import { stripImportQuotesFromJson } from './code-snippets';

const PREVIEWS_ID = ':code_previews',
  PREVIEWS_REQ_ID = `/${PREVIEWS_ID}`;

interface CodePreview {
  id: string;
  loader: string;
}

export default (): Plugin => {
  return {
    name: '@vidstack/previews',
    enforce: 'pre',
    config() {
      return {
        resolve: {
          alias: {
            [PREVIEWS_ID]: PREVIEWS_REQ_ID,
          },
        },
      };
    },
    resolveId(id) {
      if (id === PREVIEWS_REQ_ID) return id;
    },
    async load(id) {
      if (id === PREVIEWS_REQ_ID) {
        const json = JSON.stringify(await getPreviews(), null, 2);
        return `export default ${stripImportQuotesFromJson(json)}`;
      }
    },
    handleHotUpdate({ file, server }) {
      if (file.includes('[preview]')) {
        const mod = server.moduleGraph.getModuleById(PREVIEWS_REQ_ID);
        if (mod) return [mod];
      }
    },
  };
};

async function getPreviews() {
  const previews: CodePreview[] = [],
    files = await globby('src/snippets/**/examples/*preview*');

  await Promise.all(
    files
      .filter((filePath) => filePath.includes('[preview]'))
      .map(async (filePath) => {
        const id = filePath
          .replace(/^src\/snippets\//, '')
          .replace(`/examples/${path.basename(filePath)}`, '');
        previews.push({
          id,
          loader: `() => import('/${filePath}')`,
        });
      }),
  );

  return previews;
}
