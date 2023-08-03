import sitemap from '@astrojs/sitemap';
import svelte from '@astrojs/svelte';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';
import icons from 'unplugin-icons/vite';
import codeHighlight from './plugins/code-highlight.js';
import codeSnippets from './plugins/code-snippets.js';

export default defineConfig({
  site: 'https://vidstack.io',
  vite: {
    resolve: {
      alias: {
        '~astro-icons': '~icons',
      },
    },
    plugins: [codeHighlight(), codeSnippets(), icons({ compiler: 'svelte' })],
  },
  integrations: [tailwind(), svelte(), sitemap()],
});
