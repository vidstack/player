import fs from 'fs';
import path from 'path';

import { execa } from 'execa';

const __cwd = process.cwd();
const key = process.env.npm_lifecycle_event;
const target = key.split(':');

async function main() {
  const ROOT_SANDBOX_DIR = path.resolve(__cwd, 'sandbox');
  const SANDBOX_DIR = path.resolve(ROOT_SANDBOX_DIR, `sandbox/${target[1] ?? ''}`);
  const SANDBOX_SERVER_FILE = path.resolve(SANDBOX_DIR, 'server.js');
  const SANDBOX_NODE_MODULES = path.resolve(SANDBOX_DIR, 'node_modules');
  const SANDBOX_PKG = path.resolve(SANDBOX_DIR, 'package.json');

  if (!fs.existsSync(ROOT_SANDBOX_DIR)) {
    await execa(
      'node',
      [
        '../../.scripts/copy.js',
        '--entry=.templates/sandbox',
        '--outdir=sandbox',
        '--overwrite=false',
      ],
      { stdio: 'inherit' },
    );
  }

  if (fs.existsSync(SANDBOX_PKG) && !fs.existsSync(SANDBOX_NODE_MODULES)) {
    await execa('pnpm', ['-C', key, 'i'], { stdio: 'inherit' });
  }

  if (fs.existsSync(SANDBOX_SERVER_FILE)) {
    await execa('node', [SANDBOX_SERVER_FILE], { stdio: 'inherit' });
  } else {
    await execa('vite', [`--open=/${target.join('/')}/index.html`, '--port=3100', '--host'], {
      stdio: 'inherit',
    });
  }
}

main().catch((e) => {
  if (e.exitCode === 1) return;
  console.error(e);
  process.exit(1);
});
