import path from 'path';

import minimist from 'minimist';
import { build } from 'esbuild';
import kleur from 'kleur';
import { commonOptions } from './common-build.js';

const args = minimist(process.argv.slice(2));

if (args.prod) {
  process.env.NODE_ENV = 'production';
}

if (!args.entry) {
  console.error(kleur.red(`\n\n🚨 Missing entry argument \`--entry\`\n\n`));
}

if (!args.outdir) {
  console.error(kleur.red(`\n\n🚨 Missing outdir argument \`--outdir\`\n\n`));
}

async function main() {
  const entry = args.entry.includes(',') ? args.entry.split(',') : [args.entry];
  const outdir = path.resolve(process.cwd(), args.outdir);
  const watch = args.watch || args.w;

  await build({
    ...commonOptions({
      entry,
      dev: !args.prod,
      node: args.platform === 'node',
      external: args.external.split(','),
      externalizeDeps: args.externaldeps,
    }),
    outdir,
    watch,
    incremental: watch,
    bundle: args.bundle,
    outbase: args.outbase ?? 'src',
    sourcemap: args.sourcemap,
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
