/// <reference types="vitest" />

import { defineConfig } from 'vite';

const IS_TEST_ENV = process.env.NODE_ENV === 'test';

export default defineConfig({
  define: {
    __DEV__: !IS_TEST_ENV,
  },
  resolve: {
    alias: {
      $define: '/src/define',
      '$test-utils': '/src/test-utils/index.ts',
      '@vidstack/foundation': '/node_modules/@vidstack/foundation/src/index.ts',
    },
  },
  // https://vitest.dev/config
  test: {
    include: ['src/**/*.test.ts'],
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-utils/setup.ts'],
    testTimeout: 2500,
  },
});
