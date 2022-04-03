import path from 'path';
import minimist from 'minimist';
import { globbySync } from 'globby';
import { build } from 'esbuild';
import kleur from 'kleur';

const args = minimist(process.argv.slice(2));

if (!args.entry) {
  console.error(kleur.red(`\n\n🚨 Missing entry argument \`--entry\`\n\n`));
}

if (!args.outdir) {
  console.error(kleur.red(`\n\n🚨 Missing outdir argument \`--outdir\`\n\n`));
}

async function main() {
  const entryPoints = (args.entry.includes(',') ? args.entry.split(',') : [args.entry])
    .map((glob) => globbySync(glob))
    .flat();

  const outdir = path.resolve(process.cwd(), args.outdir);

  await build({
    entryPoints,
    outdir,
    allowOverwrite: true,
    outbase: args.outbase,
    logLevel: args.logLevel ?? 'warning',
    platform: args.platform ?? 'browser',
    format: 'esm',
    target: 'esnext',
    watch: args.watch || args.w,
    bundle: false,
    minify: true,
    mangleProps: args.mangle ?? /^_/,
    reserveProps: args.mangle ?? /^__/,
    legalComments: 'none',
    sourcemap: args.sourcemap,
    treeShaking: true,
    incremental: args.watch || args.w,
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
