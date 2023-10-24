import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { nodeResolve } from '@rollup/plugin-node-resolve';
import chokidar from 'chokidar';
import { transformSync } from 'esbuild';
import fs from 'fs-extra';
import { defineConfig } from 'rollup';
import dts from 'rollup-plugin-dts';
import esbuildPlugin from 'rollup-plugin-esbuild';

const MODE_WATCH = process.argv.includes('-w'),
  MODE_TYPES = process.argv.includes('--config-types');

const DIRNAME = path.dirname(fileURLToPath(import.meta.url)),
  ROOT_DIR = path.resolve(DIRNAME, '.'),
  STYLES_DIR = path.resolve(ROOT_DIR, 'player/styles'),
  VIDSTACK_PKG_DIR = path.resolve(ROOT_DIR, 'node_modules/vidstack'),
  VIDSTACK_PKG_PLAYER_STYLES_DIR = path.resolve(VIDSTACK_PKG_DIR, 'player/styles'),
  VIDSTACK_LOCAL_PATH = path.resolve('../vidstack/src/index.ts');

const EXTERNAL_PACKAGES = [
    'react',
    'react-dom',
    'media-icons',
    'media-captions',
    'hls.js',
    /@radix-ui/,
  ],
  NPM_BUNDLES = [define({ dev: true }), define({ dev: false })],
  TYPES_BUNDLES = [defineTypes()];

// Styles
if (!MODE_TYPES) {
  copyStyles();
  copyTailwind();

  if (MODE_WATCH) {
    chokidar.watch('player/styles/**').on('all', (_, path) => {
      if (path !== 'player/styles/default/theme.css') buildDefaultTheme();
    });
  } else {
    buildDefaultTheme();
  }
}

export default defineConfig(
  MODE_WATCH ? [...TYPES_BUNDLES, ...NPM_BUNDLES] : MODE_TYPES ? TYPES_BUNDLES : NPM_BUNDLES,
);

/**
 * @returns {import('rollup').RollupOptions}
 * */
function defineTypes() {
  return {
    input: {
      index: 'types/react/src/index.d.ts',
      icons: 'types/react/src/icons.d.ts',
      'player/layouts/default': 'types/react/src/components/layouts/default/index.d.ts',
    },
    output: {
      dir: '.',
      chunkFileNames: 'dist/types/[name].d.ts',
      manualChunks(id) {
        if (id.includes('react/src')) return 'vidstack-react';
        if (id.includes('maverick')) return 'vidstack-framework';
        if (id.includes('vidstack')) return 'vidstack';
      },
    },
    external: EXTERNAL_PACKAGES,
    plugins: [
      {
        name: 'resolve-vidstack-types',
        resolveId(id) {
          if (id === 'vidstack') {
            return 'types/vidstack/src/index.d.ts';
          }
        },
      },
      dts({ respectExternal: true }),
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
    external: EXTERNAL_PACKAGES,
    output: {
      format: 'esm',
      dir: `dist/${alias}`,
      chunkFileNames: `chunks/vidstack-[hash].js`,
      manualChunks(id) {
        if (id.includes('maverick')) return 'vidstack-framework';
      },
    },
    plugins: [
      {
        name: 'vidstack-link',
        resolveId(id) {
          if (id === ':virtual/env') {
            return id;
          } else if (id === 'vidstack') {
            return VIDSTACK_LOCAL_PATH;
          }
        },
        load(id) {
          if (id === ':virtual/env') {
            return 'export const IS_SERVER = typeof document === "undefined";';
          }
        },
        transform(code) {
          if (code.includes('__SERVER__')) {
            code = code.replace(/__SERVER__/g, 'IS_SERVER');
            return "import { IS_SERVER } from ':virtual/env';\n" + code;
          }
        },
      },
      nodeResolve({
        exportConditions: dev
          ? ['development', 'production', 'default']
          : ['production', 'default'],
      }),
      esbuildPlugin({
        tsconfig: 'tsconfig.build.json',
        target: 'es2021',
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

function copyStyles() {
  fs.copySync(VIDSTACK_PKG_PLAYER_STYLES_DIR, STYLES_DIR);
}

function copyTailwind() {
  const tailwindFilePath = path.resolve(VIDSTACK_PKG_DIR, 'tailwind.cjs'),
    tailwindDTSFilePath = path.resolve(VIDSTACK_PKG_DIR, 'tailwind.d.cts');
  fs.copyFileSync(tailwindFilePath, path.resolve(ROOT_DIR, 'tailwind.cjs'));
  fs.copyFileSync(tailwindDTSFilePath, path.resolve(ROOT_DIR, 'tailwind.d.cts'));
}

function buildDefaultTheme() {
  // CSS merge.
  let defaultStyles = fs.readFileSync('player/styles/base.css', 'utf-8');

  const themeDir = 'player/styles/default';
  for (const file of fs.readdirSync(themeDir, 'utf-8')) {
    if (file === 'theme.css' || file === 'layouts') continue;
    defaultStyles += '\n' + fs.readFileSync(`${themeDir}/${file}`, 'utf-8');
  }

  fs.writeFileSync('player/styles/default/theme.css', defaultStyles);
}
