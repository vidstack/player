import minimist from 'minimist';
import fs from 'fs-extra';
import { globbySync } from 'globby';
import path from 'path';
import chokidar from 'chokidar';

const args = minimist(process.argv.slice(2));

const watch = args.watch || args.w;

const targetDir = path.resolve(process.cwd(), 'types/define');
const destDir = path.resolve(process.cwd(), 'define');

if (!fs.existsSync(targetDir)) {
  fs.mkdir(targetDir, { recursive: true });
}

if (!fs.existsSync(destDir)) {
  fs.mkdir(destDir);
}

function resolveDest(file) {
  return path.resolve(destDir, path.relative(targetDir, file));
}

function copy(file) {
  const dest = resolveDest(file);

  if (dest.endsWith('.map')) {
    // Copy over types sourcemap and fix import paths.
    fs.writeFile(dest, fs.readFileSync(file).toString().replace('../../src', '../src'));
  } else {
    // Write a JS file so editor can autocomplete file paths when importing.
    fs.writeFile(
      dest.replace(/\.d\.ts$/, '.js'),
      "// This file only exists so it's easier for you to autocomplete the file path in your IDE.",
    );

    // Write type definition file and fix import paths.
    fs.writeFile(dest, fs.readFileSync(file).toString().replace('../', '../types/'));
  }
}

if (watch) {
  chokidar
    .watch(`${targetDir}/*`)
    .on('change', (file) => copy(file))
    .on('add', (file) => copy(file))
    .on('unlink', (file) => {
      const dest = resolveDest(file);
      fs.remove(dest);
      fs.remove(dest.replace(/\.d\.ts$/, '.js'));
    });
} else {
  const files = globbySync(`${targetDir}/*`, { absolute: true });
  files.forEach((file) => {
    copy(file);
  });
}
