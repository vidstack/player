import { defineConfig, type Options } from 'tsup';

interface BundleOptions {
  server: boolean;
}

function dist({ server }: BundleOptions): Options {
  return {
    entry: {
      [server ? 'server' : 'index']: 'src/index.ts',
    },
    format: server ? ['esm', 'cjs'] : 'esm',
    tsconfig: 'tsconfig.build.json',
    target: server ? 'node16' : 'esnext',
    platform: server ? 'node' : 'browser',
    clean: false,
    outDir: 'dist',
    define: {
      __SERVER__: server ? 'true' : 'false',
    },
  };
}

export default defineConfig([dist({ server: false }), dist({ server: true })]);
