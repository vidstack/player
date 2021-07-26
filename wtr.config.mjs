import { esbuildPlugin } from '@web/dev-server-esbuild';
import { fromRollup } from '@web/dev-server-rollup';
import rollupAlias from '@rollup/plugin-alias';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

const alias = fromRollup(rollupAlias);
const srcDir = resolve(__dirname, 'src');

// Web Test Runner Config (https://modern-web.dev/docs/test-runner/cli-and-configuration)
export default /** @type {import('@web/test-runner').TestRunnerConfig} */ ({
  nodeResolve: true,
  plugins: [
    // @see https://github.com/modernweb-dev/web/issues/1376
    {
      name: 'resolve-lit',
      serve(context) {
        if (
          context.path.includes('node_modules/lit') &&
          context.path.endsWith('.ts')
        ) {
          const path = `${__dirname}/${context.request.url}`.replace(
            /\.ts$/,
            '.js'
          );
          const body = readFileSync(path);
          return { body, type: 'js' };
        }
      }
    },
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
    esbuildPlugin({ ts: true, target: 'auto' })
  ]
});
