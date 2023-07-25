import fs from 'node:fs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import * as eslexer from 'es-module-lexer';
import { transformSync } from 'esbuild';
import { defineConfig } from 'rollup';
import dts from 'rollup-plugin-dts';
import esbuildPlugin from 'rollup-plugin-esbuild';

const MODE_TYPES = process.argv.includes('--config-types');
const MODE_LIB = process.argv.includes('--config-lib');
const MAIN_EXTERNAL = ['hls.js', 'media-captions', 'media-icons'];

const LIB_EXTERNAL = [...MAIN_EXTERNAL, /maverick/];

if (!MODE_TYPES) {
  buildDefaultTheme();
}

// Used by other packages (e.g., `@vidstack/react`) to build without duplicate deps.
const LIB = [
  define({ lib: true, server: true }),
  define({ lib: true, dev: true }),
  define({ lib: true }),
];

export default defineConfig(
  MODE_TYPES
    ? [defineTypes(), defineTypes({ lib: true })]
    : MODE_LIB
    ? LIB
    : [
        ...LIB,
        // server
        define({ server: true }),
        define({ dev: true }),
        define(),
        // cdn
        defineCDN({ dev: true }),
        defineCDN(),
        defineCDN({ skins: true }),
      ],
);

/**
 * @param {{ lib?: boolean }} [config]
 * @returns {import('rollup').RollupOptions}
 * */
function defineTypes({ lib } = {}) {
  /** @type {Record<string, string>} */
  let input = {
    [lib ? 'lib' : 'index']: 'src/index.ts',
  };

  if (!lib) {
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
        if (lib) return null;
        if (id.includes('maverick') || id.includes('lit-html') || id.includes('@floating-ui')) {
          return 'framework.d';
        }
      },
    },
    external: lib ? LIB_EXTERNAL : MAIN_EXTERNAL,
    plugins: [
      dts({ respectExternal: true }),
      {
        name: 'cleanup',
        closeBundle() {
          if (lib) fs.rmSync('types', { recursive: true });
        },
      },
    ],
  };
}

/**
 * @typedef {{
 * dev?: boolean;
 * server?: boolean;
 * lib?: boolean;
 * minify?: boolean;
 * target?: string | null;
 * }} BundleOptions
 */

/**
 * @param {BundleOptions}
 * @returns {import('rollup').RollupOptions}
 */
function define({ dev, server, lib, minify, target } = {}) {
  /** @type {Record<string, string>} */
  let input = {
      vidstack: 'src/index.ts',
    },
    alias = server ? 'server' : dev ? 'dev' : 'prod',
    shouldMangle = !lib && !dev && !server,
    /** @type {Record<string, string | false>} */
    mangleCache = {};

  if (!server) {
    input = {
      ...input,
      [`providers/vidstack-html`]: 'src/providers/html/provider.ts',
      [`providers/vidstack-audio`]: 'src/providers/audio/provider.ts',
      [`providers/vidstack-video`]: 'src/providers/video/provider.ts',
      [`providers/vidstack-hls`]: 'src/providers/hls/provider.ts',
    };
  }

  if (!lib) {
    input = {
      ...input,
      'vidstack-elements': 'src/elements/index.ts',
      'define/vidstack-icons': 'src/elements/bundles/icons.ts',
      'define/vidstack-player': 'src/elements/bundles/player.ts',
      'define/vidstack-player-skins': 'src/elements/bundles/player-skins.ts',
      'define/vidstack-player-ui': 'src/elements/bundles/player-ui.ts',
    };

    if (!server) {
      input['define/vidstack-player-skin'] = 'src/elements/define/skins/default-skin-element.ts';
    }
  }

  return {
    input,
    maxParallelFileOps: shouldMangle ? 1 : 20,
    treeshake: true,
    preserveEntrySignatures: 'strict',
    external: lib ? LIB_EXTERNAL : MAIN_EXTERNAL,
    output: {
      format: 'esm',
      dir: `${lib ? `lib` : `dist`}/${alias}`,
      chunkFileNames: 'chunks/vidstack-[hash].js',
      manualChunks(id) {
        if (lib) return null;
        if (id.includes('maverick') || id.includes('@floating-ui')) return 'framework';
        if (id.includes('lit-html')) return 'framework-skin';
        return null;
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
        target: target ?? (server ? 'node18' : 'esnext'),
        platform: server ? 'node' : 'browser',
        minify: minify,
        legalComments: 'none',
        define: {
          __DEV__: dev ? 'true' : 'false',
          __SERVER__: server ? 'true' : 'false',
          __TEST__: 'false',
        },
      }),
      server && {
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
      dev,
      server: false,
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
