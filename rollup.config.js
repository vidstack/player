import commonjs from '@rollup/plugin-commonjs';
import esbuild from 'rollup-plugin-esbuild';
import fs from 'fs-extra';
import minifyHTML from 'rollup-plugin-minify-html-literals';
import resolve from '@rollup/plugin-node-resolve';

const PROD = process.env.NODE_ENV === 'production';

const entries = ['src/index.ts'];
const definitions = fs.readdirSync('src/define');
definitions.forEach((file) => {
  entries.push(`src/define/${file}`);
});

export default {
  input: entries,
  output: {
    format: 'esm',
    dir: PROD ? 'dist-prod' : 'dist',
    sourcemap: true,
    entryFileNames(file) {
      return file.facadeModuleId.includes('src/define')
        ? `define/${file.name}.js`
        : `${file.name}.js`;
    },
    chunkFileNames(chunk) {
      return `shared/${chunk.name}.js`;
    }
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
    commonjs()
  ],
  preserveEntrySignatures: 'allow-extension',
  watch: {
    clearScreen: false
  }
};
