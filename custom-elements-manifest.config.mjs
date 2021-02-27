import { cemDocsPlugin } from './cem/cem-docs-plugin.mjs';

export default {
  globs: ['src/{core,providers,ui}/**/*.ts'],
  tsTarget: 99, // ESNext
  plugins: [cemDocsPlugin()],
};
