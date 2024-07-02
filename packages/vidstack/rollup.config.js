import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { nodeResolve } from '@rollup/plugin-node-resolve';
import chokidar from 'chokidar';
import * as eslexer from 'es-module-lexer';
import { build, transform as esbuildTransform } from 'esbuild';
import fsExtra from 'fs-extra';
import { globbySync } from 'globby';
import { defineConfig } from 'rollup';
import dts from 'rollup-plugin-dts';
import esbuildPlugin from 'rollup-plugin-esbuild';

import { copyPkgInfo } from '../../.scripts/copy-pkg-info.js';

const MODE_WATCH = process.argv.includes('-w'),
  MODE_TYPES = process.argv.includes('--config-types'),
  MODE_CDN = process.argv.includes('--config-cdn'),
  MODE_PLUGINS = process.argv.includes('--config-plugins'),
  MODE_CSS = process.argv.includes('--config-css');

/** @type {Record<string, string | false>} */
const MANGLE_CACHE = !MODE_TYPES ? await buildMangleCache() : {};

const NPM_EXTERNAL_PACKAGES = [
    'hls.js',
    'dashjs',
    'media-captions',
    'media-icons',
    'media-icons/element',
    /^@floating-ui/,
    /^lit-html/,
  ],
  CDN_EXTERNAL_PACKAGES = ['media-captions', 'media-icons', 'media-icons/element'],
  PLUGINS_EXTERNAL_PACKAGES = ['vite', 'rollup', /webpack/, /rspack/, 'esbuild', 'unplugin'],
  TYPES_EXTERNAL_PACKAGES = NPM_EXTERNAL_PACKAGES;

// Styles
if (!MODE_TYPES) {
  if (MODE_WATCH) {
    chokidar.watch('styles/player/**').on('all', async (_, path) => {
      if (path !== 'styles/player/default/theme.css') {
        await buildDefaultTheme();
      }
    });

    fsExtra.copyFile('package.json', 'dist-npm/package.json');
  }
}

export default defineConfig(getBundles());

function getBundles() {
  if (MODE_CSS) {
    return [];
  } else if (MODE_PLUGINS) {
    return getPluginsBundles();
  } else if (MODE_CDN) {
    return getCDNBundles();
  } else if (MODE_WATCH) {
    return [...getNPMBundles(), ...getTypesBundles()];
  } else if (MODE_TYPES) {
    return getTypesBundles();
  } else {
    return [...getNPMBundles(), ...getLegacyCDNBundles(), ...getPluginsBundles()];
  }
}

/**
 * @param {string} id
 */
function isLibraryId(id) {
  return id.includes('node_modules');
}

/**
 * @returns {import('rollup').RollupOptions[]}
 * */
function getTypesBundles() {
  /** @type {Record<string, string>} */
  const input = {
    index: 'types/index.d.ts',
    elements: 'types/elements/index.d.ts',
    'global/player': 'types/global/player.d.ts',
    'global/plyr': 'types/global/plyr.d.ts',
    icons: 'types/elements/bundles/icons.d.ts',
  };

  return [
    {
      input,
      output: {
        dir: 'dist-npm',
        chunkFileNames: 'types/vidstack-[hash].d.ts',
        compact: false,
        minifyInternalExports: false,
        manualChunks(id) {
          if (isLibraryId(id)) {
            return 'framework.d';
          }
        },
      },
      external: TYPES_EXTERNAL_PACKAGES,
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
      output: {
        file: 'dist-npm/plugins.d.ts',
        compact: false,
        minifyInternalExports: false,
      },
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
      'global/vidstack-player': 'src/global/player.ts',
      'global/plyr': 'src/global/plyr.ts',
      'define/vidstack-icons': 'src/elements/bundles/icons.ts',
      'define/vidstack-player': 'src/elements/bundles/player.ts',
      'define/vidstack-player-ui': 'src/elements/bundles/player-ui.ts',
      'define/vidstack-player-layouts': 'src/elements/bundles/player-layouts/index.ts',
      'define/vidstack-player-default-layout': 'src/elements/bundles/player-layouts/default.ts',
      'define/plyr-layout': 'src/elements/bundles/player-layouts/plyr.ts',
    },
    isProd = type === 'prod',
    isServer = type === 'server',
    shouldMangle = type === 'prod';

  if (!isServer) {
    input = {
      ...input,
      ...getProviderInputs(),
    };

    input['define/vidstack-audio-layout-el'] =
      'src/elements/define/layouts/default/audio-layout-element.ts';
    input['define/vidstack-video-layout-el'] =
      'src/elements/define/layouts/default/video-layout-element.ts';
    input['define/plyr-layout-el'] = 'src/elements/define/layouts/plyr/plyr-layout-element.ts';
  }

  return {
    input,
    treeshake: true,
    preserveEntrySignatures: 'strict',
    external: NPM_EXTERNAL_PACKAGES,
    output: {
      format: 'esm',
      compact: false,
      minifyInternalExports: false,
      dir: `dist-npm/${type.replace('local-', '')}`,
      chunkFileNames: 'chunks/vidstack-[hash].js',
      manualChunks(id) {
        if (id.includes('lit-html')) return 'framework-layouts';
        if (isLibraryId(id)) return 'framework';
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
      !isProd &&
        !isServer && {
          name: 'npm-artifacts',
          async buildEnd() {
            await copyPkgInfo();
            await buildDefaultTheme();
            await fsExtra.copy('npm', 'dist-npm');
            await fsExtra.copy('styles/player', 'dist-npm/player/styles');
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
      esbuildPlugin({
        tsconfig: 'tsconfig.build.json',
        target: target ?? (isServer ? 'node18' : 'esnext'),
        platform: isServer ? 'node' : 'browser',
        minify: minify,
        legalComments: 'none',
        define: {
          __DEV__: !isProd && !isServer ? 'true' : 'false',
          __SERVER__: isServer ? 'true' : 'false',
          __CDN__: MODE_CDN ? 'true' : 'false',
          __TEST__: 'false',
        },
      }),
      shouldMangle && {
        name: 'mangle',
        async transform(code, id) {
          if (id.includes('node_modules')) return null;
          return (
            await esbuildTransform(code, {
              target: 'esnext',
              platform: 'neutral',
              mangleProps: /^_/,
              mangleCache: MANGLE_CACHE,
              reserveProps: /^__/,
            })
          ).code;
        },
      },
    ],
  };
}

function getLegacyCDNBundles() {
  return [
    // Prod
    defineCDNBundle({
      input: 'src/elements/bundles/cdn-legacy/player.ts',
      dir: 'dist-npm/cdn',
      file: 'vidstack',
      legacy: true,
    }),
    // All Layouts
    defineCDNBundle({
      input: 'src/elements/bundles/cdn-legacy/player-with-layouts.ts',
      dir: 'dist-npm/cdn/with-layouts',
      file: 'vidstack',
      legacy: true,
    }),
  ];
}

function getCDNBundles() {
  const baseDir = 'dist-cdn',
    playerInput = 'src/elements/bundles/cdn/player.ts',
    playerCoreInput = 'src/elements/bundles/cdn/player.core.ts',
    plyrInput = 'src/elements/bundles/cdn/plyr.ts';

  return [
    // cdn.vidstack.io/player.dev
    defineCDNBundle({
      dev: true,
      input: playerInput,
      dir: baseDir,
      file: 'player.dev',
    }),
    // cdn.vidstack.io/player
    defineCDNBundle({
      input: playerInput,
      dir: baseDir,
      file: 'player',
    }),
    // cdn.vidstack.io/player.core.dev
    defineCDNBundle({
      dev: true,
      input: playerCoreInput,
      dir: baseDir,
      file: 'player.core.dev',
    }),
    // cdn.vidstack.io/player.core
    defineCDNBundle({
      input: playerCoreInput,
      dir: baseDir,
      file: 'player.core',
    }),
    // cdn.vidstack.io/plyr.dev
    defineCDNBundle({
      dev: true,
      input: plyrInput,
      dir: baseDir,
      file: 'plyr.dev',
    }),
    // cdn.vidstack.io/plyr
    defineCDNBundle({
      input: plyrInput,
      dir: baseDir,
      file: 'plyr',
    }),
  ];
}

/**
 * @param {{ dev?: boolean; input: string; dir: string; file: string; legacy?: boolean }} options
 * @returns {import('rollup').RollupOptions}
 */
function defineCDNBundle({ dev = false, input, dir, file, legacy = false }) {
  const npm = defineNPMBundle({
    type: dev ? 'dev' : 'prod',
    minify: !dev,
    target: 'es2020',
  });

  return {
    ...npm,
    input: dev ? input : { [file]: input, ...getProviderInputs() },
    preserveEntrySignatures: dev ? 'allow-extension' : 'strict',
    output: {
      format: 'esm',
      file: dev ? `${dir}/${file}.js` : undefined,
      dir: !dev ? dir : undefined,
      chunkFileNames: `chunks/vidstack-[hash].js`,
      entryFileNames(chunk) {
        return chunk.name === file ? `[name].js` : `[name]-[hash].js`;
      },
      paths: {
        'media-icons': legacy
          ? 'https://cdn.jsdelivr.net/npm/media-icons@next/dist/lazy.js'
          : 'https://cdn.vidstack.io/icons',
        'media-captions': legacy
          ? 'https://cdn.jsdelivr.net/npm/media-captions@next/dist/prod.js'
          : 'https://cdn.vidstack.io/captions',
        'media-icons/element': 'https://cdn.vidstack.io/icons',
      },
      manualChunks(id) {
        if (dev) return file;

        if (isLibraryId(id)) {
          return 'frameworks';
        }

        return null;
      },
    },
    external: CDN_EXTERNAL_PACKAGES,
    plugins: [
      .../** @type {*} */ (npm.plugins),
      {
        // This plugin rewrites chunk paths so our URL rewrites to jsDelivr work.
        name: 'cdn-chunks',
        async generateBundle(_, bundle) {
          const __dirname = path.dirname(fileURLToPath(import.meta.url)),
            version = JSON.parse(
              await fs.readFile(path.join(__dirname, 'package.json'), 'utf-8'),
            ).version;

          for (const chunk of Object.values(bundle)) {
            if (chunk.type === 'chunk' && chunk.isEntry && chunk.name === file) {
              chunk.code = chunk.code.replace(
                /\"\.\/(chunks|providers)\/(.*?)\"/g,
                `"https://cdn.jsdelivr.net/npm/@vidstack/cdn@${version}/$1/$2"`,
              );
            }
          }
        },
      },
    ],
  };
}

async function buildDefaultTheme() {
  // CSS merge.
  let defaultStyles = await fs.readFile('styles/player/base.css', 'utf-8');

  const themeDir = 'styles/player/default',
    themeDirFiles = await fs.readdir(themeDir, 'utf-8');

  for (const file of themeDirFiles) {
    if (file === 'theme.css' || file === 'layouts') continue;
    defaultStyles += '\n' + (await fs.readFile(`${themeDir}/${file}`, 'utf-8'));
  }

  await fs.writeFile('styles/player/default/theme.css', defaultStyles);
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
    [`providers/vidstack-dash`]: 'src/providers/dash/provider.ts',
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
      output: {
        file: 'dist-npm/plugins.js',
        format: 'esm',
        compact: false,
        minifyInternalExports: false,
      },
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
