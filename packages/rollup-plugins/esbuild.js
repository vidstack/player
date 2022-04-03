import { createFilter } from '@rollup/pluginutils';
import { transform } from 'esbuild';
import { existsSync, statSync } from 'fs';
import { dirname, join, resolve } from 'path';

/**
 * @param {import('esbuild').TransformOptions} options
 * @returns {import('rollup').Plugin}
 */
export function esbuild(options) {
  const filter = createFilter(/\.ts($|\/)/);

  return {
    name: 'esbuild-plugin',
    async resolveId(id, importer) {
      if (importer && id[0] === '.') {
        const resolved = resolve(dirname(importer), id);
        return existsSync(resolved) && statSync(resolved).isDirectory()
          ? join(resolved, `index.ts`)
          : `${resolved.replace(/\.js$/, '')}.ts`;
      }

      return null;
    },

    transform(code, id) {
      if (!filter(id)) return null;
      return transform(code, {
        ...options,
        loader: 'ts',
        sourcemap: true,
        logLevel: 'warning',
        sourcefile: id,
      });
    },
  };
}
