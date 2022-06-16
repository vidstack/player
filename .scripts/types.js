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
  if (pkg.scripts['pre:types']) {
    await execa('pnpm', ['run', 'pre:types'], { stdio: 'inherit' });
  }

  await execa('tsc', ['-p', 'tsconfig.json', '--pretty'], { stdio: 'inherit' });

  if (pkg.scripts['pre:types:extract']) {
    await execa('pnpm', ['run', 'pre:types:extract'], { stdio: 'inherit' });
  }

  await execa('api-extractor', ['run', '-c', 'types.json'], { stdio: 'inherit' });

  if (pkg.scripts['post:types:extract']) {
    await execa('pnpm', ['run', 'post:types:extract'], { stdio: 'inherit' });
  }

  await execa('rimraf', ['dist/**/*.d.ts'], { stdio: 'inherit' });

  if (pkg.scripts['post:types']) {
    await execa('pnpm', ['run', 'post:types'], { stdio: 'inherit' });
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
    .watch(['src/**/*.ts', ...(args.glob?.split(',') ?? [])])
    .on('add', onChange)
    .on('change', onChange)
    .on('unlink', onChange);
}
