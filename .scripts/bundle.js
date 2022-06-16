import { execa } from 'execa';
import chokidar from 'chokidar';
import minimist from 'minimist';
import { readFile } from 'fs/promises';
import path from 'path';

const __cwd = process.cwd();

const args = minimist(process.argv.slice(2));

const pkgPath = path.resolve(__cwd, 'package.json');
const pkg = JSON.parse(await readFile(pkgPath, 'utf-8'));

async function main() {
  if (pkg.scripts['pre:bundle']) {
    await execa('pnpm', ['run', 'pre:bundle'], { stdio: 'inherit' });
  }

  await execa('node', ['./.scripts/bundle.js'], { stdio: 'inherit' });

  if (pkg.scripts['post:bundle']) {
    await execa('pnpm', ['run', 'post:bundle'], { stdio: 'inherit' });
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
