import chokidar from 'chokidar';
import { execa } from 'execa';
import kleur from 'kleur';
import minimist from 'minimist';

const args = minimist(process.argv.slice(2));

if (!args.glob) {
  console.error(kleur.red(`\n\n🚨 Missing glob argument \`--glob\`\n\n`));
}

if (!args.scripts) {
  console.error(kleur.red(`\n\n🚨 Missing scripts argument \`--scripts\`\n\n`));
}

const scripts = args.scripts.includes(',') ? args.scripts.split(',') : [args.scripts];

let running = false;
async function onChange() {
  if (running) return;

  running = true;
  for (const script of scripts) await execa('pnpm', ['run', script], { stdio: 'inherit' });
  running = false;
}

onChange();
chokidar.watch(args.glob).on('change', onChange).on('unlink', onChange);
