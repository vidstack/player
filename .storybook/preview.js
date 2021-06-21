const { configureActions } = require('@storybook/addon-actions');

/**
 * Performance optimization otherwise Storybook UI freezes up.
 *
 * @link https://github.com/storybookjs/storybook/blob/master/addons/actions/ADVANCED.md#configuration
 */
configureActions({ depth: 1 });

module.exports = {
	parameters: {
		controls: {
			expanded: false,
			sort: 'alpha'
		},
		previewTabs: {
			'storybook/docs/panel': {
				hidden: true
			}
		}
	}
};
