import path from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

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
    },
    react(),
  ],
  optimizeDeps: {
    noDiscovery: true,
    include: ['react', 'react-dom', 'react-dom/client'],
  },
});
