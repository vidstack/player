import { esbuildPlugin } from '@web/dev-server-esbuild';

export default {
  open: true,
  nodeResolve: true,
  plugins: [esbuildPlugin({ ts: true, target: 'auto' })],
};
