import { defineConfig, type Options } from 'tsup';

interface BundleOptions {
  dev: boolean;
  server: boolean;
}

function dist({ dev, server }: BundleOptions): Options {
  return {
    entry: {
      [server ? 'server' : dev ? 'dev' : 'prod']: 'src/index.ts',
    },
    format: 'esm',
    tsconfig: 'tsconfig.build.json',
    target: server ? 'node16' : 'esnext',
    platform: server ? 'node' : 'browser',
    bundle: true,
    clean: false,
    outDir: 'dist',
    define: {
      __DEV__: dev ? 'true' : 'false',
      __SERVER__: server ? 'true' : 'false',
    },
  };
}

export default defineConfig([
  // dev
  dist({ dev: true, server: false }),
  // prod
  dist({ dev: false, server: false }),
  // server
  dist({ dev: false, server: true }),
]);
