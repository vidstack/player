import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { nodeResolve } from '@rollup/plugin-node-resolve';
import * as lexer from 'es-module-lexer';
import fs from 'fs-extra';
import { defineConfig, type Plugin, type RollupOptions } from 'rollup';
import dts from 'rollup-plugin-dts';

import { copyPkgFiles } from '../../.build/copy-pkg-files.js';
import { buildDefaultTheme, watchStyles } from './build/build-styles.js';
import { decorators } from './build/rollup-decorators';
import { minify } from './build/rollup-minify';
import { typescript } from './build/rollup-ts';

const MODE_WATCH = process.argv.includes('-w'),
  MODE_TYPES = process.argv.includes('--config-types'),
  MODE_CDN = process.argv.includes('--config-cdn'),
  MODE_PLUGINS = process.argv.includes('--config-plugins'),
  MODE_CSS = process.argv.includes('--config-css');

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

if (!MODE_TYPES) {
  if (MODE_WATCH) {
    watchStyles();
  }
}

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

function isLibraryId(id) {
  return id.includes('node_modules');
}

function getTypesBundles(): RollupOptions[] {
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
        resolveGlobalTypes(),
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

function resolveGlobalTypes(): Plugin {
  return {
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
  };
}

function getNPMBundles() {
  return [
    defineNPMBundle({ type: 'server' }),
    defineNPMBundle({ type: 'dev' }),
    defineNPMBundle({ type: 'prod' }),
  ];
}

interface NPMBundleOptions {
  type: 'dev' | 'prod' | 'server';
}

function defineNPMBundle({ type }: NPMBundleOptions): RollupOptions {
  const isProd = type === 'prod',
    isServer = type === 'server',
    input = isServer ? getBaseInputs() : getBrowserInputs();

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
      decorators(),
      typescript({
        platform: isServer ? 'node' : 'browser',
        define: {
          __DEV__: !isProd && !isServer ? 'true' : 'false',
          __SERVER__: isServer ? 'true' : 'false',
          __CDN__: MODE_CDN ? 'true' : 'false',
          __TEST__: 'false',
        },
      }),
      // Only copy assets once in dev.
      !isProd && !isServer && copyAssets(),
      isServer && transformServerBundle(),
    ],
  };
}

/**
 * Transform element entry points into basically no-ops server-side.
 */
function transformServerBundle(): Plugin {
  return {
    name: 'server-bundle',
    async transform(code, id) {
      if (id.includes('src/elements/bundles')) return '';

      if (id.includes('src/elements/index.ts')) {
        await lexer.init;
        const [_, exports] = lexer.parse(code),
          define = 'export function defineCustomElement() {};\n';
        return exports
          .map((s) => (s.n === 'defineCustomElement' ? define : `export class ${s.n} {};`))
          .join('\n');
      }
    },
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

interface CDNBundleOptions {
  dev?: boolean;
  input: string;
  dir: string;
  file: string;
  legacy?: boolean;
}

function defineCDNBundle({
  dev = false,
  input,
  dir,
  file,
  legacy = false,
}: CDNBundleOptions): RollupOptions {
  const npmBundle = defineNPMBundle({
    type: dev ? 'dev' : 'prod',
  });

  return {
    ...npmBundle,
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
      ...(npmBundle.plugins as Plugin[]),
      !dev && minify(),
      !legacy && rewriteCDNChunks(file),
    ],
  };
}

/**
 * This plugin rewrites chunk paths so our URL rewrites to jsDelivr work.
 */
function rewriteCDNChunks(file: string): Plugin {
  return {
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
  };
}

function getBaseInputs() {
  return {
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
  };
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

function getLayoutInputs() {
  const layoutsDir = 'src/elements/define/layouts';
  return {
    'define/templates/vidstack-audio-layout': `${layoutsDir}/default/audio-layout-element.ts`,
    'define/templates/vidstack-video-layout': `${layoutsDir}/default/video-layout-element.ts`,
    'define/templates/plyr-layout': `${layoutsDir}/plyr/plyr-layout-element.ts`,
  };
}

function getBrowserInputs() {
  return {
    ...getBaseInputs(),
    ...getProviderInputs(),
    ...getLayoutInputs(),
  };
}

function getPluginsBundles(): RollupOptions[] {
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
        typescript({
          platform: 'node',
          define: {
            __DEV__: 'false',
          },
        }),
        minify(),
      ],
    },
  ];
}

function copyAssets(): Plugin {
  return {
    name: 'copy-',
    async buildEnd() {
      await copyPkgFiles();
      await buildDefaultTheme();
      await fs.copy('styles/player', 'dist-npm/player/styles');
      await fs.copy('npm', 'dist-npm');
    },
  };
}

export default defineConfig(getBundles());
