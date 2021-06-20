import './define.js';

import { html } from 'lit';

import { ifNonEmpty } from '../../../shared/directives/if-non-empty.js';
import { VDS_TIME_ELEMENT_TAG_NAME } from './TimeElement.js';

export default {
	title: 'UI/Foundation/Time/Time',
	component: VDS_TIME_ELEMENT_TAG_NAME,
	argTypes: {}
};

function Template({
	// Props
	label,
	seconds,
	alwaysShowHours,
	padHours
}) {
	return html`
		<vds-time
			label="${ifNonEmpty(label)}"
			seconds="${seconds}"
			?always-show-hours="${alwaysShowHours}"
			?pad-hours="${padHours}"
		></vds-time>
	`;
}

export const Time = Template.bind({});
