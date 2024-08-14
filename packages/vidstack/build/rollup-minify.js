import { transform as esbuild } from 'esbuild';

/** @returns {import('rollup').Plugin} */
export function minify() {
  const opts = /** @type {import('esbuild').TransformOptions} */ ({
    target: 'esnext',
    format: 'esm',
    platform: 'browser',
    minify: true,
    loader: 'js',
    legalComments: 'none',
  });

  return {
    name: 'minify',
    renderChunk(code) {
      return esbuild(code, opts);
    },
  };
}
