const { build } = require('esbuild');
const glob = require('fast-glob');

const shouldWatch = process.argv.includes('-w');
const isStorybook = process.argv.includes('--storybook');

(async () => {
  const entryPoints = await glob('src/**/!(*.test).ts');
  await build({
    entryPoints,
    outdir: isStorybook ? 'storybook-build' : '.',
    tsconfig: isStorybook ? 'tsconfig-storybook.json' : 'tsconfig-build.json',
    sourcemap: true,
    watch: shouldWatch,
  });
})();
