import sitemap from '@astrojs/sitemap';
import svelte from '@astrojs/svelte';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';
import icons from 'unplugin-icons/vite';

// import highlight from './plugins/highlight.js';
// import snippets from './plugins/snippets.js';

export default defineConfig({
  site: 'https://vidstack.io',
  vite: {
    resolve: {
      alias: {
        '~astro-icons': '~icons',
      },
    },
    plugins: [icons({ compiler: 'svelte' })],
  },
  integrations: [tailwind(), svelte(), sitemap()],
});
