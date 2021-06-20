import './define.js';

import { html } from 'lit';

import { ifNonEmpty } from '../../../shared/directives/if-non-empty.js';
import { VDS_TOGGLE_BUTTON_ELEMENT_TAG_NAME } from './ToggleButtonElement.js';

export default {
	title: 'UI/Foundation/Controls/Toggle Button',
	component: VDS_TOGGLE_BUTTON_ELEMENT_TAG_NAME,
	argTypes: {
		// Avoid clashing with `pressed` slot name.
		'pressed ': {
			control: 'boolean',
			default: false,
			description: 'Whether the toggle is in the pressed state.',
			table: {
				category: 'properties',
				defaultValue: {
					summary: 'false'
				},
				type: {
					summary: 'boolean'
				}
			}
		}
	}
};

function Template({
	// Props
	label,
	disabled,
	describedBy,
	...args
}) {
	return html`
		<vds-toggle-button
			label="${ifNonEmpty(label)}"
			described-by="${ifNonEmpty(describedBy)}"
			?pressed="${args['pressed ']}"
			?disabled="${disabled}"
		>
			<div slot="pressed">Pressed</div>
			<div>Not Pressed</div>
		</vds-toggle-button>
	`;
}

export const ToggleButton = Template.bind({});
