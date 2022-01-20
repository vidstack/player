import { build } from 'esbuild';
import globby from 'fast-glob';
import fs from 'fs-extra';
import path from 'path';
import { minify } from 'terser';

/**
 * This script is responsible for minifying protected and private properties in the production
 * builds, which are identified by starting with an underscore `_`. We first bundle all the code
 * into a single file using ESBuild, next we populate the Terser name cache so all private
 * properties have the same identifier when bundled, and then we minify each production chunk one
 * at a time with the new seeded name cache.
 */
async function runMinification(entryPoints, outDir) {
  const outdir = path.resolve(process.cwd(), outDir);
  const seederFile = path.resolve(outdir, 'seeder.js');

  fs.writeFileSync(
    seederFile,
    entryPoints
      .map((s) => path.relative(outdir, s))
      .map((s) => `import './${s}';`)
      .join('\n')
  );

  const code = await build({
    entryPoints: [seederFile],
    logLevel: 'silent',
    platform: 'browser',
    format: 'esm',
    target: 'es2019',
    bundle: true,
    minify: false,
    write: false,
    treeShaking: false
  });

  const nameCache = {};

  const minifyOptions = {
    mangle: {
      properties: {
        regex: /^_[a-zA-Z]/,
        debug: false // Set to true to mangle to readable names
      }
    },
    module: true,
    nameCache
  };

  await minify(code.outputFiles[0].text, {
    ...minifyOptions,
    ecma: 2019
  });

  const nameCacheTable = Object.values(nameCache)[1].props;

  await Promise.all(
    entryPoints.map(async (file) => {
      const contents = (await fs.readFile(file)).toString();

      const output = await minify(contents, {
        ...minifyOptions,
        compress: {
          unsafe: true,
          passes: 2
        },
        format: {
          comments: false
        },
        ecma: 2019,
        nameCache
      });

      // Make sure we update typescript decorators as well.
      for (const key in nameCacheTable) {
        output.code = output.code.replace(
          new RegExp(`"${key.slice(1)}"`, 'g'),
          `"${nameCacheTable[key]}"`
        );
      }

      await fs.writeFile(file, output.code);
    })
  );

  fs.unlinkSync(seederFile);
}

async function main() {
  const prodEntryPoints = globby.sync('dist-prod/**/*.js', { absolute: true });
  const cdnEntryPoints = globby.sync('dist-cdn/**/*.js', { absolute: true });

  await Promise.all([
    runMinification(prodEntryPoints, 'dist-prod'),
    runMinification(cdnEntryPoints, 'dist-cdn')
  ]);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
