/// <reference types="vitest" />

import { defineConfig } from 'vite';

export default defineConfig({
  define: {
    __DEV__: 'false',
  },
  resolve: {
    alias: {
      $lib: '/src',
      '$test-utils': '/tests/test-utils/index.ts',
      '@vidstack/foundation': '/node_modules/@vidstack/foundation/src/index.ts',
    },
  },
  // https://vitest.dev/config
  test: {
    include: ['tests/**/*.test.ts'],
    globals: true,
    environment: 'jsdom',
    setupFiles: ['tests/setup.ts'],
    testTimeout: 2500,
  },
});
