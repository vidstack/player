import { esbuildPlugin } from '@web/dev-server-esbuild';
import { fromRollup } from '@web/dev-server-rollup';
import rollupAlias from '@rollup/plugin-alias';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const alias = fromRollup(rollupAlias);
const srcDir = resolve(__dirname, 'src');

// Web Test Runner Config (https://modern-web.dev/docs/test-runner/cli-and-configuration)
export default /** @type {import('@web/test-runner').TestRunnerConfig} */ ({
  nodeResolve: true,
  plugins: [
    alias({
      entries: [
        {
          find: /^@base/,
          replacement: resolve(srcDir, 'base')
        },
        {
          find: /^@media/,
          replacement: resolve(srcDir, 'media')
        },
        {
          find: /^@providers/,
          replacement: resolve(srcDir, 'providers')
        },
        {
          find: /^@skins/,
          replacement: resolve(srcDir, 'skins')
        },
        {
          find: /^@ui/,
          replacement: resolve(srcDir, 'ui')
        },
        {
          find: /^@utils/,
          replacement: resolve(srcDir, 'utils')
        }
      ]
    }),
    esbuildPlugin({ loaders: { '.js': 'ts', '.ts': 'ts' }, target: 'auto' })
  ]
});
