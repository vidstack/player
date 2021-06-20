import '../../../media/define.js';
import './define.js';

import { html } from 'lit';

import { ifNonEmpty } from '../../../shared/directives/if-non-empty.js';
import { VDS_TIME_PROGRESS_ELEMENT_TAG_NAME } from './TimeProgressElement.js';

export default {
	title: 'UI/Foundation/Time/Time Progress',
	component: VDS_TIME_PROGRESS_ELEMENT_TAG_NAME,
	argTypes: {
		seconds: {
			table: {
				disable: true
			}
		},
		fakeCurrentTime: {
			control: 'number',
			defaultValue: 3750
		},
		fakeDuration: {
			control: 'number',
			defaultValue: 7500
		}
	}
};

function Template({
	// Fakes
	fakeCurrentTime,
	fakeDuration,
	// Props
	label,
	alwaysShowHours,
	padHours,
	currentTimeLabel,
	durationLabel,
	timeSeparator
}) {
	return html`
		<vds-media-controller
			.currentTime="${fakeCurrentTime}"
			.duration="${fakeDuration}"
		>
			<vds-media-container>
				<vds-time-progress
					label="${ifNonEmpty(label)}"
					time-separator="${timeSeparator}"
					current-time-label="${ifNonEmpty(currentTimeLabel)}"
					duration-label="${ifNonEmpty(durationLabel)}"
					?always-show-hours="${alwaysShowHours}"
					?pad-hours="${padHours}"
				></vds-time-progress>
			</vds-media-container>
		</vds-media-controller>
	`;
}

export const TimeProgress = Template.bind({});
