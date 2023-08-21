import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';
import svelte from '@astrojs/svelte';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/edge';
import { defineConfig } from 'astro/config';
import icons from 'unplugin-icons/vite';

import codeHighlight from './plugins/code-highlight.js';
import codeSnippets from './plugins/code-snippets.js';

const isLocal = !process.env.VERCEL;

export default defineConfig({
  site: 'https://vidstack.io',
  output: 'hybrid',
  adapter: isLocal ? node({ mode: 'standalone' }) : vercel(),
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
