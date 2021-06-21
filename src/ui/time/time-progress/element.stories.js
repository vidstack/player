import '../../../media/define.js';
import '../../../media/test-utils/define.js';
import './define.js';

import { html } from 'lit';

import { ifNonEmpty } from '../../../shared/directives/if-non-empty.js';
import {
	VDS_TIME_PROGRESS_ELEMENT_STORYBOOK_ARG_TYPES,
	VDS_TIME_PROGRESS_ELEMENT_TAG_NAME
} from './TimeProgressElement.js';

export default {
	title: 'UI/Foundation/Time/Time Progress',
	component: VDS_TIME_PROGRESS_ELEMENT_TAG_NAME,
	argTypes: VDS_TIME_PROGRESS_ELEMENT_STORYBOOK_ARG_TYPES
};

/**
 * @param {import('./types').TimeProgressElementStorybookArgs} args
 */
function Template({
	// Properties
	alwaysShowHours,
	padHours,
	currentTimeLabel,
	durationLabel,
	timeSeparator,
	// Media Properties
	mediaCurrentTime,
	mediaDuration
}) {
	return html`
		<vds-media-controller>
			<vds-media-container>
				<vds-fake-media-provider
					.canPlayContext=${true}
					.currentTimeContext=${mediaCurrentTime}
					.durationContext=${mediaDuration}
					slot="media"
				></vds-fake-media-provider>

				<vds-time-progress
					current-time-label=${ifNonEmpty(currentTimeLabel)}
					duration-label=${ifNonEmpty(durationLabel)}
					time-separator=${timeSeparator}
					?always-show-hours=${alwaysShowHours}
					?pad-hours=${padHours}
				></vds-time-progress>
			</vds-media-container>
		</vds-media-controller>
	`;
}

export const TimeProgress = Template.bind({});
