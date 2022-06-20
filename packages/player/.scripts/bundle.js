import { build } from 'esbuild';
import { commonOptions } from '../../../.scripts/common-build.js';

async function main() {
  const entry = ['src/index.ts', 'src/define/*.ts'];
  const external = [/^@vidstack/, /^lit/, 'hls.js'];
  const externalCDN = ['hls.js'];
  const minifyHtml = /(styles|Element)\.(js|ts)/;
  const debug = process.argv.includes('--debug');

  /** @param {Partial<Parameters<typeof commonOptions>[0]>} args */
  const shared = (args = {}) => commonOptions({ entry, external, minifyHtml, ...args });

  await Promise.all([
    build({
      ...shared({ dev: true }),
      bundle: true,
      splitting: true,
      outdir: 'dist/dev',
    }),
    build({
      ...shared(),
      bundle: true,
      splitting: true,
      minify: !debug,
      outdir: 'dist/prod',
    }),
    build({
      ...shared({ node: true, external: [/^@vidstack/] }),
      bundle: true,
      splitting: !debug,
      outdir: 'dist/node',
    }),
    build({
      ...shared({
        entry: ['src/define/dangerously-all.ts'],
        external: externalCDN,
        mangle: !debug,
      }),
      bundle: true,
      minify: !debug,
      outfile: 'cdn/bundle.js',
    }),
    build({
      ...shared({
        entry: ['src/define/*.ts'],
        external: externalCDN,
        mangle: !debug,
      }),
      bundle: true,
      splitting: true,
      minify: !debug,
      outdir: 'cdn/define',
    }),
  ]);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
