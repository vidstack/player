import adapter from '@sveltejs/adapter-static';
import { kitDocsPlugin } from '@svelteness/kit-docs/node';
import * as preprocess from 'svelte-preprocess';
import Icons from 'unplugin-icons/vite';

import { componentsPlugin } from './plugins/components-plugin/index.js';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', '.md'],

  // @ts-expect-error - CJS -> ESM conversion.
  preprocess: [preprocess.default.typescript()],

  kit: {
    adapter: adapter(),

    prerender: {
      default: true,
      entries: ['*'],
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
