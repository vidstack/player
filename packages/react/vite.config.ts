import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __DEV__: 'true',
  },
  plugins: [react()],
  optimizeDeps: {
    exclude: [
      'vidstack',
      'vidstack/local',
      'maverick.js',
      'maverick.js/react',
      'media-icons',
      'media-captions',
    ],
  },
});
