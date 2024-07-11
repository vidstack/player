import path from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const vidstackSource = path.resolve('../vidstack/src/index.ts'),
  vidstackExports = path.resolve('../vidstack/src/exports');

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __DEV__: 'true',
    __SERVER__: 'false',
  },
  plugins: [
    {
      name: 'ts-paths',
      enforce: 'pre',
      resolveId(id) {
        if (id === 'vidstack') {
          return vidstackSource;
        } else if (id.startsWith('vidstack/exports')) {
          return id.replace('vidstack/exports', vidstackExports) + '.ts';
        }
      },
    },
    react(),
  ],
  optimizeDeps: {
    noDiscovery: true,
    include: ['react', 'react-dom', 'react-dom/client'],
  },
});
