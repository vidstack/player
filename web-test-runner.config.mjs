import { esbuildPlugin } from '@web/dev-server-esbuild';
import { playwrightLauncher } from '@web/test-runner-playwright';

export default {
	nodeResolve: true,
	plugins: [esbuildPlugin({ ts: true, target: 'auto' })],
	browsers: [
		playwrightLauncher({ product: 'firefox', concurrency: 1 }),
		playwrightLauncher({ product: 'chromium' }),
		playwrightLauncher({ product: 'webkit' })
	]
};
