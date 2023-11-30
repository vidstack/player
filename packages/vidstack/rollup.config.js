import fs from 'node:fs';

import { nodeResolve } from '@rollup/plugin-node-resolve';
import chokidar from 'chokidar';
import * as eslexer from 'es-module-lexer';
import { transformSync } from 'esbuild';
import { defineConfig } from 'rollup';
import dts from 'rollup-plugin-dts';
import esbuildPlugin from 'rollup-plugin-esbuild';

const MODE_WATCH = process.argv.includes('-w'),
  MODE_TYPES = process.argv.includes('--config-types'),
  MODE_CDN = process.argv.includes('--config-cdn');

const NPM_EXTERNAL_PACKAGES = ['hls.js', 'media-captions', 'media-icons'],
  CDN_EXTERNAL_PACKAGES = ['media-captions', 'media-icons'],
  NPM_BUNDLES = [define({ type: 'server' }), define({ type: 'dev' }), define({ type: 'prod' })],
  CDN_BUNDLES = [defineCDN({ dev: true }), defineCDN(), defineCDN({ layouts: true })],
  TYPES_BUNDLES = [defineTypes()];

// Styles
if (!MODE_TYPES) {
  if (MODE_WATCH) {
    chokidar.watch('player/styles/**').on('all', (_, path) => {
      if (path !== 'player/styles/default/theme.css') buildDefaultTheme();
    });
  } else {
    buildDefaultTheme();
  }
}

export default defineConfig(
  MODE_CDN
    ? CDN_BUNDLES
    : MODE_WATCH
      ? [...NPM_BUNDLES, ...TYPES_BUNDLES]
      : MODE_TYPES
        ? TYPES_BUNDLES
        : [...NPM_BUNDLES, ...CDN_BUNDLES],
);

/**
 * @returns {import('rollup').RollupOptions}
 * */
function defineTypes() {
  /** @type {Record<string, string>} */
  let input = {
    ['index']: 'src/index.ts',
    elements: 'src/elements/index.ts',
    icons: 'src/elements/bundles/icons.ts',
  };

  for (const key of Object.keys(input)) {
    input[key] = input[key].replace(/^src/, 'types').replace(/\.ts$/, '.d.ts');
  }

  return {
    input,
    output: {
      dir: '.',
      chunkFileNames: 'dist/types/vidstack-[hash].d.ts',
      manualChunks(id) {
        if (id.includes('maverick') || id.includes('lit-html') || id.includes('@floating-ui')) {
          return 'framework.d';
        }
      },
    },
    external: NPM_EXTERNAL_PACKAGES,
    plugins: [dts({ respectExternal: true })],
  };
}

/**
 * @typedef {{
 *   target?: string | null;
 *   type: 'dev' | 'prod' | 'server';
 *   minify?: boolean;
 * }} BundleOptions
 */

/**
 * @param {BundleOptions}
 * @returns {import('rollup').RollupOptions}
 */
function define({ target, type, minify }) {
  /** @type {Record<string, string>} */
  let input = {
      vidstack: 'src/index.ts',
      'vidstack-elements': 'src/elements/index.ts',
      'define/vidstack-icons': 'src/elements/bundles/icons.ts',
      'define/vidstack-player': 'src/elements/bundles/player.ts',
      'define/vidstack-player-ui': 'src/elements/bundles/player-ui.ts',
      'define/vidstack-player-layouts': 'src/elements/bundles/player-layouts.ts',
    },
    isProd = type === 'prod',
    isServer = type === 'server',
    shouldMangle = type === 'prod',
    /** @type {Record<string, string | false>} */
    mangleCache = {};

  if (!isServer) {
    input = {
      ...input,
      [`providers/vidstack-html`]: 'src/providers/html/provider.ts',
      [`providers/vidstack-audio`]: 'src/providers/audio/provider.ts',
      [`providers/vidstack-video`]: 'src/providers/video/provider.ts',
      [`providers/vidstack-hls`]: 'src/providers/hls/provider.ts',
      [`providers/vidstack-youtube`]: 'src/providers/youtube/provider.ts',
      [`providers/vidstack-vimeo`]: 'src/providers/vimeo/provider.ts',
    };

    input['define/vidstack-audio-layout'] =
      'src/elements/define/layouts/default/audio-layout-element.ts';
    input['define/vidstack-video-layout'] =
      'src/elements/define/layouts/default/video-layout-element.ts';
  }

  return {
    input,
    maxParallelFileOps: shouldMangle ? 1 : 20,
    treeshake: true,
    preserveEntrySignatures: 'strict',
    external: NPM_EXTERNAL_PACKAGES,
    output: {
      format: 'esm',
      dir: `dist/${type.replace('local-', '')}`,
      chunkFileNames: 'chunks/vidstack-[hash].js',
      manualChunks(id) {
        if (id.includes('maverick') || id.includes('@floating-ui')) return 'framework';
        if (id.includes('lit-html')) return 'framework-layouts';
        return null;
      },
    },
    plugins: [
      nodeResolve({
        exportConditions: isServer
          ? ['node', 'default', 'development']
          : isProd
            ? ['production', 'default']
            : ['development', 'production', 'default'],
      }),
      isServer && {
        name: 'server-bundle',
        async transform(code, id) {
          if (id.includes('src/elements/bundles')) return '';

          if (id.includes('src/elements/index.ts')) {
            await eslexer.init;
            const [_, exports] = eslexer.parse(code),
              define = 'export function defineCustomElement() {};\n';
            return exports
              .map((s) => (s.n === 'defineCustomElement' ? define : `export class ${s.n} {};`))
              .join('\n');
          }
        },
      },
      shouldMangle && {
        name: 'mangle',
        transform(code) {
          const result = transformSync(code, {
            target: 'esnext',
            minify: false,
            mangleProps: /^_/,
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
      esbuildPlugin({
        tsconfig: 'tsconfig.build.json',
        target: target ?? (isServer ? 'node18' : 'esnext'),
        platform: isServer ? 'node' : 'browser',
        minify: minify,
        legalComments: 'none',
        define: {
          __DEV__: !isProd && !isServer ? 'true' : 'false',
          __SERVER__: isServer ? 'true' : 'false',
          __TEST__: 'false',
        },
      }),
    ],
  };
}

/** @returns {import('rollup').RollupOptions} */
function defineCDN({ dev = false, layouts = false } = {}) {
  const input =
      dev || layouts
        ? 'src/elements/bundles/cdn/player-with-layouts.ts'
        : 'src/elements/bundles/cdn/player.ts',
    output = dev ? `vidstack.dev` : `vidstack`;
  return {
    ...define({
      type: dev ? 'dev' : 'prod',
      minify: !dev,
      target: 'es2020',
    }),
    input: {
      [output]: input,
      [`providers/vidstack-html`]: 'src/providers/html/provider.ts',
      [`providers/vidstack-audio`]: 'src/providers/audio/provider.ts',
      [`providers/vidstack-video`]: 'src/providers/video/provider.ts',
      [`providers/vidstack-hls`]: 'src/providers/hls/provider.ts',
      [`providers/vidstack-youtube`]: 'src/providers/youtube/provider.ts',
      [`providers/vidstack-vimeo`]: 'src/providers/vimeo/provider.ts',
    },
    output: {
      format: 'esm',
      dir: dev || !layouts ? 'cdn' : 'cdn/with-layouts',
      chunkFileNames: `chunks/vidstack-[hash].js`,
      paths: {
        'media-icons': 'https://cdn.jsdelivr.net/npm/media-icons@next/dist/lazy.js',
        'media-captions': 'https://cdn.jsdelivr.net/npm/media-captions@next/dist/prod.js',
      },
      manualChunks(id) {
        if (dev) return output; // no chunks in dev
        if (id.includes('maverick') || id.includes('@floating-ui')) return 'frameworks';
        return null;
      },
    },
    external: CDN_EXTERNAL_PACKAGES,
  };
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
