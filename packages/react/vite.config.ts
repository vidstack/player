import path from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const vidstackSource = path.resolve('../vidstack/src/index.ts');

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __DEV__: 'true',
    __SERVER__: 'false',
  },
  plugins: [react()],
  resolve: {
    alias: {
      vidstack: vidstackSource,
    },
  },
  optimizeDeps: {
    exclude: [
      'vidstack',
      vidstackSource,
      'maverick.js',
      'maverick.js/react',
      'media-icons',
      'media-captions',
    ],
  },
});
