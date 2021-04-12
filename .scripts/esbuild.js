const { build } = require('esbuild');
const glob = require('fast-glob');

(async () => {
  const entryPoints = await glob('src/**/!(*.test).ts');
  await build({
    entryPoints,
    outdir: getCommandLineArgValue('-o'),
    tsconfig: getCommandLineArgValue('-t'),
    sourcemap: true,
    watch: isCommandLineArgPresent('-w'),
  });
})();

function isCommandLineArgPresent(argName) {
  return process.argv.includes(argName);
}

function getCommandLineArgValue(argName) {
  const argIndex = process.argv.findIndex(arg => arg === argName);
  return argIndex > 0 ? process.argv[argIndex + 1] : undefined;
}
