import path from 'node:path';
import { fileURLToPath } from 'node:url';

import fs from 'fs-extra';
import type { Plugin } from 'rolldown';
import { dts as rolldownDts } from 'rolldown-plugin-dts';
import { defineConfig, type UserConfig } from 'tsdown';

import { copyPkgFiles } from '../../.build/copy-pkg-files.js';
import { buildDefaultTheme, watchStyles } from '../vidstack/build/build-styles.js';
import { decorators } from '../vidstack/build/rollup-decorators';

const MODE_WATCH = process.argv.includes('-w') || process.argv.includes('--watch'),
  MODE_TYPES = process.argv.includes('--types');

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
];

if (!MODE_TYPES && MODE_WATCH) {
  watchStyles();
}

// ---------------------------------------------------------------------------
// NPM Bundles (server/dev/prod)
// ---------------------------------------------------------------------------

interface NPMBundleOptions {
  type: 'dev' | 'prod' | 'server';
}

function defineNPMBundle({ type }: NPMBundleOptions): UserConfig {
  const isProd = type === 'prod',
    isServer = type === 'server';

  const entry: Record<string, string> = {
    vidstack: 'src/index.ts',
    'player/vidstack-remotion': 'src/providers/remotion/index.ts',
    'player/vidstack-default-layout': 'src/components/layouts/default/index.ts',
    'player/vidstack-plyr-layout': 'src/components/layouts/plyr/index.ts',
    'player/vidstack-plyr-icons': 'src/components/layouts/plyr/icons.tsx',
    'player/vidstack-default-components': 'src/components/layouts/default/ui.ts',
    'player/vidstack-default-icons': 'src/components/layouts/default/icons.tsx',
  };

  if (isProd) {
    entry['vidstack-icons'] = 'src/icons.ts';
  }

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
    },
    inputOptions: {
      preserveEntrySignatures: 'allow-extension',
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
        groups: [{ name: 'vidstack-deps', test: /node_modules/ }],
      },
    },
    plugins: [
      env() as any,
      decorators() as any,
      rscDirectives() as any,
      isProd && (copyAssets() as any),
    ].filter(Boolean) as any,
  };
}

/**
 * Virtual `__SERVER__` runtime detection.
 *
 * Replaces compile-time `__SERVER__` references with a runtime check via the
 * `:virtual/env` module.
 */
function env(): Plugin {
  return {
    name: 'virtual-env',
    resolveId(id: string) {
      if (id === ':virtual/env') {
        return id;
      }
    },
    load(id: string) {
      if (id === ':virtual/env') {
        return 'export const IS_SERVER = typeof document === "undefined";';
      }
    },
    transform(code: string) {
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
    resolveId(id: string) {
      if (id.startsWith('maverick.js')) {
        return (this as any).resolve('maverick.js/rsc', '', { skipSelf: true });
      }
    },
    generateBundle(_options: any, bundle: Record<string, any>) {
      const serverChunks = new Set<string>(),
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
    async writeBundle() {
      copyPkgFiles();
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

// ---------------------------------------------------------------------------
// Types Bundle
// ---------------------------------------------------------------------------

function getTypesBundles(): UserConfig[] {
  return [
    {
      entry: {
        index: 'types/react/src/index.d.ts',
        icons: 'types/react/src/icons.d.ts',
        'player/remotion': 'types/react/src/providers/remotion/index.d.ts',
        'player/layouts/default': 'types/react/src/components/layouts/default/index.d.ts',
        'player/layouts/plyr': 'types/react/src/components/layouts/plyr/index.d.ts',
      },
      outDir: 'dist-npm',
      format: 'esm',
      dts: false,
      clean: false,
      sourcemap: false,
      fixedExtension: false,
      deps: {
        neverBundle: NPM_EXTERNAL_PACKAGES,
      },
      outputOptions: {
        entryFileNames: '[name].d.ts',
        chunkFileNames: 'types/[name].d.ts',
        minifyInternalExports: false,
        codeSplitting: {
          groups: [
            { name: 'vidstack-instances', test: /primitives\/instances/ },
            { name: 'vidstack-react', test: /react\/src/ },
            { name: 'vidstack', test: /vidstack/ },
          ],
        },
      },
      plugins: [
        rewriteVidstackImports() as any,
        ...(rolldownDts({
          dtsInput: true,
          emitDtsOnly: true,
        }) as any[]),
        resolveGlobalTypes() as any,
      ],
    },
  ];
}

/**
 * Rewrites `vidstack/...ts` imports in `.d.ts` source files to point at the
 * vidstack package's tsc-emitted declaration files. The rolldown-plugin-dts
 * internal resolver follows vidstack's `package.json#exports` (which targets
 * `./src/...ts`) and ignores plugin `resolveId` hooks, so we have to rewrite
 * the source text directly.
 */
function rewriteVidstackImports(): Plugin {
  const VIDSTACK_TYPES_DIR = path.resolve(ROOT_DIR, '../vidstack/types');
  return {
    name: 'rewrite-vidstack-imports',
    enforce: 'pre' as const,
    transform: {
      order: 'pre' as const,
      handler(code: string, id: string) {
        if (!id.endsWith('.d.ts')) return null;
        if (!code.includes('vidstack')) return null;
        const replaced = code
          .replace(/(['"])vidstack(\/[^'"\s]+?)?\.ts\1/g, (_match, quote, sub) => {
            const abs = sub
              ? path.join(VIDSTACK_TYPES_DIR, `${sub}.d.ts`)
              : path.join(VIDSTACK_TYPES_DIR, 'index.d.ts');
            return `${quote}${abs}${quote}`;
          })
          .replace(/(['"])vidstack\1/g, (_m, q) => {
            return `${q}${path.join(VIDSTACK_TYPES_DIR, 'index.d.ts')}${q}`;
          });
        if (replaced === code) return null;
        return replaced;
      },
    },
  } as any;
}

function resolveGlobalTypes(): Plugin {
  return {
    name: 'globals',
    generateBundle(_options: any, bundle: Record<string, any>) {
      const indexFile = Object.values(bundle).find((file: any) => file.fileName === 'index.d.ts'),
        globalFiles = ['dom.d.ts', 'google-cast.d.ts'],
        references = globalFiles.map((p) => `/// <reference path="./${p}" />`).join('\n');

      if (!fs.existsSync('dist-npm')) {
        fs.mkdirSync('dist-npm');
      }

      for (const file of globalFiles) {
        fs.copyFileSync(path.resolve(`../vidstack/npm/${file}`), `dist-npm/${file}`);
      }

      if (indexFile && (indexFile as any).type === 'chunk') {
        (indexFile as any).code = references + `\n\n${(indexFile as any).code}`;
      }
    },
  };
}

// ---------------------------------------------------------------------------
// Final config selection
// ---------------------------------------------------------------------------

function getConfigs(): UserConfig[] {
  if (MODE_TYPES) return getTypesBundles();
  return [
    defineNPMBundle({ type: 'server' }),
    defineNPMBundle({ type: 'dev' }),
    defineNPMBundle({ type: 'prod' }),
  ];
}

export default defineConfig(getConfigs());
