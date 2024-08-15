import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { nodeResolve } from '@rollup/plugin-node-resolve';
import fs from 'fs-extra';
import { defineConfig, type Plugin, type RollupOptions } from 'rollup';
import dts from 'rollup-plugin-dts';

import { copyPkgFiles } from '../../.build/copy-pkg-files.js';
import { buildDefaultTheme, watchStyles } from '../vidstack/build/build-styles.js';
import { decorators } from '../vidstack/build/rollup-decorators';
import typescript from '../vidstack/build/rollup-ts';

const MODE_WATCH = process.argv.includes('-w'),
  MODE_TYPES = process.argv.includes('--config-types');

const DIRNAME = path.dirname(fileURLToPath(import.meta.url)),
  ROOT_DIR = path.resolve(DIRNAME, '.'),
  DIST_NPM_DIR = path.resolve(ROOT_DIR, 'dist-npm');

const VIDSTACK_PKG_DIR = path.resolve(ROOT_DIR, 'node_modules/vidstack');

const NPM_EXTERNAL_PACKAGES = [
    'react',
    'react-dom',
    'media-icons',
    'media-captions',
    'hls.js',
    'dashjs',
    /^@floating-ui/,
    /^remotion/,
  ],
  NPM_BUNDLES = [defineNPMBundle({ dev: true }), defineNPMBundle({ dev: false })],
  TYPES_BUNDLES = defineTypesBundle();

if (!MODE_TYPES) {
  if (MODE_WATCH) {
    watchStyles();
  }
}

export default defineConfig(
  MODE_WATCH ? [...TYPES_BUNDLES, ...NPM_BUNDLES] : MODE_TYPES ? TYPES_BUNDLES : NPM_BUNDLES,
);

function defineTypesBundle(): RollupOptions[] {
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
        compact: false,
        minifyInternalExports: false,
        chunkFileNames: 'types/[name].d.ts',
        manualChunks(id) {
          if (id.includes('primitives/instances')) return 'vidstack-instances';
          if (id.includes('react/src')) return 'vidstack-react';
          if (id.includes('vidstack')) return 'vidstack';
        },
      },
      external: NPM_EXTERNAL_PACKAGES,
      plugins: [
        resolveVidstackTypes(),
        dts({
          respectExternal: true,
        }),
        resolveGlobalTypes(),
      ],
    },
  ];
}

function resolveVidstackTypes(): Plugin {
  return {
    name: 'resolve-vidstack-types',
    resolveId(id) {
      if (id === 'vidstack') {
        return '../vidstack/types/index.d.ts';
      }

      if (id.startsWith('vidstack')) {
        return id.replace('vidstack', '../vidstack/types').replace('.ts', '.d.ts');
      }
    },
  };
}

function resolveGlobalTypes(): Plugin {
  return {
    name: 'globals',
    generateBundle(_, bundle) {
      const indexFile = Object.values(bundle).find((file) => file.fileName === 'index.d.ts'),
        globalFiles = ['dom.d.ts', 'google-cast.d.ts'],
        references = globalFiles.map((path) => `/// <reference path="./${path}" />`).join('\n');

      if (!fs.existsSync('dist-npm')) {
        fs.mkdirSync('dist-npm');
      }

      for (const file of globalFiles) {
        fs.copyFileSync(path.resolve(`../vidstack/npm/${file}`), `dist-npm/${file}`);
      }

      if (indexFile?.type === 'chunk') {
        indexFile.code = references + `\n\n${indexFile.code}`;
      }
    },
  };
}

interface NPMBundleOptions {
  dev?: boolean;
}

function defineNPMBundle({ dev }: NPMBundleOptions): RollupOptions {
  const alias = dev ? 'dev' : 'prod';

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
      compact: false,
      minifyInternalExports: false,
      dir: `dist-npm/${alias}`,
      chunkFileNames: `chunks/vidstack-[hash].js`,
      manualChunks(id) {
        if (id.includes('node_modules')) return 'vidstack-deps';
      },
    },
    plugins: [
      env(),
      nodeResolve({
        exportConditions: dev
          ? ['development', 'production', 'default']
          : ['production', 'default'],
      }),
      decorators(),
      typescript({
        loader: 'tsx',
        define: {
          __DEV__: dev ? 'true' : 'false',
        },
      }),
      rscDirectives(),
      !dev && copyAssets(),
    ],
  };
}

function env(): Plugin {
  return {
    name: 'virtual-env',
    resolveId(id) {
      if (id === ':virtual/env') {
        return id;
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
  };
}

function rscDirectives(): Plugin {
  return {
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
  };
}

function copyAssets(): Plugin {
  return {
    name: 'copy-assets',
    async buildEnd() {
      await copyPkgFiles();
      await copyStyles();
      await copyTailwind();
      await buildDefaultTheme();
      await fs.copy('npm', 'dist-npm');
    },
  };
}

async function copyStyles() {
  const from = path.resolve(VIDSTACK_PKG_DIR, 'styles/player'),
    to = path.resolve(DIST_NPM_DIR, 'player/styles');
  await fs.copy(from, to);
}

async function copyTailwind() {
  const tailwindFilePath = path.resolve(VIDSTACK_PKG_DIR, 'npm/tailwind.cjs'),
    tailwindDTSFilePath = path.resolve(VIDSTACK_PKG_DIR, 'npm/tailwind.d.cts');
  await fs.copyFile(tailwindFilePath, path.resolve(DIST_NPM_DIR, 'tailwind.cjs'));
  await fs.copyFile(tailwindDTSFilePath, path.resolve(DIST_NPM_DIR, 'tailwind.d.cts'));
}
