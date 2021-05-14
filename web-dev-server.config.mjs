// @ts-check

import { esbuildPlugin } from '@web/dev-server-esbuild';

/** @type {import("@web/dev-server").DevServerConfig} */
const CONFIG = {
  open: false,
  nodeResolve: true,
  plugins: [esbuildPlugin({ ts: true, target: 'auto' })],
};

export default CONFIG;
