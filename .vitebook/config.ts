import { defineConfig, clientPlugin } from '@vitebook/client/node';
import {
  DefaultThemeConfig,
  defaultThemePlugin
} from '@vitebook/theme-default/node';

export default defineConfig<DefaultThemeConfig>({
  include: ['src/**/*.story.html', 'src/**/*.story.svelte'],
  plugins: [
    clientPlugin({
      appFile: 'App.svelte',
      svelte: {
        extensions: ['html', 'svelte']
      }
    }),
    defaultThemePlugin()
  ],
  site: {
    title: 'Vidstack',
    description:
      'Collection of headless web components that make integrating media on the a web a breeze.',
    theme: {
      remoteGitRepo: {
        url: 'vidstack/elements'
      }
    }
  }
});
