import fs from 'node:fs';
import path from 'node:path';

import { rollup as maverick } from '@maverick-js/compiler';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { transformSync } from 'esbuild';
import { globbySync } from 'globby';
import { defineConfig } from 'rollup';
import esbuildPlugin from 'rollup-plugin-esbuild';
import { visualizer } from 'rollup-plugin-visualizer';

const defineEntries = resolveDefineEntries();

buildCSS();

export default defineConfig([
  // server
  define({ dev: true, server: true }),
  // dev
  define({ dev: true, hydrate: true }),
  // prod
  define({ hydrate: true }),
  // cdn dev
  defineCDN({ dev: true }),
  // cdn prod
  defineCDN(),
]);

/**
 * @typedef {{
 * dev?: boolean;
 * server?: boolean;
 * hydrate?: boolean;
 * minify?: boolean;
 * target?: string | null;
 * }} BundleOptions
 */

/**
 * @param {BundleOptions}
 * @returns {import('rollup').RollupOptions}
 */
function define({ dev, server, hydrate, minify, target } = {}) {
  const alias = server ? 'server' : dev ? 'dev' : 'prod',
    shouldMangle = !dev && !server;

  /** @type {Record<string, string | false>} */
  let mangleCache = {};

  return {
    input: {
      index: 'src/index.ts',
      elements: 'src/elements.ts',
      icons: 'src/icons.ts',
      ...defineEntries,
    },
    maxParallelFileOps: shouldMangle ? 1 : 20,
    treeshake: true,
    preserveEntrySignatures: 'strict',
    external: [/maverick/, 'hls.js', 'media-captions', 'media-icons'],
    output: {
      format: 'esm',
      dir: `dist/${alias}`,
      chunkFileNames: '[name].js',
      manualChunks(id, meta) {
        const filename = path.basename(id, path.extname(id));

        if (id.includes('src/icons')) {
          return `icons/${filename}`;
        }

        if (
          id.includes('player/core') ||
          id.includes('player/foundation') ||
          id.includes('player/outlet')
        ) {
          return 'media-core';
        }

        if (id.includes('player/skins/community')) {
          return 'media-community-skin';
        }

        if (id.includes('player/ui')) {
          return 'media-ui';
        }

        if (id.includes('player')) {
          return path.relative(
            path.resolve(process.cwd(), 'src/player'),
            id.replace(path.extname(id), ''),
          );
        }

        return null;
      },
    },
    plugins: [
      nodeResolve({
        exportConditions: dev
          ? ['development', 'production', 'default']
          : ['production', 'default'],
      }),
      maverick({
        include: 'src/**/*.tsx',
        generate: server ? 'ssr' : 'dom',
        hydratable: hydrate
          ? (id) => !id.includes('time-slider/chapters') && !id.includes('skins/community')
          : false,
        diffArrays: false,
      }),
      esbuildPlugin({
        tsconfig: 'tsconfig.build.json',
        target: target ?? (server ? 'node18' : 'esnext'),
        platform: server ? 'node' : 'browser',
        minify: minify,
        define: {
          __DEV__: dev ? 'true' : 'false',
          __SERVER__: server ? 'true' : 'false',
          __TEST__: 'false',
        },
      }),
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
      // visualizer(),
    ],
  };
}

/** @returns {import('rollup').RollupOptions} */
function defineCDN({ dev = false } = {}) {
  const alias = dev ? 'dev' : 'prod';

  return {
    ...define({
      dev,
      server: false,
      hydrate: false,
      minify: !dev,
      target: 'es2020',
    }),
    input: {
      [alias]: 'src/cdn.ts',
    },
    output: {
      format: 'esm',
      dir: 'dist/cdn',
      chunkFileNames: `${alias}/[name].js`,
      paths: {
        'media-icons': 'https://cdn.jsdelivr.net/npm/media-icons/dist/lazy.js',
      },
      manualChunks(id, meta) {
        const filename = path.basename(id, path.extname(id));

        if (id.includes('maverick')) {
          return 'maverick';
        }

        if (id.includes('media-captions')) {
          return `captions/${filename}`;
        }

        if (id.includes('player/providers')) {
          return 'providers';
        }

        return null;
      },
    },
    external: ['media-icons'],
  };
}

function resolveDefineEntries() {
  const entries = globbySync('src/define/*.ts').reduce((entries, file) => {
    const entry = file.replace('src/', '').replace(/\.ts$/, '');
    entries[entry] = file;
    return entries;
  }, {});

  if (!fs.existsSync('define')) fs.mkdirSync('define');
  for (const entry of Object.keys(entries)) {
    fs.writeFileSync(entry + '.js', '// editor file - real file exists in `dist` dir');
  }

  return entries;
}

function buildCSS() {
  // CSS merge.
  let defaultStyles = fs.readFileSync('styles/base.css', 'utf-8'),
    communityAudioSkin = fs.readFileSync('src/player/skins/community/audio.css', 'utf-8'),
    communityVideoSkin = fs.readFileSync('src/player/skins/community/video.css', 'utf-8');

  for (const file of fs.readdirSync('styles/ui', 'utf-8')) {
    defaultStyles += '\n' + fs.readFileSync(`styles/ui/${file}`, 'utf-8');
  }

  fs.writeFileSync('styles/defaults.css', defaultStyles);

  if (!fs.existsSync('styles/community-skin')) fs.mkdirSync('styles/community-skin');
  fs.writeFileSync('styles/community-skin/audio.css', communityAudioSkin);
  fs.writeFileSync('styles/community-skin/video.css', communityVideoSkin);
}
