import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { nodeResolve } from '@rollup/plugin-node-resolve';
import { transformSync } from 'esbuild';
import { execa } from 'execa';
import fs from 'fs-extra';
import { defineConfig } from 'rollup';
import dts from 'rollup-plugin-dts';
import esbuildPlugin from 'rollup-plugin-esbuild';

const __dirname = path.dirname(fileURLToPath(import.meta.url)),
  ROOT_DIR = path.resolve(__dirname, '.'),
  STYLES_DIR = path.resolve(ROOT_DIR, 'player/styles'),
  VIDSTACK_PKG_DIR = path.resolve(ROOT_DIR, 'node_modules/vidstack'),
  VIDSTACK_PKG_PLAYER_STYLES_DIR = path.resolve(VIDSTACK_PKG_DIR, 'player/styles');

const MODE_WATCH = process.argv.includes('-w'),
  MODE_TYPES = process.argv.includes('--config-types'),
  EXTERNAL = ['react', 'react-dom', 'media-icons', 'media-captions', 'hls.js', /@radix-ui/],
  NPM = [define({ dev: true }), define({ dev: false })];

// Styles.
copyStyles();
copyTailwind();

// Sandbox
let isRunningSandbox = false;
function launchSandbox() {
  if (isRunningSandbox) return;
  execa('pnpm', ['run', 'sandbox'], { stdio: 'inherit' });
  isRunningSandbox = true;
}

export default defineConfig(
  MODE_WATCH ? [defineTypes(), ...NPM] : MODE_TYPES ? [defineTypes()] : NPM,
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
      chunkFileNames: 'dist/types/[name].d.ts',
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
          if (!MODE_WATCH) {
            fs.rmSync('types', { recursive: true });
          }
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
      dev && {
        name: 'sandbox',
        async closeBundle() {
          await launchSandbox();
        },
      },
    ],
  };
}

function copyStyles() {
  fs.copySync(VIDSTACK_PKG_PLAYER_STYLES_DIR, STYLES_DIR);
}

function copyTailwind() {
  const tailwindFilePath = path.resolve(VIDSTACK_PKG_DIR, 'tailwind.cjs'),
    tailwindDTSFilePath = path.resolve(VIDSTACK_PKG_DIR, 'tailwind.d.cts');
  fs.copyFileSync(tailwindFilePath, path.resolve(ROOT_DIR, 'tailwind.cjs'));
  fs.copyFileSync(tailwindDTSFilePath, path.resolve(ROOT_DIR, 'tailwind.d.cts'));
}
