import { esbuildPlugin } from '@web/dev-server-esbuild';

// Web Test Runner Config (https://modern-web.dev/docs/test-runner/cli-and-configuration)
export default /** @type {import('@web/test-runner').TestRunnerConfig} */ ({
  nodeResolve: true,
  plugins: [
    esbuildPlugin({ loaders: { '.js': 'ts', '.ts': 'ts' }, target: 'auto' })
  ]
});
