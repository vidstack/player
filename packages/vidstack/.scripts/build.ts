import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import chokidar from 'chokidar';
import * as eslexer from 'es-module-lexer';
import { build, BuildOptions, Plugin } from 'esbuild';
import fsExtra from 'fs-extra';

import { copyPkgInfo } from '../../../.scripts/copy-pkg-info.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const version = JSON.parse(
  await fs.readFile(path.resolve(__dirname, '../package.json'), 'utf-8'),
).version;

const MODE_WATCH = process.argv.includes('-w'),
  MODE_CDN = process.argv.includes('--cdn'),
  MODE_CSS = process.argv.includes('--css');

const NPM_EXTERNAL_PACKAGES = [
    'hls.js',
    'dashjs',
    'media-captions',
    'media-icons',
    'media-icons/element',
    '@floating-ui*',
    'lit-html*',
  ],
  CDN_EXTERNAL_PACKAGES = ['media-captions', 'media-icons', 'media-icons/element', 'https://*'],
  PLUGINS_EXTERNAL_PACKAGES = ['vite', 'rollup', 'webpack*', 'rspack*', 'esbuild', 'unplugin'];

async function main() {
  const builds = getBuilds();

  if (MODE_WATCH) {
    watchStyles();
  }

  await Promise.all(builds.map((options) => build(options)));
}

function getBuilds(): BuildOptions[] {
  const cdnBundles = [...getCDNBundles(), ...getLegacyCDNBundles()];

  if (MODE_CSS) {
    return [];
  }

  if (MODE_CDN) {
    return cdnBundles;
  }

  return [...getNPMBundles(), ...getPluginsBundles(), ...cdnBundles];
}

function getNPMBundles(): BuildOptions[] {
  return [
    // dev
    {
      ...getNPMConfig({ dev: true }),
      entryPoints: getBrowserInputs(),
      plugins: [emptyOutDir(), copyAssets()],
    },
    // prod
    {
      ...getNPMConfig({ dev: false }),
      entryPoints: getBrowserInputs(),
    },
    // server
    {
      ...getNPMConfig({ server: true }),
      entryPoints: getBaseInputs(),
      plugins: [emptyOutDir(), serverElements()],
    },
  ];
}

function getPluginsBundles(): BuildOptions[] {
  return [
    {
      ...getBaseConfig({ dev: false, server: true }),
      entryPoints: ['src/plugins.ts'],
      outfile: 'dist-npm/plugins.js',
      external: PLUGINS_EXTERNAL_PACKAGES,
    },
  ];
}

function getNPMConfig(opts: BaseConfigOptions): BuildOptions {
  const dir = opts.server ? 'server' : opts.dev ? 'dev' : 'prod';
  return {
    ...getBaseConfig(opts),
    outdir: `dist-npm/${dir}`,
    splitting: true,
    external: NPM_EXTERNAL_PACKAGES,
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

function getBrowserInputs() {
  const layoutsDir = 'src/elements/define/layouts';
  return {
    ...getBaseInputs(),
    ...getProviderInputs(),
    'define/templates/vidstack-audio-layout': `${layoutsDir}/default/audio-layout-element.ts`,
    'define/templates/vidstack-video-layout': `${layoutsDir}/default/video-layout-element.ts`,
    'define/templates/plyr-layout': `${layoutsDir}/plyr/plyr-layout-element.ts`,
  };
}

function getBaseConfig({ dev = false, server = false }: BaseConfigOptions): BuildOptions {
  return {
    format: 'esm',
    target: server ? 'node18' : 'esnext',
    minify: !dev,
    bundle: true,
    treeShaking: true,
    write: true,
    allowOverwrite: true,
    legalComments: 'none',
    platform: server ? 'node' : 'browser',
    chunkNames: `chunks/vidstack-[hash]`,
    conditions: server
      ? ['node', 'default', 'development']
      : dev
        ? ['production', 'default']
        : ['development', 'production', 'default'],
    define: {
      __DEV__: dev ? 'true' : 'false',
      __SERVER__: server ? 'true' : 'false',
      __TEST__: 'false',
      __CDN__: 'false',
    },
    plugins: [emptyOutDir()],
  };
}

interface BaseConfigOptions {
  dev?: boolean;
  server?: boolean;
}

function getCDNBundles(): BuildOptions[] {
  const baseDir = 'dist-cdn',
    playerInput = 'src/elements/bundles/cdn/player.ts',
    playerCoreInput = 'src/elements/bundles/cdn/player.core.ts',
    plyrInput = 'src/elements/bundles/cdn/plyr.ts';

  return [
    // cdn.vidstack.io/player.dev
    getCDNConfig({
      dev: true,
      input: playerInput,
      dir: baseDir,
      file: 'player.dev',
    }),
    // cdn.vidstack.io/player
    getCDNConfig({
      input: playerInput,
      dir: baseDir,
      file: 'player',
    }),
    // cdn.vidstack.io/player.core.dev
    getCDNConfig({
      dev: true,
      input: playerCoreInput,
      dir: baseDir,
      file: 'player.core.dev',
    }),
    // cdn.vidstack.io/player.core
    getCDNConfig({
      input: playerCoreInput,
      dir: baseDir,
      file: 'player.core',
    }),
    // cdn.vidstack.io/plyr.dev
    getCDNConfig({
      dev: true,
      input: plyrInput,
      dir: baseDir,
      file: 'plyr.dev',
    }),
    // cdn.vidstack.io/plyr
    getCDNConfig({
      input: plyrInput,
      dir: baseDir,
      file: 'plyr',
    }),
  ];
}

function getCDNConfig({ dev, input, dir, file, legacy }: CDNBuildOptions): BuildOptions {
  const base = getBaseConfig({ dev });
  return {
    ...base,
    target: ['es2022', 'ios15'],
    entryPoints: dev ? [input] : { [file]: input, ...getProviderInputs() },
    outfile: dev ? `${dir}/${file}.js` : undefined,
    outdir: !dev ? dir : undefined,
    external: CDN_EXTERNAL_PACKAGES,
    splitting: !dev,
    define: {
      ...base.define,
      __CDN__: 'true',
    },
    alias: {
      ...base.alias,
      'media-icons': legacy
        ? 'https://cdn.jsdelivr.net/npm/media-icons@next/dist/lazy.js'
        : 'https://cdn.vidstack.io/icons',
      'media-captions': legacy
        ? 'https://cdn.jsdelivr.net/npm/media-captions@next/dist/prod.js'
        : 'https://cdn.vidstack.io/captions',
      'media-icons/element': 'https://cdn.vidstack.io/icons',
    },
    plugins: legacy ? base.plugins : [...(base.plugins ?? []), rewriteCDNChunks()],
  };
}

interface CDNBuildOptions {
  dev?: boolean;
  input: string;
  dir: string;
  file: string;
  legacy?: boolean;
}

function getLegacyCDNBundles(): BuildOptions[] {
  return [
    // Prod
    getCDNConfig({
      input: 'src/elements/bundles/cdn-legacy/player.ts',
      dir: 'dist-npm/cdn',
      file: 'vidstack',
      legacy: true,
    }),
    // All Layouts
    getCDNConfig({
      input: 'src/elements/bundles/cdn-legacy/player-with-layouts.ts',
      dir: 'dist-npm/cdn/with-layouts',
      file: 'vidstack',
      legacy: true,
    }),
  ];
}

function emptyOutDir(): Plugin {
  return {
    name: 'empty-out-dir',
    setup: (build) => {
      build.onStart(async () => {
        const { outdir } = build.initialOptions;
        if (outdir && (await fsExtra.exists(outdir))) {
          await fsExtra.rm(path.resolve(__dirname, `../${outdir}`), {
            recursive: true,
            force: true,
          });
        }
      });
    },
  };
}

function copyAssets(): Plugin {
  return {
    name: 'copy-assets',
    async setup(build) {
      build.onEnd(async () => {
        await copyPkgInfo();
        await fsExtra.copy('npm', 'dist-npm');

        await buildDefaultTheme();
        await fsExtra.copy('styles/player', 'dist-npm/player/styles');
      });
    },
  };
}

// This plugin rewrites chunk paths so our URL rewrites to jsDelivr work.
function rewriteCDNChunks(): Plugin {
  return {
    name: 'rewrite-cdn-chunks',
    setup(build) {
      build.onEnd(async () => {
        const dir = path.resolve(__dirname, '../dist-cdn'),
          chunks = (await fs.readdir(dir)).filter((f) => f.includes('.js'));

        await Promise.all(
          chunks.map(async (file) => {
            const filePath = path.resolve(dir, file),
              contents = await fs.readFile(filePath, 'utf-8');

            const newContents = contents.replace(
              /\"\.\/(chunks|providers)\/(.*?)\"/g,
              `"https://cdn.jsdelivr.net/npm/@vidstack/cdn@${version}/$1/$2"`,
            );

            await fs.writeFile(filePath, newContents, 'utf8');
          }),
        );
      });
    },
  };
}

function serverElements(): Plugin {
  return {
    name: 'server-elements',
    setup(build) {
      build.onStart(() => eslexer.init);

      const bundlesFilter = /src\/elements\/bundles/;
      build.onLoad({ filter: bundlesFilter }, () => ({ contents: '', loader: 'js' }));

      const elementsIndexFilter = /src\/elements\/index.ts/;
      build.onLoad({ filter: elementsIndexFilter }, async (args) => {
        const code = await fs.readFile(args.path, 'utf-8');

        const [_, exports] = eslexer.parse(code),
          define = 'export function defineCustomElement() {};\n';

        return {
          contents: exports
            .map((s) => (s.n === 'defineCustomElement' ? define : `export class ${s.n} {};`))
            .join('\n'),
          loader: 'js',
        };
      });
    },
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

function watchStyles() {
  chokidar.watch('styles/player/**').on('all', async (_, path) => {
    if (path !== 'styles/player/default/theme.css') {
      await buildDefaultTheme();
    }
  });
}

main();
