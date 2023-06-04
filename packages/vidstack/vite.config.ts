/// <reference types="vitest" />
import { vite as maverick } from '@maverick-js/compiler';
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
    exclude: ['maverick.js', 'maverick.js/element'],
  },
  plugins: [
    maverick({
      include: ['src/**/*.{jsx,tsx}'],
      hydratable: (id) => !id.includes('time-slider/chapters') && !id.includes('skins/community'),
      diffArrays: false,
    }),
  ],
  // https://vitest.dev/config
  test: {
    include: ['src/**/*.test.ts'],
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-utils/setup.ts'],
    testTimeout: 2500,
  },
});
