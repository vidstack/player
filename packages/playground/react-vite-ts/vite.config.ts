import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { replaceCodePlugin } from 'vite-plugin-replace';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    replaceCodePlugin({
      replacements: [
        {
          from: /__DEV__/g,
          to: 'true',
        },
        {
          from: /__SERVER__/g,
          to: 'true',
        },
      ],
    }),
    react(),
  ],
  server: {
    watch: {
      ignored: ['!**/node_modules/vidstack/**', '!**/node_modules/@vidstack/**'],
    },
  },
  optimizeDeps: {
    exclude: ['vidstack', '@vidstack/react'],
  },
});
