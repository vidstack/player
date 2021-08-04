import { esbuildPlugin } from '@web/dev-server-esbuild';
import { fromRollup } from '@web/dev-server-rollup';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
import rollupReplace from '@rollup/plugin-replace';

const __dirname = dirname(fileURLToPath(import.meta.url));
const replace = fromRollup(rollupReplace);

// Web Test Runner Config (https://modern-web.dev/docs/test-runner/cli-and-configuration)
export default /** @type {import('@web/test-runner').TestRunnerConfig} */ ({
  nodeResolve: true,
  plugins: [
    replace({
      include: /env.ts$/,
      preventAssignment: false,
      values: {
        'const DEV_MODE = true': `const DEV_MODE = false`
      }
    }),
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
    esbuildPlugin({ ts: true, target: 'auto' })
  ]
});
