import { build } from 'esbuild';
import path from 'path';
import fs from 'fs/promises';
import { commonOptions } from '../../../.scripts/common-build.js';

async function main() {
  await Promise.all([
    await build({
      ...commonOptions({
        entry: ['src/client/index.ts'],
        externalizeDeps: true,
      }),
      bundle: true,
      outdir: 'dist/client',
    }),
    await build({
      ...commonOptions({
        entry: ['src/node/index.ts'],
        node: true,
        externalizeDeps: true,
      }),
      bundle: true,
      outdir: 'dist/node',
    }),
    copySSRFile(),
  ]);
}

async function copySSRFile() {
  const filePath = path.resolve('src/node/lib/ssr.js');
  const destPath = path.resolve('dist/node/ssr.js');
  await fs.copyFile(filePath, destPath);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
