import { esbuildPlugin } from '@web/dev-server-esbuild';

export default {
	concurrency: 4,
	nodeResolve: true,
	plugins: [esbuildPlugin({ ts: true, target: 'auto' })]
};
