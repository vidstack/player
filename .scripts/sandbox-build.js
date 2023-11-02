import { $ } from 'execa';

const key = process.env.npm_lifecycle_event;
const target = key.split(':');

async function main() {
  $`vite build ${target.join('/')}`;
}

main().catch((e) => {
  if (e.exitCode === 1) return;
  console.error(e);
  process.exit(1);
});
