import { nodeResolve } from '@rollup/plugin-node-resolve';
import { esbuild, litNode } from '@vidstack/rollup-plugins';

const INPUT = ['src/index.ts'];
const EXTERNAL = [/node_modules\/@?lit/];

const PLUGINS = ({ dev = false } = {}) => [
  nodeResolve(),
  esbuild({ define: { __DEV__: 'false' } }),
];

/** @type {import('rollup').RollupOptions} */
const DEV = {
  input: INPUT,
  output: {
    file: 'dist/index.js',
    format: 'esm',
  },
  external: EXTERNAL,
  plugins: PLUGINS({ dev: true }),
};

/** @type {import('rollup').RollupOptions} */
const PROD = {
  input: INPUT,
  output: {
    file: 'dist-prod/index.js',
    format: 'esm',
  },
  external: EXTERNAL,
  plugins: PLUGINS(),
};

/** @type {import('rollup').RollupOptions} */
const NODE = {
  input: INPUT,
  output: {
    file: 'dist-node/index.js',
    format: 'esm',
  },
  plugins: [...PLUGINS(), litNode()],
};

export default [DEV, PROD, NODE];
