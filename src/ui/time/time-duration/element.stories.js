import '../../../media/define.js';
import './define.js';

import { html } from 'lit';

import { ifNonEmpty } from '../../../shared/directives/if-non-empty.js';
import { VDS_TIME_DURATION_ELEMENT_TAG_NAME } from './TimeDurationElement.js';

export default {
	title: 'UI/Foundation/Time/Time Duration',
	component: VDS_TIME_DURATION_ELEMENT_TAG_NAME,
	argTypes: {
		seconds: {
			table: {
				disable: true
			}
		},
		fakeDuration: {
			control: 'number',
			defaultValue: 3750
		}
	}
};

function Template({ fakeDuration, label, alwaysShowHours, padHours }) {
	return html`
		<vds-media-controller .duration="${fakeDuration}">
			<vds-media-container>
				<vds-time-duration
					label="${ifNonEmpty(label)}"
					?always-show-hours="${alwaysShowHours}"
					?pad-hours="${padHours}"
				></vds-time-duration>
			</vds-media-container>
		</vds-media-controller>
	`;
}

export const TimeDuration = Template.bind({});
