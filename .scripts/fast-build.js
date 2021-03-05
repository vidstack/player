const { build } = require('esbuild');
const glob = require('fast-glob');

const shouldWatch = process.argv.includes('-w');

(async () => {
  let entryPoints = await glob('src/**/!(*.test).ts');
  await build({
    entryPoints,
    outdir: '.',
    tsconfig: 'tsconfig-build.json',
    sourcemap: true,
    watch: shouldWatch,
  });
})();
