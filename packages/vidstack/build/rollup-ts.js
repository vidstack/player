import path from 'node:path';

import { transform as esbuild } from 'esbuild';
import fs from 'fs-extra';

/**
 *
 * @param {import('esbuild').TransformOptions} options
 * @returns {import('rollup').Plugin}
 */
export function typescript(options) {
  const include = /\.[jt]sx?$/;
  return {
    name: 'typescript',
    resolveId(id, importer) {
      if (importer && id[0] === '.') {
        const resolvedPath = path.resolve(importer ? path.dirname(importer) : process.cwd(), id),
          filePath = resolveFile(resolvedPath);

        if (filePath) {
          return filePath;
        }

        if (fs.existsSync(resolvedPath) && fs.statSync(resolvedPath).isDirectory()) {
          return resolveFile(resolvedPath, true);
        }
      }
    },
    transform(code, id) {
      if (!include.test(id)) return;
      return esbuild(code, {
        target: 'esnext',
        loader: 'ts',
        sourcemap: true,
        ...options,
      });
    },
  };
}

const tsFileExtensions = ['ts', 'tsx'];
function resolveFile(file, index = false) {
  for (const ext of tsFileExtensions) {
    const filePath = index ? path.join(file, `index.${ext}`) : `${file}.${ext}`;
    if (fs.existsSync(filePath)) return filePath;
  }
}

export default typescript;
