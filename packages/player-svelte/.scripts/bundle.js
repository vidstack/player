import { build } from 'esbuild';
import { commonOptions } from '../../../.scripts/common-build.js';

async function main() {
  await build({
    ...commonOptions({
      entry: ['src/client/index.ts'],
      externalizeDeps: true,
    }),
    bundle: true,
    outdir: 'dist/client',
  });
  await build({
    ...commonOptions({
      entry: ['src/node/index.ts'],
      externalizeDeps: true,
      node: true,
    }),
    bundle: true,
    outdir: 'dist/node',
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
