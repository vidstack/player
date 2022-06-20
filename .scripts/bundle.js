import { execa } from 'execa';
import chokidar from 'chokidar';
import minimist from 'minimist';
import fs from 'fs';
import { globby } from 'globby';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

const __cwd = process.cwd();

const args = minimist(process.argv.slice(2));

const pkgPath = path.resolve(__cwd, 'package.json');
const pkg = JSON.parse(await readFile(pkgPath, 'utf-8'));

let cleanedDist = false;

async function main() {
  if (!args.w || !cleanedDist) {
    await execa('rimraf', ['dist']);
    cleanedDist = true;
  }

  if (pkg.scripts['pre:bundle']) {
    await execa('pnpm', ['run', 'pre:bundle'], { stdio: 'inherit' });
  }

  await execa('node', ['./.scripts/bundle.js'], { stdio: 'inherit' });

  if (pkg.scripts['post:bundle']) {
    await execa('pnpm', ['run', 'post:bundle'], { stdio: 'inherit' });
  }

  // Mark side effects.
  if (fs.existsSync('dist/dev/define')) {
    const files = await globby('dist/{dev,prod}/define/vds-*.js');
    const chunkRE = /chunk\..*?\.js/;
    const sideEffectChunks = [];

    await Promise.all(
      files.map(async (file) => {
        const dev = file.startsWith('dist/dev');
        const content = await readFile(file, 'utf8');
        const chunkName = content.match(chunkRE)?.[0];
        if (chunkName) {
          const chunkPath = `./dist/${dev ? 'dev' : 'prod'}/chunks/${chunkName}`;
          sideEffectChunks.push(chunkPath);
        }
      }),
    );

    if (sideEffectChunks.length > 0) {
      pkg.sideEffects = [
        ...pkg.sideEffects.filter((file) => !file.includes('chunks')),
        ...sideEffectChunks.sort(),
      ];

      await writeFile(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
    }
  }
}

let running = false;
const onChange = async () => {
  if (running) return;
  running = true;
  await main();
  running = false;
};

onChange();

if (args.w) {
  chokidar
    .watch(
      [
        'src/**/*.ts',
        pkg.scripts.components && 'node_modules/@vidstack/player/elements.json',
      ].filter(Boolean),
    )
    .on('add', onChange)
    .on('change', onChange)
    .on('unlink', onChange);
}
