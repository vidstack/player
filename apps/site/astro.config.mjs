import { join } from 'node:path';

import mdx from '@astrojs/mdx';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';
import svelte from '@astrojs/svelte';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';
import AutoImport from 'astro-auto-import';
import { defineConfig } from 'astro/config';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import icons from 'unplugin-icons/vite';

import codeHighlight from './plugins/code-highlight';
import codePreviews from './plugins/code-previews';
import codeSnippets from './plugins/code-snippets';
import { calloutAutoImport, mdxCallouts } from './plugins/mdx/components/callouts';
import { codeExamplesAutoImport, mdxCodeExamples } from './plugins/mdx/components/code-examples';
import { codeSnippetAutoImport, mdxCodeSnippets } from './plugins/mdx/components/code-snippet';
import { componentApiAutoImport, mdxComponentAPI } from './plugins/mdx/components/component-api';
import { mdxNo, noAutoImport } from './plugins/mdx/components/no';
import { mdxTable, tableAutoImport } from './plugins/mdx/components/table';
import { mdxYes, yesAutoImport } from './plugins/mdx/components/yes';
import { autolinkConfig } from './plugins/mdx/rehype-autolink-config';
import { rehypeOptimizeStatic } from './plugins/mdx/rehype-optimize-static';

const isLocal = !process.env.VERCEL;

export default defineConfig({
  site: 'https://vidstack-preview.vercel.app',
  output: 'hybrid',
  adapter: isLocal ? node({ mode: 'standalone' }) : vercel({ edgeMiddleware: true }),
  vite: {
    resolve: {
      alias: {
        '~astro-icons': '~icons',
      },
    },
    plugins: [codeHighlight(), codeSnippets(), codePreviews(), icons({ compiler: 'svelte' })],
  },
  integrations: [
    AutoImport({
      imports: [
        codeSnippetAutoImport,
        codeExamplesAutoImport,
        calloutAutoImport,
        yesAutoImport,
        noAutoImport,
        tableAutoImport,
        componentApiAutoImport,
      ],
    }),
    mdxCodeSnippets(),
    mdxCodeExamples(),
    mdxCallouts(),
    mdxYes(),
    mdxNo(),
    mdxTable(),
    mdxComponentAPI(),
    tailwind(),
    svelte(),
    sitemap(),
    mdx(),
  ],
  markdown: {
    syntaxHighlight: false,
    rehypePlugins: [
      rehypeSlug,
      // This adds links to headings
      [rehypeAutolinkHeadings, autolinkConfig],
      // Collapse static parts of the hast to html
      rehypeOptimizeStatic,
    ],
  },
  redirects: {
    ...['', 'web-components']
      .flatMap((libPrefix) => {
        const docs = join('/docs', libPrefix),
          player = join(docs, 'player');
        return Object.entries({
          // Redirects for old links from the previous site.
          [`${player}/providers/audio`]: `${player}/api/providers/audio`,
          [`${player}/providers/video`]: `${player}/api/providers/video`,
          [`${player}/providers/hls`]: `${player}/api/providers/hls`,
          [`${player}/core-concepts/styling`]: `${player}/styling/introduction`,
          [`${player}/core-concepts/tailwind`]: `${player}/styling/tailwind`,
          [`${player}/core-concepts/skins`]: `${player}/styling/layouts`,
          [`${player}/getting-started/installation`]: `${player}/getting-started/installation/video`,
          // New Redirects.
          [docs]: player,
          [`${player}/getting-started/installation`]: `${player}/getting-started/installation/video`,
        });
      })
      .reduce((p, [from, to]) => ({ ...p, [from]: to }), {}),
  },
});
