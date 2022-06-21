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
    copySSRFiles(),
  ]);
}

async function copySSRFiles() {
  const files = ['src/node/lib/ssr.js', 'src/node/lib/exec-ssr.js'];

  await Promise.all(
    await files.map(async (filePath) => {
      const destPath = path.resolve(`dist/node/${path.basename(filePath)}`);
      await fs.copyFile(filePath, destPath);
    }),
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
