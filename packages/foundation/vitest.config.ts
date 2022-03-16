/// <reference types="vitest" />

import { defineConfig } from 'vite';

export default defineConfig({
  define: {
    __DEV__: 'false',
  },
  resolve: {
    alias: {
      $lib: '/src/index.ts',
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
