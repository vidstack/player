import { cemDocsPlugin } from './cem/cem-docs-plugin.mjs';

export default {
  globs: ['src/{core,providers,ui,skins}/**/*.ts'],
  tsConfigName: 'tsconfig.json',
  plugins: [cemDocsPlugin()],
};
