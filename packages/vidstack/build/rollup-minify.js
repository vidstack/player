import { transform as esbuild } from 'esbuild';

/** @returns {import('rollup').Plugin} */
export function minify() {
  return {
    name: 'minify',
    renderChunk(code) {
      return esbuild(code, {
        target: 'esnext',
        format: 'esm',
        platform: 'browser',
        minify: true,
        loader: 'js',
        legalComments: 'none',
      });
    },
  };
}
