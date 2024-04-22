import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { nodeResolve } from '@rollup/plugin-node-resolve';
import chokidar from 'chokidar';
import { build, transform as esbuildTransform } from 'esbuild';
import fsExtra from 'fs-extra';
import { globbySync } from 'globby';
import { defineConfig } from 'rollup';
import dts from 'rollup-plugin-dts';
import esbuildPlugin from 'rollup-plugin-esbuild';

const MODE_WATCH = process.argv.includes('-w'),
  MODE_TYPES = process.argv.includes('--config-types');

/** @type {Record<string, string | false>} */
const MANGLE_CACHE = !MODE_TYPES ? await buildMangleCache() : {};

const DIRNAME = path.dirname(fileURLToPath(import.meta.url)),
  ROOT_DIR = path.resolve(DIRNAME, '.'),
  DIST_NPM_DIR = path.resolve(ROOT_DIR, 'dist-npm'),
  VIDSTACK_PKG_DIR = path.resolve(ROOT_DIR, 'node_modules/vidstack'),
  VIDSTACK_LOCAL_PATH = path.resolve('../vidstack/src/index.ts');

const NPM_EXTERNAL_PACKAGES = [
    'react',
    'react-dom',
    'media-icons',
    'media-captions',
    'hls.js',
    'dashjs',
    /^remotion/,
  ],
  NPM_BUNDLES = [defineNPMBundle({ dev: true }), defineNPMBundle({ dev: false })],
  TYPES_BUNDLES = defineTypesBundle();

// Styles
if (!MODE_TYPES) {
  if (MODE_WATCH) {
    chokidar.watch('player/styles/**').on('all', (_, path) => {
      if (path !== 'player/styles/default/theme.css') buildDefaultTheme();
    });

    fsExtra.copyFile('package.json', 'dist-npm/package.json');
  }
}

export default defineConfig(
  MODE_WATCH ? [...TYPES_BUNDLES, ...NPM_BUNDLES] : MODE_TYPES ? TYPES_BUNDLES : NPM_BUNDLES,
);

/**
 * @returns {import('rollup').RollupOptions[]}
 * */
function defineTypesBundle() {
  return [
    {
      input: {
        index: 'types/react/src/index.d.ts',
        icons: 'types/react/src/icons.d.ts',
        'player/remotion': 'types/react/src/providers/remotion/index.d.ts',
        'player/layouts/default': 'types/react/src/components/layouts/default/index.d.ts',
        'player/layouts/plyr': 'types/react/src/components/layouts/plyr/index.d.ts',
      },
      output: {
        dir: 'dist-npm',
        chunkFileNames: 'types/[name].d.ts',
        manualChunks(id) {
          if (id.includes('react/src')) return 'vidstack-react';
          if (id.includes('maverick')) return 'vidstack-framework';
          if (id.includes('vidstack')) return 'vidstack';
        },
      },
      external: NPM_EXTERNAL_PACKAGES,
      plugins: [
        {
          name: 'resolve-vidstack-types',
          resolveId(id) {
            if (id === 'vidstack') {
              return 'types/vidstack/src/index.d.ts';
            }
          },
        },
        dts({
          respectExternal: true,
        }),
        {
          name: 'globals',
          generateBundle(_, bundle) {
            const indexFile = Object.values(bundle).find((file) => file.fileName === 'index.d.ts'),
              globalFiles = ['dom.d.ts', 'google-cast.d.ts'],
              references = globalFiles
                .map((path) => `/// <reference path="./${path}" />`)
                .join('\n');

            for (const file of globalFiles) {
              fsExtra.copyFileSync(path.resolve(`../vidstack/npm/${file}`), `dist-npm/${file}`);
            }

            if (indexFile?.type === 'chunk') {
              indexFile.code = references + `\n\n${indexFile.code}`;
            }
          },
        },
      ],
    },
  ];
}

/**
 * @typedef {{
 * dev?: boolean;
 * }} BundleOptions
 */

/**
 * @param {BundleOptions}
 * @returns {import('rollup').RollupOptions}
 */
function defineNPMBundle({ dev }) {
  let alias = dev ? 'dev' : 'prod';

  let input = {
    vidstack: 'src/index.ts',
    'player/vidstack-remotion': 'src/providers/remotion/index.ts',
    'player/vidstack-default-layout': 'src/components/layouts/default/index.ts',
    'player/vidstack-plyr-layout': 'src/components/layouts/plyr/index.ts',
    'player/vidstack-plyr-icons': 'src/components/layouts/plyr/icons.tsx',
    'player/vidstack-default-components': 'src/components/layouts/default/ui.ts',
    'player/vidstack-default-icons': 'src/components/layouts/default/icons.tsx',
  };

  if (!dev) {
    input['vidstack-icons'] = 'src/icons.ts';
  }

  return {
    input,
    treeshake: true,
    preserveEntrySignatures: 'allow-extension',
    maxParallelFileOps: !dev ? 1 : 20,
    external: NPM_EXTERNAL_PACKAGES,
    output: {
      format: 'esm',
      dir: `dist-npm/${alias}`,
      chunkFileNames: `chunks/vidstack-[hash].js`,
      manualChunks(id) {
        if (id.includes('maverick')) return 'vidstack-framework';
      },
    },
    plugins: [
      {
        name: 'vidstack-link',
        resolveId(id) {
          if (id === ':virtual/env') {
            return id;
          } else if (id === 'vidstack') {
            return VIDSTACK_LOCAL_PATH;
          }
        },
        load(id) {
          if (id === ':virtual/env') {
            return 'export const IS_SERVER = typeof document === "undefined";';
          }
        },
        transform(code) {
          if (code.includes('__SERVER__')) {
            code = code.replace(/__SERVER__/g, 'IS_SERVER');
            return "import { IS_SERVER } from ':virtual/env';\n" + code;
          }
        },
      },
      nodeResolve({
        exportConditions: dev
          ? ['development', 'production', 'default']
          : ['production', 'default'],
      }),
      esbuildPlugin({
        tsconfig: 'tsconfig.build.json',
        target: 'es2021',
        platform: 'browser',
        mangleProps: !dev ? /^_/ : undefined,
        mangleCache: !dev ? MANGLE_CACHE : undefined,
        reserveProps: !dev ? /^__/ : undefined,
        define: {
          __DEV__: dev ? 'true' : 'false',
        },
      }),
      {
        name: 'target-syntax',
        transform(code, id) {
          if (/node_modules.*?\.js/.test(id)) {
            return esbuildTransform(code, {
              target: 'es2021',
              platform: 'browser',
            }).then((t) => t.code);
          }
        },
      },
      {
        name: 'rsc-directives',
        resolveId(id) {
          if (id.startsWith('maverick.js')) {
            return this.resolve('maverick.js/rsc', '', { skipSelf: true });
          }
        },
        generateBundle(_, bundle) {
          const serverChunks = new Set(),
            neutralChunks = new Set(['vidstack-icons.js']);

          for (const fileName of Object.keys(bundle)) {
            const chunk = bundle[fileName];

            if (chunk.type !== 'chunk') continue;

            if (serverChunks.has(chunk.fileName)) {
              chunk.code = `"use server"\n\n` + chunk.code;
            } else if (!neutralChunks.has(fileName)) {
              chunk.code = `"use client"\n\n` + chunk.code;
            }
          }
        },
      },
      !dev && {
        name: 'npm-artifacts',
        async buildEnd() {
          await copyStyles();
          await copyTailwind();
          await buildDefaultTheme();
          await fsExtra.copy('npm', 'dist-npm');
        },
      },
    ],
  };
}

async function copyStyles() {
  const from = path.resolve(VIDSTACK_PKG_DIR, 'styles/player'),
    to = path.resolve(DIST_NPM_DIR, 'player/styles');
  await fsExtra.copy(from, to);
}

async function copyTailwind() {
  const tailwindFilePath = path.resolve(VIDSTACK_PKG_DIR, 'npm/tailwind.cjs'),
    tailwindDTSFilePath = path.resolve(VIDSTACK_PKG_DIR, 'npm/tailwind.d.cts');
  await fsExtra.copyFile(tailwindFilePath, path.resolve(DIST_NPM_DIR, 'tailwind.cjs'));
  await fsExtra.copyFile(tailwindDTSFilePath, path.resolve(DIST_NPM_DIR, 'tailwind.d.cts'));
}

async function buildDefaultTheme() {
  // CSS merge.
  let defaultStyles = await fsExtra.readFile(
    path.resolve(DIST_NPM_DIR, 'player/styles/base.css'),
    'utf-8',
  );

  const themeDir = path.resolve(DIST_NPM_DIR, 'player/styles/default'),
    themeDirFiles = await fsExtra.readdir(themeDir, 'utf-8');

  for (const file of themeDirFiles) {
    if (file === 'theme.css' || file === 'layouts') continue;
    defaultStyles += '\n' + (await fsExtra.readFile(`${themeDir}/${file}`, 'utf-8'));
  }

  await fsExtra.writeFile(`${themeDir}/theme.css`, defaultStyles);
}

export async function buildMangleCache() {
  let mangleCache = JSON.parse(await fsExtra.readFile('mangle.json', 'utf-8'));

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
          build.onResolve({ filter }, (args) =>
            args.path === 'vidstack' ? undefined : { path: args.path, external: true },
          );
        },
      },
    ],
  });

  mangleCache = {
    ...mangleCache,
    ...result.mangleCache,
  };

  await fsExtra.writeFile('mangle.json', JSON.stringify(mangleCache, null, 2) + '\n');

  return mangleCache;
}
