import adapter from '@sveltejs/adapter-static';
import * as preprocess from 'svelte-preprocess';
import Icons from 'unplugin-icons/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte'],

  preprocess: [preprocess.default()],

  kit: {
    adapter: adapter(),

    prerender: {
      default: true,
      entries: ['*'],
    },

    vite: {
      plugins: [Icons({ compiler: 'svelte' })],
    },
  },
};

export default config;
