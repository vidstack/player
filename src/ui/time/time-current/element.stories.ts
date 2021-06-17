import '../../../media/define';
import './define';

import { html } from 'lit';

import { ifNonEmpty } from '../../../shared/directives/if-non-empty';
import { VDS_TIME_CURRENT_ELEMENT_TAG_NAME } from './TimeCurrentElement';

export default {
	title: 'UI/Foundation/Time/Time Current',
	component: VDS_TIME_CURRENT_ELEMENT_TAG_NAME,
	argTypes: {
		seconds: {
			table: {
				disable: true
			}
		},
		fakeCurrentTime: {
			control: 'number',
			defaultValue: 3750
		}
	}
};

function Template({ fakeCurrentTime, label, alwaysShowHours, padHours }) {
	return html`
		<vds-media-controller .currentTime="${fakeCurrentTime}">
			<vds-media-container>
				<vds-time-current
					label="${ifNonEmpty(label)}"
					?always-show-hours="${alwaysShowHours}"
					?pad-hours="${padHours}"
				></vds-time-current>
			</vds-media-container>
		</vds-media-controller>

		<style>
			vds-media-container::part(ui) {
				position: relative;
			}
		</style>
	`;
}

export const TimeCurrent = Template.bind({});
