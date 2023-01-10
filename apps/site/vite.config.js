import { svelte } from '@sveltejs/vite-plugin-svelte';
import { vessel } from '@vessel-js/app/node';
import { vesselSvelte } from '@vessel-js/svelte/node';
import { transform as esbuildTransform } from 'esbuild';
import icons from 'unplugin-icons/vite';
import { defineConfig } from 'vite';

import componentApiMeta from './plugins/component-api-meta.js';
import highlight from './plugins/highlight.js';
import snippets from './plugins/snippets.js';

export default defineConfig({
  plugins: [
    highlight(),
    snippets(),
    icons({ compiler: 'svelte' }),
    vessel({
      markdown: {
        highlighter: 'shiki',
        shiki: { theme: 'material-ocean' },
        transformMeta: [componentApiMeta()],
      },
      routes: {
        entries: [
          ...['/', '/audio.html', '/hls.html'].map(
            (path) => `/docs/player/getting-started/quickstart${path}`,
          ),
          ...['/', '/audio.html', '/hls.html'].map(
            (path) => `/docs/player/getting-started/quickstart/cdn${path}`,
          ),
        ],
        matchers: [{ name: 'lib', matcher: /(vue|react|svelte)?/ }],
      },
      sitemap: [
        {
          origin: 'https://vidstack.io',
          filename: 'sitemap.xml',
          exclude: /docs\/player\/(vue|react|svelte)/,
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
