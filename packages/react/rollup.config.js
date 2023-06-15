import { defineConfig } from 'rollup';
import esbuildPlugin from 'rollup-plugin-esbuild';

export default defineConfig([
  // server
  define({ dev: true, server: true }),
  // dev
  define({ dev: true }),
  // prod
  define(),
]);

/**
 * @typedef {{
 * dev?: boolean;
 * server?: boolean;
 * }} BundleOptions
 */

/**
 * @param {BundleOptions}
 * @returns {import('rollup').RollupOptions}
 */
function define({ dev, server } = {}) {
  const alias = server ? 'server' : dev ? 'dev' : 'prod';
  return {
    input: {
      index: 'src/index.ts',
      icons: 'src/icons.ts',
    },
    treeshake: true,
    preserveEntrySignatures: 'strict',
    external: [/maverick/, 'vidstack', 'react', 'media-icons'],
    output: {
      format: 'esm',
      dir: `dist/${alias}`,
    },
    plugins: [
      esbuildPlugin({
        tsconfig: 'tsconfig.build.json',
        target: server ? 'node18' : 'esnext',
        platform: server ? 'node' : 'browser',
        define: {
          __DEV__: dev ? 'true' : 'false',
          __SERVER__: server ? 'true' : 'false',
        },
      }),
    ],
  };
}
