import fs from 'node:fs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { transformSync } from 'esbuild';
import { defineConfig } from 'rollup';
import dts from 'rollup-plugin-dts';
import esbuildPlugin from 'rollup-plugin-esbuild';

const MODE_TYPES = process.argv.includes('--config-types');
const EXTERNAL = ['react', 'react-dom', 'media-icons', 'media-captions', 'hls.js', /@radix-ui/];

export default defineConfig(
  MODE_TYPES
    ? [defineTypes()]
    : [
        // server
        define({ server: true }),
        // dev
        define({ dev: true }),
        // prod
        define(),
      ],
);

/**
 * @returns {import('rollup').RollupOptions}
 * */
function defineTypes() {
  return {
    input: {
      index: 'types/index.d.ts',
      icons: 'types/icons.d.ts',
      'player/default-skin': 'types/components/skins/default/default-skin.d.ts',
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
 * server?: boolean;
 * }} BundleOptions
 */

/**
 * @param {BundleOptions}
 * @returns {import('rollup').RollupOptions}
 */
function define({ dev, server } = {}) {
  let alias = server ? 'server' : dev ? 'dev' : 'prod',
    shouldMangle = !dev && !server,
    /** @type {Record<string, string | false>} */
    mangleCache = {};

  let input = {
    vidstack: 'src/index.ts',
    'vidstack-player-skin': 'src/components/skins/default/default-skin.tsx',
  };

  if (!dev && !server) {
    input['vidstack-icons'] = 'src/icons.ts';
  }

  return {
    input,
    treeshake: true,
    preserveEntrySignatures: 'allow-extension',
    maxParallelFileOps: shouldMangle ? 1 : 20,
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
        exportConditions: server
          ? ['node', 'default', 'development']
          : dev
          ? ['development', 'production', 'default']
          : ['production', 'default'],
      }),
      esbuildPlugin({
        tsconfig: 'tsconfig.build.json',
        target: server ? 'node18' : 'esnext',
        platform: server ? 'node' : 'browser',
        define: {
          __DEV__: dev ? 'true' : 'false',
          __SERVER__: server ? 'true' : 'false',
        },
      }),
      shouldMangle && {
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
    ],
  };
}
