import path from 'path';
import minimist from 'minimist';
import globby from 'fast-glob';
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
  const entryPoints = (
    args.entry.includes(',') ? args.entry.split(',') : [args.entry]
  )
    .map((glob) => globby.sync(glob))
    .flat();

  const outdir = path.resolve(process.cwd(), args.outdir);

  await build({
    entryPoints,
    outdir,
    platform: 'browser',
    format: 'esm',
    target: 'es2019',
    watch: args.watch || args.w,
    bundle: true,
    splitting: true,
    minify: args.minify,
    minifyIdentifiers: args.minify,
    minifyWhitespace: args.minify,
    minifySyntax: args.minify,
    legalComments: 'none',
    sourcemap: true,
    treeShaking: true,
    incremental: args.incremental,
    logLevel: 'info',
    define: { __DEV__: args.prod ? 'false' : 'true' },
    external: [...(args.external?.split(',') ?? [])]
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
