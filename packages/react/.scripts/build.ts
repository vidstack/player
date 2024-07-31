import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { build, BuildOptions, Plugin } from 'esbuild';
import fs from 'fs-extra';

import { copyPkgInfo } from '../../../.scripts/copy-pkg-info.js';
import { buildDefaultTheme, watchStyles } from '../../vidstack/.scripts/build-styles.js';

const require = createRequire(import.meta.url);

const DIRNAME = path.dirname(fileURLToPath(import.meta.url));

const ROOT_DIR = path.resolve(DIRNAME, '..'),
  DIST_NPM_DIR = path.resolve(ROOT_DIR, 'dist-npm'),
  VIDSTACK_PKG_DIR = path.resolve(ROOT_DIR, 'node_modules/vidstack'),
  VIDSTACK_LOCAL_FILE = path.resolve('../vidstack/src/index.ts'),
  VIDSTACK_EXPORTS_FILE = path.resolve('../vidstack/src/exports');

const MODE_WATCH = process.argv.includes('-w');

const NPM_EXTERNAL_PACKAGES = [
  'react',
  'react-dom',
  'media-icons',
  'media-captions',
  'hls.js',
  'dashjs',
  '@floating-ui*',
  'remotion*',
];

async function main() {
  const builds = getNPMBundles();

  if (MODE_WATCH) {
    watchStyles(copyStyles);
  }

  await Promise.all(builds.map((options) => build(options)));
}

function getNPMBundles(): BuildOptions[] {
  const defaultPlugins = [resolveVidstack(), rscDirectives()],
    browserPlugins = [virtualEnv(), ...defaultPlugins];
  return [
    // dev
    {
      ...getNPMConfig({ dev: true }),
      entryPoints: getBaseInputs(),
      plugins: [copyAssets(), ...browserPlugins],
    },
    // prod
    {
      ...getNPMConfig({ dev: false }),
      entryPoints: getProdInputs(),
      plugins: browserPlugins,
    },
    // server
    {
      ...getNPMConfig({ server: true }),
      entryPoints: getBaseInputs(),
      plugins: defaultPlugins,
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
    'player/vidstack-remotion': 'src/providers/remotion/index.ts',
    'player/vidstack-default-layout': 'src/components/layouts/default/index.ts',
    'player/vidstack-plyr-layout': 'src/components/layouts/plyr/index.ts',
    'player/vidstack-plyr-icons': 'src/components/layouts/plyr/icons.tsx',
    'player/vidstack-default-components': 'src/components/layouts/default/ui.ts',
    'player/vidstack-default-icons': 'src/components/layouts/default/icons.tsx',
  };
}

function getProdInputs() {
  return {
    ...getBaseInputs(),
    'vidstack-icons': 'src/icons.ts',
  };
}

function getBaseConfig({ dev = false, server = false }: BaseConfigOptions): BuildOptions {
  return {
    format: 'esm',
    target: server ? 'node18' : 'es2022',
    supported: {
      'class-static-blocks': false,
    },
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
      __SERVER__: server ? 'true' : 'IS_SERVER',
      __TEST__: 'false',
      __CDN__: 'false',
    },
  };
}

interface BaseConfigOptions {
  dev?: boolean;
  server?: boolean;
}

function copyAssets(): Plugin {
  return {
    name: 'copy-assets',
    async setup(build) {
      build.onEnd(async () => {
        await copyPkgInfo();
        await buildDefaultTheme();
        await copyStyles();
        await copyTailwindPlugin();
        await fs.copy('npm', 'dist-npm');
      });
    },
  };
}

async function copyStyles() {
  const from = path.resolve(VIDSTACK_PKG_DIR, 'styles/player'),
    to = path.resolve(DIST_NPM_DIR, 'player/styles');
  await fs.copy(from, to);
}

async function copyTailwindPlugin() {
  const pluginFile = path.resolve(VIDSTACK_PKG_DIR, 'npm/tailwind.cjs'),
    pluginDTSFile = path.resolve(VIDSTACK_PKG_DIR, 'npm/tailwind.d.cts');
  await fs.copyFile(pluginFile, path.resolve(DIST_NPM_DIR, 'tailwind.cjs'));
  await fs.copyFile(pluginDTSFile, path.resolve(DIST_NPM_DIR, 'tailwind.d.cts'));
}

function resolveVidstack(): Plugin {
  return {
    name: 'resolve-vidstack',
    setup(build) {
      const vidstackModuleFilter = /^vidstack$/;
      build.onResolve({ filter: vidstackModuleFilter }, () => {
        return { path: VIDSTACK_LOCAL_FILE };
      });

      const exportsModuleFilter = /^vidstack\/exports/;
      build.onResolve({ filter: exportsModuleFilter }, ({ path }) => {
        const file = path.replace('vidstack/exports', VIDSTACK_EXPORTS_FILE);
        return { path: file + '.ts' };
      });
    },
  };
}

function virtualEnv(): Plugin {
  return {
    name: 'virtual-env',
    setup(build) {
      const envModuleFilter = /^:virtual\/env$/;

      build.onResolve({ filter: envModuleFilter }, () => {
        return { namespace: 'virtual-env', path: ':virtual/env' };
      });

      build.onLoad({ filter: envModuleFilter }, () => {
        return {
          contents: 'export const IS_SERVER = typeof document === "undefined";',
          loader: 'js',
        };
      });

      const envImport = "import { IS_SERVER } from ':virtual/env';\n";
      build.onLoad({ filter: /\.(?:js|ts|tsx)$/ }, async ({ namespace, path }) => {
        if (namespace !== 'file') return;
        return {
          contents: envImport + (await fs.readFile(path, 'utf-8')),
          loader: 'tsx',
        };
      });
    },
  };
}

function rscDirectives(): Plugin {
  return {
    name: 'rsc-directives',
    setup(build) {
      const isDev = build.initialOptions.outdir?.includes('/dev');

      const maverickFilter = /^maverick\.js/,
        maverickModule = require
          .resolve('maverick.js/rsc')
          .replace('prod.js', isDev ? 'dev.js' : 'prod.js');

      build.onResolve({ filter: maverickFilter }, () => {
        return { path: maverickModule };
      });

      const { outdir } = build.initialOptions,
        serverChunks = new Set(['vidstack-icons.js']);

      if (outdir) {
        async function addDirectives(dir) {
          const files = await fs.readdir(dir);
          await Promise.all(
            files.map(async (file) => {
              const filePath = path.resolve(dir, file),
                isDir = (await fs.stat(filePath)).isDirectory();

              if (isDir) {
                if (file === 'chunks') return;
                await addDirectives(filePath);
              } else if (!serverChunks.has(file)) {
                const contents = await fs.readFile(filePath, 'utf-8');
                await fs.writeFile(filePath, `"use client";\n\n` + contents);
              }
            }),
          );
        }

        build.onEnd(() => addDirectives(outdir));
      }
    },
  };
}

main();
