import '../../../media/define.js';
import '../../../media/test-utils/define.js';
import './define.js';

import { html } from 'lit';

import { ifNonEmpty } from '../../../shared/directives/if-non-empty.js';
import {
	VDS_PLAY_BUTTON_ELEMENT_STORYBOOK_ARG_TYPES,
	VDS_PLAY_BUTTON_ELEMENT_TAG_NAME
} from './PlayButtonElement.js';

export default {
	title: 'UI/Foundation/Controls/Play Button',
	component: VDS_PLAY_BUTTON_ELEMENT_TAG_NAME,
	argTypes: VDS_PLAY_BUTTON_ELEMENT_STORYBOOK_ARG_TYPES
};

/**
 * @param {import('./types').PlayButtonElementStorybookArgs} args
 */
function Template({
	// Properties
	label,
	describedBy,
	disabled,
	// Actions
	onVdsPlayRequest,
	onVdsPauseRequest,
	// Fake Properties
	fakePaused
}) {
	return html`
		<vds-media-controller
			@vds-pause-request=${onVdsPauseRequest}
			@vds-play-request=${onVdsPlayRequest}
		>
			<vds-media-container>
				<vds-fake-media-provider
					.canPlayContext=${true}
					.pausedContext=${fakePaused}
					slot="media"
				></vds-fake-media-provider>

				<vds-play-button
					label=${ifNonEmpty(label)}
					described-by=${ifNonEmpty(describedBy)}
					?disabled=${disabled}
				>
					<div slot="play">Play</div>
					<div slot="pause">Pause</div>
				</vds-play-button>
			</vds-media-container>
		</vds-media-controller>
	`;
}

export const PlayButton = Template.bind({});
