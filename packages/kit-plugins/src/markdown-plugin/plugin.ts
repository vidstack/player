import { createFilter } from '@rollup/pluginutils';
import type { Plugin } from 'vite';

import { createMarkdownParser, MarkdownParser, parseMarkdownToSvelte } from './parser';

const PLUGIN_NAME = '@vidstack/markdown' as const;

export type SvelteMarkdownPluginOptions = {
  baseUrl: string;
};

const DEFAULT_INCLUDE_RE = /\.md($|\?)/;
const DEFAULT_EXCLUDE_RE = /^\/?~nav/;

export function svelteMarkdownPlugin({ baseUrl }: SvelteMarkdownPluginOptions): Plugin {
  let parser: MarkdownParser;
  let isBuild: boolean;
  let define: Record<string, unknown> | undefined;

  const filter = createFilter(DEFAULT_INCLUDE_RE, DEFAULT_EXCLUDE_RE);

  /** Page system file paths. */
  const files = new Set<string>();

  const parseOptions = () =>
    ({
      baseUrl,
      escapeConstants: isBuild,
      define,
    } as const);

  return {
    name: PLUGIN_NAME,
    enforce: 'pre' as const,
    async configResolved(config) {
      isBuild = config.command === 'build';
      define = config.define;
      parser = await createMarkdownParser();
    },
    transform(code, id) {
      if (filter(id)) {
        const { component } = parseMarkdownToSvelte(parser, code, id, parseOptions());
        files.add(id);
        return component;
      }

      return null;
    },
    async handleHotUpdate(ctx) {
      const { file, read } = ctx;

      // Hot reload `.md` files as `.svelte` files.
      if (files.has(file)) {
        const content = await read();
        const { component } = parseMarkdownToSvelte(parser, content, file, parseOptions());
        ctx.read = () => component;
      }
    },
  };
}
