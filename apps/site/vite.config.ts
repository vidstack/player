import { PreprocessorGroup, svelte } from '@sveltejs/vite-plugin-svelte';
import { vessel } from '@vessel-js/app/node';
import { vesselSvelte } from '@vessel-js/svelte/node';
import { transform as esbuildTransform } from 'esbuild';
import icons from 'unplugin-icons/vite';
import { defineConfig } from 'vite';

import { loadPlayerSidebar } from './lib/server/load-sidebar';
import highlight from './plugins/highlight.js';
import snippets from './plugins/snippets.js';

const sidebar = loadPlayerSidebar();
const sidebarLinks = Object.values(sidebar).flat();

export default defineConfig({
  resolve: {
    alias: {
      $lib: '/lib',
    },
  },
  plugins: [
    highlight(),
    snippets(),
    icons({ compiler: 'svelte' }),
    vessel({
      build: {
        adapter: {
          use: 'vercel',
        },
      },
      markdown: {
        highlighter: 'shiki',
        shiki: { theme: 'material-palenight' },
      },
      routes: {
        entries: ['', '/react'].flatMap((lib) => [
          ...['', '/audio', '/hls'].map(
            (p) => `/docs${lib}/player/getting-started/installation${p}`,
          ),
          ...['', '/audio', '/hls'].map(
            (p) => `/docs${lib}/player/getting-started/installation/cdn${p}`,
          ),
          ...sidebarLinks
            .filter((link) => link.slug.startsWith('/docs/player/api'))
            .map(
              (link) =>
                `/docs${lib}/player/core-concepts/${link.slug.replace('/docs/player/api/', '')}`,
            ),
          ...sidebarLinks
            .filter((link) => link.slug.startsWith('/docs/player/components'))
            .map((link) => link.slug.replace('/docs', `/docs${lib}`) + '/api'),
          ...['foundation', 'skins', 'tailwind'].map((p) => `/docs${lib}/player/styling/${p}`),
        ]),
        matchers: [{ name: 'lib', matcher: ':lib(react)?' }],
      },
      sitemap: [
        {
          origin: 'https://vidstack.io',
          filename: 'sitemap.xml',
          exclude: /docs\/(react|svelte|vue)/,
        },
        {
          origin: 'https://vidstack.io',
          filename: 'sitemap-search.xml',
        },
      ],
    }),
    vesselSvelte(),
    svelte({
      extensions: ['.svelte', '.md'],
      compilerOptions: { hydratable: true },
      preprocess: [typescriptPreprocessor()],
    }),
  ],
});

function typescriptPreprocessor(): PreprocessorGroup {
  const typescriptRE = /^(ts|typescript)($||\/)/;
  return {
    async script({ filename, attributes, content }) {
      const isTypescript =
        typeof attributes.lang === 'string' && typescriptRE.test(attributes.lang);

      if (isTypescript) {
        return esbuildTransform(content, {
          sourcefile: filename,
          charset: 'utf8',
          loader: 'ts',
          format: 'esm',
          minify: false,
          target: 'esnext',
          tsconfigRaw: {
            compilerOptions: {
              importsNotUsedAsValues: 'preserve',
              preserveValueImports: true,
            },
          },
        });
      }
    },
  };
}
