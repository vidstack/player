// FILE: /Users/v.rahim.alwer/Desktop/Projects/vds-elements/.vitebook/config.ts

import __vitebook__path from 'path';
import { fileURLToPath as __vitebook__fileURLToPath } from 'url';
import { createRequire as __vitebook__createRequire } from 'module';
const require = __vitebook__createRequire(import.meta.url);
var __require = function (x) {
  return require(x);
};
__require.__proto__.resolve = require.resolve;
const __filename = __vitebook__fileURLToPath(import.meta.url);
const __dirname = __vitebook__path.dirname(__filename);

// .vitebook/config.ts
import { defineConfig, clientPlugin } from '@vitebook/client/node';
import { defaultThemePlugin } from '@vitebook/theme-default/node';
var config_default = defineConfig({
  include: ['src/**/*.story.html', 'src/**/*.story.svelte'],
  plugins: [
    clientPlugin({
      appFile: 'App.svelte'
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
export { config_default as default };
