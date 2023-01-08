import chokidar from 'chokidar';
import fs from 'fs-extra';
import { globbySync } from 'globby';
import kleur from 'kleur';
import minimist from 'minimist';
import path from 'path';

const args = minimist(process.argv.slice(2));

const watch = args.watch || args.w;

const targetDir = path.resolve(process.cwd(), args.entry);
const destDir = path.resolve(process.cwd(), args.outdir);
const overwrite = args.overwrite !== 'false';
const glob = args.glob ?? '**';

if (!args.entry) {
  console.error(kleur.red(`\n\n🚨 Missing entry argument \`--entry\`\n\n`));
}

if (!args.outdir) {
  console.error(kleur.red(`\n\n🚨 Missing outdir argument \`--outdir\`\n\n`));
}

if (!fs.existsSync(destDir)) {
  fs.mkdir(destDir);
}

function resolveDest(file) {
  return path.resolve(destDir, path.relative(targetDir, file));
}

if (watch) {
  chokidar
    .watch(glob, { cwd: targetDir })
    .on('change', (file) => fs.copy(file, resolveDest(file)))
    .on('add', (file) => fs.copy(file, resolveDest(file)))
    .on('unlink', (file) => fs.remove(resolveDest(file)));
} else {
  const files = globbySync(glob, { absolute: true, cwd: targetDir });
  files.forEach((file) => {
    fs.copy(file, resolveDest(file), { overwrite });
  });
}
