import { build } from 'esbuild';
import { commonOptions } from '../../../.scripts/common-build.js';

async function main() {
  await build({
    ...commonOptions({ entry: ['src/index.ts'], externalizeDeps: true }),
    bundle: true,
    outdir: 'dist',
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
