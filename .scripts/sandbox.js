import { execa } from 'execa';
import fs from 'fs';
import path from 'path';

const __cwd = process.cwd();

async function main() {
  const SANDBOX_DIR = path.resolve(__cwd, 'sandbox');
  const SANDBOX_SERVER_FILE = path.resolve(SANDBOX_DIR, 'server.js');

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

  if (fs.existsSync(SANDBOX_SERVER_FILE)) {
    await execa('node', [SANDBOX_SERVER_FILE], { stdio: 'inherit' });
  } else {
    await execa('vite', ['--open=/sandbox/index.html', '--port=3100'], { stdio: 'inherit' });
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
