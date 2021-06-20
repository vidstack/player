import './define.js';

import { html } from 'lit';

import { ifNonEmpty } from '../../../shared/directives/if-non-empty.js';
import { VDS_BUTTON_ELEMENT_TAG_NAME } from './ButtonElement.js';

export default {
	title: 'UI/Foundation/Controls/Button',
	component: VDS_BUTTON_ELEMENT_TAG_NAME,
	argTypes: {}
};

function Template({
	label,
	describedBy,
	controls,
	hasPopup,
	hidden,
	disabled,
	type,
	expanded,
	pressed
}) {
	return html`
		<vds-button
			label="${ifNonEmpty(label)}"
			described-by="${ifNonEmpty(describedBy)}"
			controls="${ifNonEmpty(controls)}"
			type="${ifNonEmpty(type)}"
			?hidden="${hidden}"
			?disabled="${disabled}"
			?has-popup="${hasPopup}"
			?expanded="${expanded}"
			?pressed="${pressed}"
		>
			Button
		</vds-button>
	`;
}

export const Button = Template.bind({});
