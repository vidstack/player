/// <reference types="vitest" />
import { defineConfig } from 'vite';

// https://vitejs.dev/config
export default defineConfig({
  define: {
    __DEV__: 'false'
  },
  // https://vitest.dev/config
  test: {
    include: ['src/**/*.test.ts'],
    global: true,
    environment: 'jsdom'
  }
});
