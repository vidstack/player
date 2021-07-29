import { esbuildPlugin } from '@web/dev-server-esbuild';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

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
    esbuildPlugin({ ts: true, target: 'auto' })
  ]
});
