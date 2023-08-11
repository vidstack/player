import fs from 'node:fs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import * as eslexer from 'es-module-lexer';
import { transformSync } from 'esbuild';
import { defineConfig } from 'rollup';
import dts from 'rollup-plugin-dts';
import esbuildPlugin from 'rollup-plugin-esbuild';

const MODE_TYPES = process.argv.includes('--config-types');
const MODE_LOCAL = process.argv.includes('--config-local');
const MAIN_EXTERNAL = ['hls.js', 'media-captions', 'media-icons'];

const LOCAL_EXTERNAL = [...MAIN_EXTERNAL, /maverick/];

if (!MODE_TYPES) {
  buildDefaultTheme();
}

// Used by other packages (e.g., `@vidstack/react`) to build without duplicate deps.
const LOCAL = [define({ type: 'local-prod' }), define({ type: 'local-dev' })];

/** @type {import('rollup').WarningHandlerWithDefault} */
function onWarn(warning, defaultHandler) {
  if (warning.code === 'EMPTY_BUNDLE') return;
  defaultHandler(warning);
}

export default defineConfig(
  MODE_TYPES
    ? [defineTypes({ local: true }), defineTypes({ local: false })]
    : MODE_LOCAL
    ? LOCAL
    : [
        ...LOCAL,
        define({ type: 'server' }),
        define({ type: 'dev' }),
        define({ type: 'prod' }),
        // cdn
        defineCDN({ dev: true }),
        defineCDN(),
        defineCDN({ skins: true }),
      ],
);

/**
 * @param {{ local: boolean }} config
 * @returns {import('rollup').RollupOptions}
 * */
function defineTypes({ local }) {
  /** @type {Record<string, string>} */
  let input = {
    [local ? 'local' : 'index']: 'src/index.ts',
  };

  if (!local) {
    input = {
      ...input,
      elements: 'src/elements/index.ts',
      icons: 'src/elements/bundles/icons.ts',
    };
  }

  for (const key of Object.keys(input)) {
    input[key] = input[key].replace(/^src/, 'types').replace(/\.ts$/, '.d.ts');
  }

  return {
    input,
    output: {
      dir: '.',
      chunkFileNames: 'dist/types/vidstack-[hash].ts',
      manualChunks(id) {
        if (local) return null;
        if (id.includes('maverick') || id.includes('lit-html') || id.includes('@floating-ui')) {
          return 'framework.d';
        }
      },
    },
    external: local ? LOCAL_EXTERNAL : MAIN_EXTERNAL,
    plugins: [
      dts({ respectExternal: true }),
      {
        name: 'cleanup',
        closeBundle() {
          if (!local) fs.rmSync('types', { recursive: true });
        },
      },
    ],
  };
}

/**
 * @typedef {{
 *   target?: string | null;
 *   type: 'dev' | 'prod' | 'server' | 'local-dev' | 'local-prod';
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
    },
    isProd = type === 'prod' || type === 'local-prod',
    isLocal = type.startsWith('local'),
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
    };
  }

  if (!isLocal) {
    input = {
      ...input,
      'vidstack-elements': 'src/elements/index.ts',
      'define/vidstack-icons': 'src/elements/bundles/icons.ts',
      'define/vidstack-player': 'src/elements/bundles/player.ts',
      'define/vidstack-player-skins': 'src/elements/bundles/player-skins.ts',
      'define/vidstack-player-ui': 'src/elements/bundles/player-ui.ts',
    };

    if (type !== 'server') {
      input['define/vidstack-audio-ui'] = 'src/elements/define/skins/default/audio-ui-element.ts';
      input['define/vidstack-video-ui'] = 'src/elements/define/skins/default/video-ui-element.ts';
    }
  }

  return {
    input,
    maxParallelFileOps: shouldMangle ? 1 : 20,
    treeshake: true,
    preserveEntrySignatures: 'strict',
    external: isLocal ? LOCAL_EXTERNAL : MAIN_EXTERNAL,
    onwarn: onWarn,
    output: {
      format: 'esm',
      dir: `${isLocal ? `local` : `dist`}/${type.replace('local-', '')}`,
      chunkFileNames: 'chunks/vidstack-[hash].js',
      manualChunks(id) {
        if (isLocal) return null;
        if (id.includes('maverick') || id.includes('@floating-ui')) return 'framework';
        if (id.includes('lit-html')) return 'framework-skin';
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
      esbuildPlugin({
        tsconfig: 'tsconfig.build.json',
        target: target ?? (isServer ? 'node18' : 'esnext'),
        platform: isServer ? 'node' : 'browser',
        minify: minify,
        legalComments: 'none',
        banner: 'import { IS_SERVER } from "@virtual/env";',
        define: {
          __DEV__: !isProd && !isServer ? 'true' : 'false',
          __SERVER__: isLocal ? 'IS_SERVER' : isServer ? 'true' : 'false',
          __TEST__: 'false',
        },
      }),
      {
        name: 'env',
        resolveId(id) {
          if (id === '@virtual/env') return id;
        },
        load(id) {
          if (id === '@virtual/env') {
            return `export const IS_SERVER = typeof document === 'undefined';`;
          }
        },
      },
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
    ],
  };
}

/** @returns {import('rollup').RollupOptions} */
function defineCDN({ dev = false, skins = false } = {}) {
  const input =
      dev || skins
        ? 'src/elements/bundles/player-cdn-skins.ts'
        : 'src/elements/bundles/player-cdn.ts',
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
    },
    output: {
      format: 'esm',
      dir: dev || !skins ? 'cdn' : 'cdn/skins',
      chunkFileNames: `chunks/vidstack-[hash].js`,
      paths: {
        'media-icons': 'https://cdn.jsdelivr.net/npm/media-icons/dist/lazy.js',
        'media-captions': 'https://cdn.jsdelivr.net/npm/media-captions/dist/prod.js',
      },
      manualChunks(id) {
        if (dev) return output; // no chunks in dev
        if (id.includes('maverick') || id.includes('@floating-ui')) return 'frameworks';
        return null;
      },
    },
    external: ['media-icons', 'media-captions'],
  };
}

function buildDefaultTheme() {
  // CSS merge.
  let defaultStyles = fs.readFileSync('styles/player.css', 'utf-8');

  const themeDir = 'styles/player/themes/default';
  for (const file of fs.readdirSync(themeDir, 'utf-8')) {
    defaultStyles += '\n' + fs.readFileSync(`${themeDir}/${file}`, 'utf-8');
  }

  fs.writeFileSync('styles/player/themes/default.css', defaultStyles);
}
