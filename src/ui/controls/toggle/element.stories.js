import './define.js';

import { html } from 'lit';

import { VDS_TOGGLE_ELEMENT_TAG_NAME } from './ToggleElement.js';

export default {
	title: 'UI/Foundation/Controls/Toggle',
	component: VDS_TOGGLE_ELEMENT_TAG_NAME,
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

function Template(args) {
	return html`
		<vds-toggle ?pressed="${args['pressed ']}">
			<div>Not Pressed</div>
			<div slot="pressed">Pressed</div>
		</vds-toggle>
	`;
}

export const Toggle = Template.bind({});
