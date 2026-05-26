import path from 'node:path';
import { fileURLToPath } from 'node:url';

import * as lexer from 'es-module-lexer';
import fs from 'fs-extra';
import type { Plugin } from 'rolldown';
import { dts as rolldownDts } from 'rolldown-plugin-dts';
import { defineConfig, type UserConfig } from 'tsdown';

import { copyPkgFiles } from '../../.build/copy-pkg-files.js';
import { buildDefaultTheme, watchStyles } from './build/build-styles.js';
import { decorators } from './build/rollup-decorators';

const MODE_WATCH = process.argv.includes('-w') || process.argv.includes('--watch'),
  MODE_TYPES = process.argv.includes('--types'),
  MODE_CDN = process.argv.includes('--cdn'),
  MODE_PLUGINS = process.argv.includes('--plugins'),
  MODE_CSS = process.argv.includes('--css');

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
  CDN_EXTERNAL_PATHS = {
    'media-icons': 'https://cdn.jsdelivr.net/npm/media-icons@1.1.5/dist/lazy.js/+esm',
    'media-icons/element': 'https://cdn.jsdelivr.net/npm/media-icons@1.1.5/dist/cdn.js/+esm',
    'media-captions': 'https://cdn.jsdelivr.net/npm/media-captions@1.0.4/dist/prod.js/+esm',
  },
  PLUGINS_EXTERNAL_PACKAGES = ['vite', 'rollup', /webpack/, /rspack/, 'esbuild', 'unplugin'];

if (!MODE_TYPES && MODE_WATCH) {
  watchStyles();
}

function isLibraryId(id: string) {
  return id.includes('node_modules');
}

// ---------------------------------------------------------------------------
// NPM Bundles
// ---------------------------------------------------------------------------

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
    'providers/vidstack-html': 'src/providers/html/provider.ts',
    'providers/vidstack-audio': 'src/providers/audio/provider.ts',
    'providers/vidstack-video': 'src/providers/video/provider.ts',
    'providers/vidstack-hls': 'src/providers/hls/provider.ts',
    'providers/vidstack-dash': 'src/providers/dash/provider.ts',
    'providers/vidstack-youtube': 'src/providers/youtube/provider.ts',
    'providers/vidstack-vimeo': 'src/providers/vimeo/provider.ts',
    'providers/vidstack-google-cast': 'src/providers/google-cast/provider.ts',
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

interface NPMBundleOptions {
  type: 'dev' | 'prod' | 'server';
}

function defineNPMBundle({ type }: NPMBundleOptions): UserConfig {
  const isProd = type === 'prod',
    isServer = type === 'server',
    entry = isServer ? getBaseInputs() : getBrowserInputs();

  return {
    entry,
    outDir: `dist-npm/${type}`,
    format: 'esm',
    platform: isServer ? 'neutral' : 'browser',
    target: 'esnext',
    treeshake: true,
    dts: false,
    clean: false,
    fixedExtension: false,
    sourcemap: false,
    deps: {
      neverBundle: NPM_EXTERNAL_PACKAGES,
    },
    define: {
      __DEV__: !isProd && !isServer ? 'true' : 'false',
      __SERVER__: isServer ? 'true' : 'false',
      __CDN__: MODE_CDN ? 'true' : 'false',
      __TEST__: 'false',
    },
    inputOptions: {
      preserveEntrySignatures: 'strict',
      resolve: {
        conditionNames: isServer
          ? ['node', 'default', 'development']
          : isProd
            ? ['production', 'default']
            : ['development', 'production', 'default'],
      },
    },
    outputOptions: {
      chunkFileNames: 'chunks/vidstack-[hash].js',
      entryFileNames: '[name].js',
      minifyInternalExports: false,
      codeSplitting: {
        groups: [
          { name: 'framework-layouts', test: /lit-html/ },
          { name: 'framework', test: /node_modules/ },
        ],
      },
    },
    plugins: [
      decorators() as any,
      isServer && (transformServerBundle() as any),
      // Only copy assets once (in dev — same behavior as the rollup config).
      !isProd && !isServer && (copyAssets() as any),
    ].filter(Boolean) as any,
  };
}

/**
 * Transform element entry points into basically no-ops server-side.
 */
function transformServerBundle(): Plugin {
  return {
    name: 'server-bundle',
    async transform(code: string, id: string) {
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

function copyAssets(): Plugin {
  return {
    name: 'copy-assets',
    async writeBundle() {
      await copyPkgFiles();
      await buildDefaultTheme();
      await fs.copy('styles/player', 'dist-npm/player/styles');
      await fs.copy('npm', 'dist-npm');
    },
  };
}

// ---------------------------------------------------------------------------
// Plugins bundle
// ---------------------------------------------------------------------------

function definePluginsBundle(): UserConfig {
  return {
    entry: { plugins: 'src/plugins.ts' },
    outDir: 'dist-npm',
    format: 'esm',
    platform: 'node',
    target: 'esnext',
    treeshake: true,
    dts: false,
    clean: false,
    sourcemap: false,
    fixedExtension: false,
    deps: {
      neverBundle: PLUGINS_EXTERNAL_PACKAGES,
    },
    define: { __DEV__: 'false' },
    minify: true,
    outputOptions: {
      minifyInternalExports: false,
      entryFileNames: '[name].js',
    },
  };
}

// ---------------------------------------------------------------------------
// CDN Bundles
// ---------------------------------------------------------------------------

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
}: CDNBundleOptions): UserConfig {
  const base = defineNPMBundle({ type: dev ? 'dev' : 'prod' });

  const entry = dev ? { [file]: input } : { [file]: input, ...getProviderInputs() };

  return {
    ...base,
    entry,
    outDir: dir,
    deps: {
      neverBundle: CDN_EXTERNAL_PACKAGES,
    },
    define: {
      ...(base.define as Record<string, string>),
      __CDN__: 'true',
    },
    minify: !dev,
    inputOptions: {
      ...(base.inputOptions as any),
      preserveEntrySignatures: dev ? 'allow-extension' : 'strict',
    },
    outputOptions: {
      chunkFileNames: 'chunks/vidstack-[hash].js',
      entryFileNames: (chunk: { name: string }) =>
        chunk.name === file ? `[name].js` : `[name]-[hash].js`,
      minifyInternalExports: false,
      paths: CDN_EXTERNAL_PATHS,
      codeSplitting: dev ? false : { groups: [{ name: 'frameworks', test: /node_modules/ }] },
    },
    plugins: [decorators() as any, !legacy && (rewriteCDNChunks(file) as any)].filter(
      Boolean,
    ) as any,
  };
}

function rewriteCDNChunks(file: string): Plugin {
  return {
    name: 'cdn-chunks',
    async generateBundle(_options: any, bundle: Record<string, any>) {
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

function getLegacyCDNBundles(): UserConfig[] {
  return [
    defineCDNBundle({
      input: 'src/elements/bundles/cdn-legacy/player.ts',
      dir: 'dist-npm/cdn',
      file: 'vidstack',
      legacy: true,
    }),
    defineCDNBundle({
      input: 'src/elements/bundles/cdn-legacy/player-with-layouts.ts',
      dir: 'dist-npm/cdn/with-layouts',
      file: 'vidstack',
      legacy: true,
    }),
  ];
}

// ---------------------------------------------------------------------------
// Types Bundle
// ---------------------------------------------------------------------------

const TYPES_EXTERNAL_PACKAGES = NPM_EXTERNAL_PACKAGES;

function getTypesBundles(): UserConfig[] {
  return [
    {
      entry: {
        index: 'types/index.d.ts',
        elements: 'types/elements/index.d.ts',
        'global/player': 'types/global/player.d.ts',
        'global/plyr': 'types/global/plyr.d.ts',
        icons: 'types/elements/bundles/icons.d.ts',
      },
      outDir: 'dist-npm',
      format: 'esm',
      dts: false,
      clean: false,
      sourcemap: false,
      fixedExtension: false,
      deps: {
        neverBundle: TYPES_EXTERNAL_PACKAGES,
      },
      outputOptions: {
        chunkFileNames: 'types/vidstack-[hash].d.ts',
        entryFileNames: '[name].d.ts',
        minifyInternalExports: false,
        codeSplitting: {
          groups: [{ name: 'framework.d', test: /node_modules/ }],
        },
      },
      plugins: [
        ...(rolldownDts({
          dtsInput: true,
          emitDtsOnly: true,
        }) as any[]),
        resolveGlobalTypes() as any,
      ],
    },
    {
      entry: { plugins: 'types/plugins.d.ts' },
      outDir: 'dist-npm',
      format: 'esm',
      dts: false,
      clean: false,
      sourcemap: false,
      fixedExtension: false,
      deps: {
        neverBundle: PLUGINS_EXTERNAL_PACKAGES,
      },
      outputOptions: {
        entryFileNames: '[name].d.ts',
        minifyInternalExports: false,
      },
      plugins: [
        ...(rolldownDts({
          dtsInput: true,
          emitDtsOnly: true,
        }) as any[]),
      ],
    },
  ];
}

function resolveGlobalTypes(): Plugin {
  return {
    name: 'globals',
    generateBundle(_options: any, bundle: Record<string, any>) {
      const files = new Set(['index.d.ts', 'elements.d.ts']),
        references = ['dom.d.ts', 'google-cast.d.ts']
          .map((p) => `/// <reference path="./${p}" />`)
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

function getModernCDNBundles(): UserConfig[] {
  const baseDir = 'dist-cdn',
    playerInput = 'src/elements/bundles/cdn/player.ts',
    playerCoreInput = 'src/elements/bundles/cdn/player.core.ts',
    plyrInput = 'src/elements/bundles/cdn/plyr.ts';

  return [
    defineCDNBundle({ dev: true, input: playerInput, dir: baseDir, file: 'player.dev' }),
    defineCDNBundle({ input: playerInput, dir: baseDir, file: 'player' }),
    defineCDNBundle({ dev: true, input: playerCoreInput, dir: baseDir, file: 'player.core.dev' }),
    defineCDNBundle({ input: playerCoreInput, dir: baseDir, file: 'player.core' }),
    defineCDNBundle({ dev: true, input: plyrInput, dir: baseDir, file: 'plyr.dev' }),
    defineCDNBundle({ input: plyrInput, dir: baseDir, file: 'plyr' }),
  ];
}

// ---------------------------------------------------------------------------
// Final config selection
// ---------------------------------------------------------------------------

function getConfigs(): UserConfig[] {
  if (MODE_CSS) return [];

  if (MODE_PLUGINS) return [definePluginsBundle()];

  if (MODE_CDN) return getModernCDNBundles();

  if (MODE_TYPES) return getTypesBundles();

  // Default: NPM bundles + legacy CDN + plugins bundle.
  return [
    defineNPMBundle({ type: 'server' }),
    defineNPMBundle({ type: 'dev' }),
    defineNPMBundle({ type: 'prod' }),
    ...getLegacyCDNBundles(),
    definePluginsBundle(),
  ];
}

export default defineConfig(getConfigs());
