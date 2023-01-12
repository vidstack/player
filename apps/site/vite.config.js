import { svelte } from '@sveltejs/vite-plugin-svelte';
import { vessel } from '@vessel-js/app/node';
import { vesselSvelte } from '@vessel-js/svelte/node';
import { transform as esbuildTransform } from 'esbuild';
import icons from 'unplugin-icons/vite';
import { defineConfig } from 'vite';

import highlight from './plugins/highlight.js';
import snippets from './plugins/snippets.js';

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
      markdown: {
        highlighter: 'shiki',
        shiki: { theme: 'material-ocean' },
      },
      routes: {
        entries: ['', '/react'].flatMap((lib) => [
          ...['', '/audio', '/hls'].map((p) => `/docs${lib}/player/getting-started/quickstart${p}`),
          ...['', '/audio', '/hls'].map(
            (p) => `/docs${lib}/player/getting-started/quickstart/cdn${p}`,
          ),
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

/**
 * @returns {import('svelte/types/compiler/preprocess').PreprocessorGroup}
 */
function typescriptPreprocessor() {
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
