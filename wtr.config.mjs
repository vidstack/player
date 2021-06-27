import { esbuildPlugin } from '@web/dev-server-esbuild';

// Web Test Runner Config (https://modern-web.dev/docs/test-runner/cli-and-configuration)
export default {
  nodeResolve: true,
  plugins: [esbuildPlugin({ ts: true, target: 'auto' })]
};
