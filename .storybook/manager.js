const theme = require('./theme.js');
const { addons } = require('@storybook/addons');

addons.setConfig({
	isFullscreen: false,
	showNav: true,
	showPanel: true,
	theme,
	panelPosition: 'right',
	sidebarAnimations: true,
	enableShortcuts: true,
	isToolshown: true,
	selectedPanel: undefined,
	initialActive: 'sidebar',
	sidebar: {
		showRoots: false
	}
});
