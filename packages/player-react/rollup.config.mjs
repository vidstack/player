import { nodeResolve } from '@rollup/plugin-node-resolve';
import { esbuild } from '@vidstack/rollup';
import { globbySync } from 'globby';

/** @type {import('rollup').RollupOptions} */
const options = {
  input: ['src/index.ts', ...globbySync('src/_components/*.ts')],
  output: {
    dir: 'dist',
    format: 'esm',
    entryFileNames(chunk) {
      if (/_components/.test(chunk.facadeModuleId ?? '')) {
        return `components/${chunk.name}.js`;
      }

      return `${chunk.name}.js`;
    },
  },
  external: ['react'],
  plugins: [nodeResolve(), esbuild({})],
};

export default options;
