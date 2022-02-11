import esbuild from 'rollup-plugin-esbuild';
import fs from 'fs-extra';
import minifyHTML from 'rollup-plugin-minify-html-literals';
import resolve from '@rollup/plugin-node-resolve';
import renameNodeModules from 'rollup-plugin-rename-node-modules';

const PROD = process.env.NODE_ENV === 'production';
const CDN = !!process.env.CDN;

const entries = ['src/index.ts'];
const definitions = fs.readdirSync('src/define');
definitions.forEach((file) => {
  if (!file.startsWith('test')) {
    entries.push(`src/define/${file}`);
  }
});

export default {
  input: entries,
  external: CDN ? ['hls.js'] : (id) => /node_modules\/(lit|hls)/.test(id),
  output: {
    format: 'esm',
    dir: CDN ? 'dist-cdn' : PROD ? 'dist-prod' : 'dist',
    sourcemap: true,
    preserveModules: true,
    preserveModulesRoot: 'src'
  },
  plugins: [
    esbuild({
      target: 'es2019',
      minify: PROD,
      define: {
        __DEV__: PROD ? 'false' : 'true'
      },
      tsconfig: 'tsconfig-build.json'
    }),
    PROD && minifyHTML(),
    resolve({
      exportConditions: [PROD ? 'production' : 'development']
    }),
    renameNodeModules('lib')
  ],
  treeshake: true,
  preserveEntrySignatures: 'allow-extension',
  watch: {
    clearScreen: false
  }
};
