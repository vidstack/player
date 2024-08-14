import path from 'node:path';

import { transform as esbuild } from 'esbuild';
import fs from 'fs-extra';
import { getTsconfig } from 'get-tsconfig';

const configName = 'tsconfig.build.json',
  configRaw = getTsconfig(process.cwd(), configName, new Map())?.config;

/**
 *
 * @param {import('esbuild').TransformOptions} options
 * @returns {import('rollup').Plugin}
 */
export function typescript(options) {
  const cwd = process.cwd(),
    include = /\.[jt]sx?$/,
    opts = /** @type {import('esbuild').TransformOptions} */ ({
      target: 'esnext',
      loader: 'ts',
      sourcemap: true,
      tsconfigRaw: configRaw,
      ...options,
    });

  return {
    name: 'typescript',
    resolveId(id, importer) {
      if (importer && id[0] === '.') {
        const resolvedPath = path.resolve(importer ? path.dirname(importer) : cwd, id),
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
      return esbuild(code, opts);
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
