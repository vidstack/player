import adapter from '@sveltejs/adapter-static';
import { cleanFilePath, kitDocsPlugin } from '@svelteness/kit-docs/node';
import { globbySync } from 'globby';
import { extname } from 'path';
import * as preprocess from 'svelte-preprocess';
import Icons from 'unplugin-icons/vite';

import { componentsPlugin } from './plugins/components-plugin/index.js';

const slugify = (filePath) => {
  const cleanPath = cleanFilePath(filePath);
  return `/${cleanPath.replace(extname(cleanPath), '').replace(/\/?index$/, '')}`;
};

const entries = globbySync('src/routes/**/[^_]*.{md,svelte}').map(slugify);

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', '.md'],

  // @ts-expect-error - CJS -> ESM conversion.
  preprocess: [preprocess.default.typescript()],

  kit: {
    adapter: adapter(),

    prerender: {
      default: true,
      entries: ['*', ...entries],
    },

    vite: {
      plugins: [
        Icons({ compiler: 'svelte' }),
        componentsPlugin(),
        kitDocsPlugin({
          shiki: {
            theme: 'material-ocean',
          },
        }),
      ],
    },
  },
};

export default config;
