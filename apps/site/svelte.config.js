import adapter from '@sveltejs/adapter-auto';
import { componentsPlugin, highlightCodePlugin, svelteMarkdownPlugin } from '@vidstack/kit-plugins';
import * as preprocess from 'svelte-preprocess';
import Icons from 'unplugin-icons/vite';

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
        componentsPlugin(),
        svelteMarkdownPlugin({ baseUrl: '/' }),
        highlightCodePlugin(),
        Icons({ compiler: 'svelte' }),
      ],
    },
  },
};

export default config;
