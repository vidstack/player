import '../../../core/media/controller/define';
import '../../../core/media/container/vds-media-container';
import '../../../core/fakes/vds-fake-media-provider';

import { html, TemplateResult } from 'lit-html';

import { VdsMediaRequestEvents } from '../../../core';
import { ifNonEmpty } from '../../../shared/directives/if-non-empty';
import {
	buildStorybookControlsFromManifest,
	DOMEventsToStorybookActions,
	SB_THEME_COLOR
} from '../../../shared/storybook';
import { FullscreenButtonElementProps } from './fullscreen-button.types';
import { VDS_FULLSCREEN_BUTTON_ELEMENT_TAG_NAME } from './vds-fullscreen-button';

export default {
	title: 'UI/Foundation/Controls/Fullscreen Button',
	component: VDS_FULLSCREEN_BUTTON_ELEMENT_TAG_NAME,
	argTypes: {
		...buildStorybookControlsFromManifest(
			VDS_FULLSCREEN_BUTTON_ELEMENT_TAG_NAME
		),
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

interface FakeProps {
	fakeFullscreen: boolean;
}

type Args = FakeProps &
	FullscreenButtonElementProps &
	DOMEventsToStorybookActions<VdsMediaRequestEvents>;

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
}: Args): TemplateResult {
	return html`
		<vds-media-controller .canPlay="${true}" .fullscreen="${fakeFullscreen}">
			<vds-media-container>
				<vds-fake-media-provider slot="media"></vds-fake-media-provider>

				<vds-fullscreen-button
					label="${ifNonEmpty(label)}"
					described-by="${ifNonEmpty(describedBy)}"
					?disabled="${disabled}"
					style="color: ${SB_THEME_COLOR};"
					@vds-enter-fullscreen-request="${onVdsEnterFullscreenRequest}"
					@vds-exit-fullscreen-request="${onVdsExitFullscreenRequest}"
				>
					<div slot="enter">Enter</div>
					<div slot="exit">Exit</div>
				</vds-fullscreen-button>
			</vds-media-container>
		</vds-media-controller>

		<style>
			vds-media-container::part(ui) {
				position: relative;
			}
		</style>
	`;
}

export const FullscreenButton = Template.bind({});
