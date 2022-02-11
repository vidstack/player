import path from 'path';
import minimist from 'minimist';
import globby from 'fast-glob';
import { build } from 'esbuild';
import kleur from 'kleur';
import { gzipSizeFromFileSync } from 'gzip-size';

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

  let result = await build({
    entryPoints,
    outdir,
    outbase: 'src',
    logLevel: 'warning',
    platform: 'browser',
    format: 'esm',
    target: 'es2019',
    watch: args.watch || args.w,
    splitting: args.nosplit ? false : true,
    chunkNames: 'chunks/[name].[hash]',
    minify: args.minify ?? args.prod,
    mangleProps: args.prod ? /^_/ : undefined,
    reserveProps: /^__/,
    legalComments: 'none',
    sourcemap: true,
    treeShaking: true,
    metafile: args.bundle && !args.watch && !args.w,
    incremental: args.watch || args.w,
    define: { __DEV__: args.prod ? 'false' : 'true' },
    bundle: args.bundle,
    external: args.bundle ? [...(args.external?.split(',') ?? [])] : undefined
  });

  if (args.bundle) {
    console.log(kleur.bold(kleur.red('*** SRC ***\n')));

    for (const fileName of Object.keys(result.metafile.outputs)) {
      if (fileName.includes('define/') && !fileName.endsWith('.js.map')) {
        const validateInput = (input) => !/node_modules/.test(input);
        logFileStats(fileName, result.metafile, validateInput);
      }
    }

    console.log(kleur.bold(kleur.red('\n*** NODE_MODULES ***\n')));

    const nodeModuleSize = {};

    for (const fileName of Object.keys(result.metafile.inputs)) {
      if (fileName.startsWith('node_modules')) {
        const id = fileName.match(/node_modules\/(.*?)\//)?.[1];
        const bytes = result.metafile.inputs[fileName].bytes;

        const prevBytes = nodeModuleSize[id]?.bytes ?? 0;
        const prevGzipBytes = nodeModuleSize[id]?.gzipBytes ?? 0;

        nodeModuleSize[id] = {
          bytes: prevBytes + bytes,
          gzipBytes:
            prevGzipBytes +
            gzipSizeFromFileSync(path.resolve(process.cwd(), fileName))
        };
      }
    }

    for (const [moduleId, size] of Object.entries(nodeModuleSize)) {
      const fileNameText = kleur.cyan(moduleId);
      const color = getBytesColor(size.gzipBytes);
      const bytesText = kleur.dim(`(${formatBytes(size.bytes)})`);
      const gzipBytesText = kleur.bold(formatBytes(size.gzipBytes));
      console.log(
        `- ${fileNameText}: ${kleur[color](gzipBytesText)} ${bytesText}`
      );
    }

    console.log();
  }
}

function getBytesColor(bytes) {
  return !args.prod
    ? 'dim'
    : bytes > 20000
    ? 'red'
    : bytes > 10000
    ? 'yellow'
    : 'white';
}

function logFileStats(fileName, metafile, validateInput) {
  const bytes = calculateSize(fileName, metafile, false, validateInput);
  const gzipBytes = calculateSize(fileName, metafile, true, validateInput);
  const color = getBytesColor(gzipBytes);
  const fileNameText = kleur.cyan(fileName.replace(/dist.*?\/define\//, ''));
  const bytesText = kleur.dim(`(${formatBytes(bytes)})`);
  const gzipBytesText = kleur.bold(kleur[color](formatBytes(gzipBytes)));

  console.log(`- ${fileNameText}: ${gzipBytesText} ${bytesText}`);
}

function calculateSize(
  fileName,
  metafile,
  gzipped = false,
  validateInput,
  seen = new Set()
) {
  if (seen.has(fileName)) return 0;
  seen.add(fileName);

  const metadata = metafile.outputs[fileName];
  const isValid = Object.keys(metadata.inputs).every(validateInput);

  let bytes = isValid
    ? gzipped
      ? gzipSizeFromFileSync(path.resolve(process.cwd(), fileName))
      : metadata.bytes
    : 0;

  for (const _import of metadata.imports) {
    bytes += calculateSize(
      _import.path,
      metafile,
      gzipped,
      validateInput,
      seen
    );
  }

  return bytes;
}

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
