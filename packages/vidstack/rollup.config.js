import fs from 'node:fs/promises';

import { nodeResolve } from '@rollup/plugin-node-resolve';
import chokidar from 'chokidar';
import * as eslexer from 'es-module-lexer';
import { build } from 'esbuild';
import { globbySync } from 'globby';
import { defineConfig } from 'rollup';
import dts from 'rollup-plugin-dts';
import esbuildPlugin from 'rollup-plugin-esbuild';

const MODE_WATCH = process.argv.includes('-w'),
  MODE_TYPES = process.argv.includes('--config-types'),
  MODE_CDN = process.argv.includes('--config-cdn'),
  MODE_PLUGINS = process.argv.includes('--config-plugins');

/** @type {Record<string, string | false>} */
const MANGLE_CACHE = !MODE_TYPES ? await buildMangleCache() : {};

const NPM_EXTERNAL_PACKAGES = ['hls.js', 'media-captions', 'media-icons'],
  CDN_EXTERNAL_PACKAGES = ['media-captions', 'media-icons'],
  PLUGINS_EXTERNAL_PACKAGES = ['vite', 'rollup', /webpack/, /rspack/, 'esbuild', 'unplugin'];

// Styles
if (!MODE_TYPES) {
  if (MODE_WATCH) {
    chokidar.watch('player/styles/**').on('all', async (_, path) => {
      if (path !== 'player/styles/default/theme.css') {
        await buildDefaultTheme();
      }
    });
  } else {
    await buildDefaultTheme();
  }
}

export default defineConfig(
  MODE_PLUGINS
    ? getPluginsBundles()
    : MODE_CDN
      ? getCDNBundles()
      : MODE_WATCH
        ? [...getNPMBundles(), ...getTypesBundles()]
        : MODE_TYPES
          ? getTypesBundles()
          : [...getNPMBundles(), ...getLegacyCDNBundles(), ...getPluginsBundles()],
);

/**
 * @returns {import('rollup').RollupOptions[]}
 * */
function getTypesBundles() {
  /** @type {Record<string, string>} */
  const input = {
    index: 'types/index.d.ts',
    elements: 'types/elements/index.d.ts',
    'enhance/player': 'types/enhance/player.d.ts',
    'enhance/plyr': 'types/enhance/plyr.d.ts',
    icons: 'types/elements/bundles/icons.d.ts',
  };

  return [
    {
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
      plugins: [
        dts({
          respectExternal: true,
        }),
        {
          name: 'globals',
          generateBundle(_, bundle) {
            const files = new Set(['index.d.ts', 'elements.d.ts']),
              references = ['dom.d.ts', 'google-cast.d.ts']
                .map((path) => `/// <reference path="./${path}" />`)
                .join('\n');

            for (const file of Object.values(bundle)) {
              if (file.type === 'chunk') {
                // Leaking over from lit for some reason.
                file.code = file.code.replace('/// <reference types="trusted-types" />', '');
              }

              if (files.has(file.fileName) && file.type === 'chunk' && file.isEntry) {
                file.code = references + `\n\n${file.code}`;
              }
            }
          },
        },
      ],
    },
    {
      input: 'types/plugins.d.ts',
      output: { file: 'plugins.d.ts' },
      external: PLUGINS_EXTERNAL_PACKAGES,
      plugins: [dts({ respectExternal: true })],
    },
  ];
}

/**
 * @typedef {{
 *   target?: string | null;
 *   type: 'dev' | 'prod' | 'server';
 *   minify?: boolean;
 * }} BundleOptions
 */

function getNPMBundles() {
  return [
    defineNPMBundle({ type: 'server' }),
    defineNPMBundle({ type: 'dev' }),
    defineNPMBundle({ type: 'prod' }),
  ];
}

/**
 * @param {BundleOptions}
 * @returns {import('rollup').RollupOptions}
 */
function defineNPMBundle({ target, type, minify }) {
  /** @type {Record<string, string>} */
  let input = {
      vidstack: 'src/index.ts',
      'vidstack-elements': 'src/elements/index.ts',
      'enhance/vidstack-player': 'src/enhance/player.ts',
      'enhance/plyr': 'src/enhance/plyr.ts',
      'define/vidstack-icons': 'src/elements/bundles/icons.ts',
      'define/vidstack-player': 'src/elements/bundles/player.ts',
      'define/vidstack-player-ui': 'src/elements/bundles/player-ui.ts',
      'define/vidstack-player-layouts': 'src/elements/bundles/player-layouts/index.ts',
      'define/vidstack-player-default-layout': 'src/elements/bundles/player-layouts/default.ts',
      'define/vidstack-player-plyr-layout': 'src/elements/bundles/player-layouts/plyr.ts',
    },
    isProd = type === 'prod',
    isServer = type === 'server',
    shouldMangle = type === 'prod';

  if (!isServer) {
    input = {
      ...input,
      ...getProviderInputs(),
    };

    input['define/vidstack-audio-layout'] =
      'src/elements/define/layouts/default/audio-layout-element.ts';
    input['define/vidstack-video-layout'] =
      'src/elements/define/layouts/default/video-layout-element.ts';
    input['define/vidstack-plyr-layout'] =
      'src/elements/define/layouts/plyr/plyr-layout-element.ts';
  }

  return {
    input,
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

          if (id.includes('src/enhance')) {
            return code
              .replace("import '../elements/bundles/player';", '')
              .replace("import '../elements/bundles/player-layouts/plyr';", '');
          }

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
      esbuildPlugin({
        tsconfig: 'tsconfig.build.json',
        target: target ?? (isServer ? 'node18' : 'esnext'),
        platform: isServer ? 'node' : 'browser',
        minify: minify,
        legalComments: 'none',
        mangleProps: shouldMangle ? /^_/ : undefined,
        mangleCache: shouldMangle ? MANGLE_CACHE : undefined,
        reserveProps: shouldMangle ? /^__/ : undefined,
        define: {
          __DEV__: !isProd && !isServer ? 'true' : 'false',
          __SERVER__: isServer ? 'true' : 'false',
          __TEST__: 'false',
        },
      }),
    ],
  };
}

function getLegacyCDNBundles() {
  return [
    // Prod
    defineCDNBundle({
      input: 'src/elements/bundles/cdn/player.ts',
      dir: 'cdn',
      file: 'vidstack',
    }),
    // All Layouts
    defineCDNBundle({
      input: 'src/elements/bundles/cdn/player-with-layouts.ts',
      dir: 'cdn/with-layouts',
      file: 'vidstack',
    }),
  ];
}

function getCDNBundles() {
  const baseDir = 'cdn',
    enhanceDir = `${baseDir}/enhance`,
    layoutsDir = `${baseDir}/layouts`;
  return [
    // cdn.vidstack.io/dev.js
    defineCDNBundle({
      dev: true,
      input: 'src/elements/bundles/cdn/player-with-layouts.ts',
      dir: baseDir,
      file: 'dev',
    }),
    // cdn.vidstack.io/prod.js
    defineCDNBundle({
      input: 'src/elements/bundles/cdn/player.ts',
      dir: baseDir,
      file: 'prod',
    }),
    // cdn.vidstack.io/enhance/player.js
    defineCDNBundle({
      input: 'src/enhance/player.ts',
      dir: enhanceDir,
      file: 'player',
    }),
    // cdn.vidstack.io/enhance/plyr.js
    defineCDNBundle({
      input: 'src/enhance/plyr.ts',
      dir: enhanceDir,
      file: 'plyr',
    }),
    // cdn.vidstack.io/layouts/all.js
    defineCDNBundle({
      input: 'src/elements/bundles/cdn/player-with-layouts.ts',
      dir: layoutsDir,
      file: 'all',
    }),
    // cdn.vidstack.io/layouts/default.js
    defineCDNBundle({
      input: 'src/elements/bundles/cdn/player-with-default.ts',
      dir: layoutsDir,
      file: 'default',
    }),
    // cdn.vidstack.io/layouts/plyr.js
    defineCDNBundle({
      input: 'src/elements/bundles/cdn/player-with-plyr.ts',
      dir: layoutsDir,
      file: 'plyr',
    }),
  ];
}

/**
 * @param {{ dev?: boolean; input: string; dir: string; file: string }} options
 * @returns {import('rollup').RollupOptions}
 */
function defineCDNBundle({ dev = false, input, dir, file }) {
  return {
    ...defineNPMBundle({
      type: dev ? 'dev' : 'prod',
      minify: !dev,
      target: 'es2020',
    }),
    input: {
      [file]: input,
      ...getProviderInputs(),
    },
    output: {
      format: 'esm',
      dir,
      chunkFileNames: `chunks/vidstack-[hash].js`,
      entryFileNames: (chunk) => {
        return chunk.name === file ? `[name].js` : `[name]-[hash].js`;
      },
      paths: {
        'media-icons': 'https://cdn.jsdelivr.net/npm/media-icons@next/dist/lazy.js',
        'media-captions': 'https://cdn.jsdelivr.net/npm/media-captions@next/dist/prod.js',
      },
      manualChunks(id) {
        if (dev) return file; // no chunks in dev
        if (id.includes('maverick') || id.includes('@floating-ui')) return 'frameworks';
        return null;
      },
    },
    external: CDN_EXTERNAL_PACKAGES,
  };
}

async function buildDefaultTheme() {
  // CSS merge.
  let defaultStyles = await fs.readFile('player/styles/base.css', 'utf-8');

  const themeDir = 'player/styles/default';
  for (const file of await fs.readdir(themeDir, 'utf-8')) {
    if (file === 'theme.css' || file === 'layouts') continue;
    defaultStyles += '\n' + (await fs.readFile(`${themeDir}/${file}`, 'utf-8'));
  }

  await fs.writeFile('player/styles/default/theme.css', defaultStyles);
}

export async function buildMangleCache() {
  let mangleCache = JSON.parse(await fs.readFile('mangle.json', 'utf-8'));

  const result = await build({
    entryPoints: globbySync('src/**', {
      ignoreFiles: ['*.test'],
    }),
    target: 'esnext',
    bundle: true,
    minify: false,
    mangleProps: /^_/,
    reserveProps: /^__/,
    mangleCache,
    write: false,
    outdir: 'dist-esbuild',
    plugins: [
      {
        name: 'externalize',
        setup(build) {
          let filter = /^[^.\/]|^\.[^.\/]|^\.\.[^\/]/;
          build.onResolve({ filter }, (args) => ({ path: args.path, external: true }));
        },
      },
    ],
  });

  mangleCache = {
    ...mangleCache,
    ...result.mangleCache,
  };

  await fs.writeFile('mangle.json', JSON.stringify(mangleCache, null, 2) + '\n');

  return mangleCache;
}

function getProviderInputs() {
  return {
    [`providers/vidstack-html`]: 'src/providers/html/provider.ts',
    [`providers/vidstack-audio`]: 'src/providers/audio/provider.ts',
    [`providers/vidstack-video`]: 'src/providers/video/provider.ts',
    [`providers/vidstack-hls`]: 'src/providers/hls/provider.ts',
    [`providers/vidstack-youtube`]: 'src/providers/youtube/provider.ts',
    [`providers/vidstack-vimeo`]: 'src/providers/vimeo/provider.ts',
    [`providers/vidstack-google-cast`]: 'src/providers/google-cast/provider.ts',
  };
}

/** @returns {import('rollup').RollupOptions[]} */
function getPluginsBundles() {
  return [
    {
      input: 'src/plugins.ts',
      output: { file: 'plugins.js', format: 'esm' },
      external: PLUGINS_EXTERNAL_PACKAGES,
      treeshake: true,
      plugins: [
        nodeResolve(),
        esbuildPlugin({
          tsconfig: 'tsconfig.build.json',
          target: 'node18',
          platform: 'node',
          format: 'esm',
          // minify: true,
          legalComments: 'none',
          define: {
            __DEV__: 'false',
          },
        }),
      ],
    },
  ];
}
