// @ts-check

import { esbuildPlugin } from '@web/dev-server-esbuild';

/** @type {Partial<import("@web/test-runner").TestRunnerConfig>} */
const CONFIG = {
  concurrency: 10,
  nodeResolve: true,
  plugins: [esbuildPlugin({ ts: true, target: 'auto' })],
};

export default CONFIG;
