import minimist from 'minimist';
import chokidar from 'chokidar';
import { existsSync, writeFileSync, readFileSync } from 'fs';
import { resolve } from 'path';

const args = minimist(process.argv.slice(2));

const watch = args.watch || args.w;

const distDir = resolve(process.cwd(), 'dist-node');
const index = resolve(distDir, 'index.js');

let prevContent;
function patch() {
  if (!existsSync(index)) return;
  const fileContent = readFileSync(index).toString();
  if (prevContent !== fileContent) {
    writeFileSync(index, fileContent.replace('window.litHtmlPolyfillSupport', 'null'));
    prevContent = fileContent;
  }
}

if (watch) {
  chokidar.watch(index).on('change', patch).on('add', patch);
} else {
  patch();
}
