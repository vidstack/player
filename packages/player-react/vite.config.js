/// <reference types="vitest" />

import React from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [React()],
  // https://vitest.dev/config
  test: {
    include: ['src/**/*.test.tsx'],
    globals: true,
    testTimeout: 2500,
  },
});
