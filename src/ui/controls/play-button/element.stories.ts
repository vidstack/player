import '../../../media/define';
import './define';

import { html } from 'lit';

import { ifNonEmpty } from '../../../shared/directives/if-non-empty';
import { VDS_PLAY_BUTTON_ELEMENT_TAG_NAME } from './PlayButtonElement';

export default {
	title: 'UI/Foundation/Controls/Play Button',
	component: VDS_PLAY_BUTTON_ELEMENT_TAG_NAME,
	argTypes: {
		pressed: {
			table: {
				disable: true
			}
		},
		fakePaused: {
			control: 'boolean',
			defaultValue: true
		}
	}
};

function Template({
	// Fakes
	fakePaused,
	// Props
	label,
	describedBy,
	disabled,
	// Events
	onVdsPlayRequest,
	onVdsPauseRequest
}) {
	return html`
		<vds-media-controller .canPlay="${true}" .paused="${fakePaused}">
			<vds-media-container>
				<vds-fake-media-provider slot="media"></vds-fake-media-provider>

				<vds-play-button
					label="${ifNonEmpty(label)}"
					described-by="${ifNonEmpty(describedBy)}"
					?disabled="${disabled}"
					@vds-play-request="${onVdsPlayRequest}"
					@vds-pause-request="${onVdsPauseRequest}"
				>
					<div slot="play">Play</div>
					<div slot="pause">Pause</div>
				</vds-play-button>
			</vds-media-container>
		</vds-media-controller>
	`;
}

export const PlayButton = Template.bind({});
