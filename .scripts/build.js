import path from 'path';
import minimist from 'minimist';
import { globbySync } from 'globby';
import { build } from 'esbuild';
import kleur from 'kleur';

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

const IS_NODE = args.platform === 'node';

const NODE_SHIMS = IS_NODE ? [args.requireshim && requireShim()].filter(Boolean).join('\n') : '';

async function main() {
  const entryPoints = (args.entry.includes(',') ? args.entry.split(',') : [args.entry])
    .map((glob) => globbySync(glob))
    .flat();

  const outdir = path.resolve(process.cwd(), args.outdir);

  await build({
    entryPoints,
    outdir,
    outbase: args.outbase ?? 'src',
    logLevel: args.logLevel ?? 'warning',
    platform: args.platform ?? 'browser',
    format: 'esm',
    target: 'es2020',
    watch: args.watch || args.w,
    splitting: IS_NODE || args.nosplit ? false : true,
    chunkNames: 'chunks/[name].[hash]',
    banner: { js: NODE_SHIMS },
    minify: args.minify,
    mangleProps: args.mangle ? /^_/ : undefined,
    reserveProps: args.mangle ? /^__/ : undefined,
    legalComments: 'none',
    sourcemap: args.sourcemap,
    treeShaking: true,
    metafile: args.bundle && !args.watch && !args.w,
    incremental: args.watch || args.w,
    define: { __DEV__: args.prod ? 'false' : 'true', __NODE__: IS_NODE ? 'true' : 'false' },
    bundle: args.bundle,
    external: args.bundle ? [...(args.external?.split(',') ?? [])] : undefined,
  });
}

function requireShim() {
  return [
    "import __path from 'path';",
    "import { fileURLToPath as __fileURLToPath } from 'url';",
    "import { createRequire as __createRequire } from 'module';",
    'const require = __createRequire(import.meta.url);',
    'var __require = function(x) { return require(x); };',
    '__require.__proto__.resolve = require.resolve;',
    'const __filename = __fileURLToPath(import.meta.url);',
    'const __dirname = __path.dirname(__filename);',
  ].join('\n');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
