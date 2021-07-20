import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import esbuild from 'rollup-plugin-esbuild';
import minifyHTML from 'rollup-plugin-minify-html-literals';
import summary from 'rollup-plugin-summary';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/bundle/define.js',
  plugins: [
    minifyHTML(),
    esbuild({
      loaders: { '.js': 'ts' },
      tsconfig: 'tsconfig-build.json'
    }),
    resolve(),
    commonjs()
  ],
  output: [
    {
      format: 'esm',
      file: 'bundle/dev.js',
      sourcemap: true,
      plugins: [summary({})]
    },
    {
      format: 'esm',
      file: 'bundle/prod.js',
      sourcemap: true,
      plugins: [
        terser({
          ecma: 2019,
          module: true,
          output: { comments: false }
        }),
        summary({})
      ]
    }
  ],
  watch: {
    clearScreen: false
  }
};
