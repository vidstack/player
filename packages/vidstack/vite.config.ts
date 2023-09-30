/// <reference types="vitest" />
import { defineConfig } from 'vite';

const SERVER = !!process.env.SERVER;

export default defineConfig({
  define: {
    __DEV__: 'true',
    __TEST__: 'true',
    __SERVER__: SERVER ? 'true' : 'false',
  },
  resolve: {
    alias: {
      '$test-utils': '/src/test-utils',
      'vidstack/elements': '/src/elements',
      'vidstack/player': '/src/player',
    },
  },
  optimizeDeps: {
    exclude: ['maverick.js', 'maverick.js/element', 'media-icons', 'media-captions'],
  },
  plugins: [],
  // https://vitest.dev/config
  test: {
    include: ['src/**/*.test.ts'],
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-utils/setup.ts'],
    testTimeout: 2500,
  },
});
