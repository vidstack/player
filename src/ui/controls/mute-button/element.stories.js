import '../../../media/define';
import './define';

import { html } from 'lit';

import { ifNonEmpty } from '../../../shared/directives/if-non-empty';
import { VDS_MUTE_BUTTON_ELEMENT_TAG_NAME } from './MuteButtonElement';

export default {
	title: 'UI/Foundation/Controls/Mute Button',
	component: VDS_MUTE_BUTTON_ELEMENT_TAG_NAME,
	argTypes: {
		pressed: {
			table: {
				disable: true
			}
		},
		fakeMuted: {
			control: 'boolean',
			defaultValue: false
		}
	}
};

function Template({
	// Fakes
	fakeMuted,
	// Props
	label,
	describedBy,
	disabled,
	// Events
	onVdsMuteRequest,
	onVdsUnmuteRequest
}) {
	return html`
		<vds-media-controller .canPlay="${true}" .muted="${fakeMuted}">
			<vds-media-container>
				<vds-fake-media-provider slot="media"></vds-fake-media-provider>

				<vds-mute-button
					label="${ifNonEmpty(label)}"
					described-by="${ifNonEmpty(describedBy)}"
					?disabled="${disabled}"
					@vds-mute-request="${onVdsMuteRequest}"
					@vds-unmute-request="${onVdsUnmuteRequest}"
				>
					<div slot="mute">Mute</div>
					<div slot="unmute">Unmute</div>
				</vds-mute-button>
			</vds-media-container>
		</vds-media-controller>
	`;
}

export const MuteButton = Template.bind({});
