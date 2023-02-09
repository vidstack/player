import { defineConfig, type Options } from 'tsup';

const BROWSER_CONFIG = dist({ server: false }),
  SERVER_CONFIG = dist({ server: true });

interface BundleOptions {
  server: boolean;
}

function dist({ server }: BundleOptions): Options {
  return {
    entry: { index: `src/index.ts` },
    format: server ? ['esm', 'cjs'] : 'esm',
    external: ['maverick.js'],
    clean: false,
    treeshake: true,
    bundle: true,
    tsconfig: 'tsconfig.build.json',
    target: server ? 'node16' : 'esnext',
    platform: server ? 'node' : 'browser',
    outDir: server ? 'dist/server' : 'dist/browser',
    esbuildOptions(opts) {
      opts.chunkNames = 'chunks/[name]-[hash]';
    },
  };
}

export default defineConfig([BROWSER_CONFIG, SERVER_CONFIG]);
