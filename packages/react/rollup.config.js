import fs from 'node:fs';

import { nodeResolve } from '@rollup/plugin-node-resolve';
import { transformSync } from 'esbuild';
import { defineConfig } from 'rollup';
import dts from 'rollup-plugin-dts';
import esbuildPlugin from 'rollup-plugin-esbuild';

const MODE_TYPES = process.argv.includes('--config-types');
const EXTERNAL = ['react', 'react-dom', 'media-icons', 'media-captions', 'hls.js', /@radix-ui/];

export default defineConfig(
  MODE_TYPES ? [defineTypes()] : [define({ dev: true }), define({ dev: false })],
);

/**
 * @returns {import('rollup').RollupOptions}
 * */
function defineTypes() {
  return {
    input: {
      index: 'types/index.d.ts',
      icons: 'types/icons.d.ts',
      'player/layouts/default': 'types/components/layouts/default/index.d.ts',
    },
    output: {
      dir: '.',
      chunkFileNames: 'dist/types/[name].ts',
      manualChunks(id) {
        if (id.includes('maverick')) return 'vidstack-framework.d';
        if (id.includes('vidstack')) return 'vidstack.d';
      },
    },
    external: EXTERNAL,
    plugins: [
      dts({ respectExternal: true }),
      {
        name: 'cleanup',
        closeBundle() {
          fs.rmSync('types', { recursive: true });
        },
      },
    ],
  };
}

/**
 * @typedef {{
 * dev?: boolean;
 * }} BundleOptions
 */

/**
 * @param {BundleOptions}
 * @returns {import('rollup').RollupOptions}
 */
function define({ dev }) {
  let alias = dev ? 'dev' : 'prod',
    /** @type {Record<string, string | false>} */
    mangleCache = {};

  let input = {
    vidstack: 'src/index.ts',
    'player/vidstack-default-layout': 'src/components/layouts/default/index.ts',
    'player/vidstack-default-components': 'src/components/layouts/default/ui.ts',
    'player/vidstack-default-icons': 'src/components/layouts/default/icons.tsx',
  };

  if (!dev) {
    input['vidstack-icons'] = 'src/icons.ts';
  }

  return {
    input,
    treeshake: true,
    preserveEntrySignatures: 'allow-extension',
    maxParallelFileOps: !dev ? 1 : 20,
    external: EXTERNAL,
    output: {
      format: 'esm',
      dir: `dist/${alias}`,
      chunkFileNames: `chunks/vidstack-[hash].js`,
      manualChunks(id) {
        if (id.includes('maverick')) return 'vidstack-framework';
      },
    },
    plugins: [
      nodeResolve({
        exportConditions: dev
          ? ['development', 'production', 'default']
          : ['production', 'default'],
      }),
      esbuildPlugin({
        tsconfig: 'tsconfig.build.json',
        target: 'esnext',
        platform: 'browser',
        define: {
          __DEV__: dev ? 'true' : 'false',
        },
      }),
      !dev && {
        name: 'mangle',
        transform(code) {
          const result = transformSync(code, {
            target: 'esnext',
            minify: false,
            mangleProps: /^_/,
            reserveProps: /^__/,
            mangleCache,
            loader: 'tsx',
          });

          mangleCache = {
            ...mangleCache,
            ...result.mangleCache,
          };

          return result.code;
        },
      },
      {
        name: 'rsc-directives',
        resolveId(id) {
          if (id.startsWith('maverick.js')) {
            return this.resolve('maverick.js/rsc', '', { skipSelf: true });
          }
        },
        generateBundle(_, bundle) {
          const serverChunks = new Set(),
            neutralChunks = new Set(['vidstack-icons.js']);

          for (const fileName of Object.keys(bundle)) {
            const chunk = bundle[fileName];

            if (chunk.type !== 'chunk') continue;

            if (serverChunks.has(chunk.fileName)) {
              chunk.code = `"use server"\n\n` + chunk.code;
            } else if (!neutralChunks.has(fileName)) {
              chunk.code = `"use client"\n\n` + chunk.code;
            }
          }
        },
      },
    ],
  };
}
