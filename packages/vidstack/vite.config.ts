/// <reference types="vitest" />

import { transform } from 'esbuild';
import { defineConfig } from 'vite';

const SERVER = !!process.env.SERVER;

export default defineConfig({
  define: {
    __DEV__: 'true',
    __TEST__: 'true',
    __SERVER__: SERVER ? 'true' : 'false',
    __CDN__: 'true',
  },
  build: {
    target: 'es2019',
  },
  publicDir: 'sandbox/public',
  resolve: {
    alias: {
      '$test-utils': '/src/test-utils',
      'vidstack/elements': '/src/elements',
      'vidstack/player': '/src/player',
    },
  },
  optimizeDeps: {
    noDiscovery: true,
    include: [],
  },
  // https://vitest.dev/config
  test: {
    include: ['src/**/*.test.ts'],
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-utils/setup.ts'],
    testTimeout: 2500,
  },
  plugins: [legacyPlugin()],
});

function legacyPlugin() {
  return {
    name: 'legacy',
    enforce: 'pre',
    async transform(code, id) {
      if (/\.(j|t)s/.test(id)) {
        return (
          await transform(code, {
            loader: 'ts',
            target: 'es2019',
            tsconfigRaw: {
              compilerOptions: {
                experimentalDecorators: true,
              },
            },
          })
        ).code;
      }
    },
  };
}
