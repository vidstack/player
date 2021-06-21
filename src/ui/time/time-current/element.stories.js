import '../../../media/define.js';
import '../../../media/test-utils/define.js';
import './define.js';

import { html } from 'lit';

import { ifNonEmpty } from '../../../shared/directives/if-non-empty.js';
import {
	VDS_TIME_CURRENT_ELEMENT_STORYBOOK_ARG_TYPES,
	VDS_TIME_CURRENT_ELEMENT_TAG_NAME
} from './TimeCurrentElement.js';

export default {
	title: 'UI/Foundation/Time/Time Current',
	component: VDS_TIME_CURRENT_ELEMENT_TAG_NAME,
	argTypes: VDS_TIME_CURRENT_ELEMENT_STORYBOOK_ARG_TYPES
};

/**
 * @param {import('./types').TimeCurrentElementStorybookArgs} args
 */
function Template({
	// Properties
	alwaysShowHours,
	label,
	padHours,
	// Media Properties
	mediaCurrentTime
}) {
	return html`
		<vds-media-controller .currentTime=${mediaCurrentTime}>
			<vds-media-container>
				<vds-fake-media-provider
					.canPlayContext=${true}
					.currentTimeContext=${mediaCurrentTime}
					slot="media"
				></vds-fake-media-provider>

				<vds-time-current
					label=${ifNonEmpty(label)}
					?always-show-hours=${alwaysShowHours}
					?pad-hours=${padHours}
				></vds-time-current>
			</vds-media-container>
		</vds-media-controller>
	`;
}

export const TimeCurrent = Template.bind({});
