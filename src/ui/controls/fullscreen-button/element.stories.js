import '../../../media/define.js';
import './define.js';

import { html } from 'lit';

import { ifNonEmpty } from '../../../shared/directives/if-non-empty.js';
import { VDS_FULLSCREEN_BUTTON_ELEMENT_TAG_NAME } from './FullscreenButtonElement.js';

export default {
	title: 'UI/Foundation/Controls/Fullscreen Button',
	component: VDS_FULLSCREEN_BUTTON_ELEMENT_TAG_NAME,
	argTypes: {
		pressed: {
			table: {
				disable: true
			}
		},
		fakeFullscreen: {
			control: 'boolean',
			defaultValue: false
		}
	}
};

function Template({
	// Fakes
	fakeFullscreen,
	// Props
	label,
	describedBy,
	disabled,
	// Events
	onVdsEnterFullscreenRequest,
	onVdsExitFullscreenRequest
}) {
	return html`
		<vds-media-controller .canPlay="${true}" .fullscreen="${fakeFullscreen}">
			<vds-media-container>
				<vds-fake-media-provider slot="media"></vds-fake-media-provider>

				<vds-fullscreen-button
					label="${ifNonEmpty(label)}"
					described-by="${ifNonEmpty(describedBy)}"
					?disabled="${disabled}"
					@vds-enter-fullscreen-request="${onVdsEnterFullscreenRequest}"
					@vds-exit-fullscreen-request="${onVdsExitFullscreenRequest}"
				>
					<div slot="enter">Enter</div>
					<div slot="exit">Exit</div>
				</vds-fullscreen-button>
			</vds-media-container>
		</vds-media-controller>
	`;
}

export const FullscreenButton = Template.bind({});
