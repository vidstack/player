import fs from 'fs';
import path from 'path';

import { execa } from 'execa';

const __cwd = process.cwd();

async function main() {
  const SANDBOX_DIR = path.resolve(__cwd, 'sandbox');
  const SANDBOX_SERVER_FILE = path.resolve(SANDBOX_DIR, 'server.js');
  const SANDBOX_NODE_MODULES = path.resolve(SANDBOX_DIR, 'node_modules');
  const SANDBOX_PKG = path.resolve(SANDBOX_DIR, 'package.json');

  if (!fs.existsSync(SANDBOX_DIR)) {
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
    await execa('pnpm', ['-C', 'sandbox', 'i'], { stdio: 'inherit' });
  }

  if (fs.existsSync(SANDBOX_SERVER_FILE)) {
    await execa('node', [SANDBOX_SERVER_FILE], { stdio: 'inherit' });
  } else {
    await execa('vite', ['--open=/sandbox/index.html', '--port=3100', '--host'], {
      stdio: 'inherit',
    });
  }
}

main().catch((e) => {
  if (e.exitCode === 1) return;
  console.error(e);
  process.exit(1);
});
