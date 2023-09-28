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
import rehypeExternalLinks from 'rehype-external-links';
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
import { externalLinksConfig } from './plugins/mdx/rehype-external-links-config';
import { rehypeOptimizeStatic } from './plugins/mdx/rehype-optimize-static';

const isLocal = !process.env.VERCEL;

export default defineConfig({
  site: 'https://vidstack.io',
  output: 'hybrid',
  adapter: isLocal ? node({ mode: 'standalone' }) : vercel({ edgeMiddleware: true }),
  vite: {
    resolve: {
      alias: {
        '~astro-icons': '~icons',
      },
    },
    // Throwing some annoying type errors for src/snippets directory, just get rid of it for now.
    optimizeDeps: { disabled: true },
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
    svelte({ prebundleSvelteLibraries: false }),
    sitemap(),
    mdx(),
  ],
  markdown: {
    syntaxHighlight: false,
    rehypePlugins: [
      rehypeSlug,
      // This adds links to headings
      [rehypeAutolinkHeadings, autolinkConfig],
      // Add rel and target attrs to external links
      [rehypeExternalLinks, externalLinksConfig],
      // Collapse static parts of the hast to html
      rehypeOptimizeStatic,
    ],
  },
  redirects: {
    ...['', 'wc']
      .flatMap((lib) => {
        const docs = join('/docs', lib),
          player = join(docs, 'player');
        return Object.entries({
          // Redirects for old links from the previous site.
          [`${player}/providers/audio`]: `${player}/api/providers/audio`,
          [`${player}/providers/video`]: `${player}/api/providers/video`,
          [`${player}/providers/hls`]: `${player}/api/providers/hls`,
          [`${player}/core-concepts/styling`]: `${player}/styling/introduction`,
          [`${player}/core-concepts/tailwind`]: `${player}/styling/tailwind`,
          [`${player}/core-concepts/skins`]: `${player}/styling/layouts`,
          // New Redirects.
          [docs]: player,
        });
      })
      .reduce((current, [from, to]) => ({ ...current, [from]: to }), {}),
    // Redirect old installation links.
    ...['', 'react/']
      .flatMap((lib) => {
        const slugs = ['/cdn', '/cdn/audio', '/cdn/hls', '/audio', '/hls'];
        if (lib !== '') slugs.push('');
        return slugs.map((slug) => `/docs/${lib}player/getting-started/installation${slug}`);
      })
      .reduce((current, from) => {
        return {
          ...current,
          [from]: `/docs/player/getting-started/installation${
            from.includes('/react') ? '/react' : ''
          }`,
        };
      }, {}),
  },
});
