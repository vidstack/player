import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig, clientPlugin } from '@vitebook/client/node';
import {
  DefaultThemeConfig,
  defaultThemePlugin
} from '@vitebook/theme-default/node';

export default defineConfig<DefaultThemeConfig>({
  include: ['src/**/*.story.html', 'src/**/*.story.svelte'],
  vite: {
    define: { __DEV__: 'true' },
    optimizeDeps: {
      include: ['lit', 'lit/decorators.js']
    }
  },
  plugins: [
    clientPlugin({ appFile: 'App.svelte' }),
    defaultThemePlugin(),
    svelte({
      compilerOptions: { hydratable: true },
      extensions: ['.html', '.svelte'],
      experimental: { useVitePreprocess: true }
    })
  ],
  site: {
    title: 'Vidstack Player',
    description: 'Video player built with headless web components.',
    theme: {
      remoteGitRepo: {
        url: 'vidstack/player'
      }
    }
  }
});
