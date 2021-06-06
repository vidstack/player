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
import { PlayButtonElementProps } from './play-button.types';
import { VDS_PLAY_BUTTON_ELEMENT_TAG_NAME } from './vds-play-button';

export default {
	title: 'UI/Foundation/Controls/Play Button',
	component: VDS_PLAY_BUTTON_ELEMENT_TAG_NAME,
	argTypes: {
		...buildStorybookControlsFromManifest(VDS_PLAY_BUTTON_ELEMENT_TAG_NAME),
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

interface FakeProps {
	fakePaused: boolean;
}

type Args = FakeProps &
	PlayButtonElementProps &
	DOMEventsToStorybookActions<VdsMediaRequestEvents>;

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
}: Args): TemplateResult {
	return html`
		<vds-media-controller .canPlay="${true}" .paused="${fakePaused}">
			<vds-media-container>
				<vds-fake-media-provider slot="media"></vds-fake-media-provider>

				<vds-play-button
					label="${ifNonEmpty(label)}"
					described-by="${ifNonEmpty(describedBy)}"
					?disabled="${disabled}"
					style="color: ${SB_THEME_COLOR};"
					@vds-play-request="${onVdsPlayRequest}"
					@vds-pause-request="${onVdsPauseRequest}"
				>
					<div slot="play">Play</div>
					<div slot="pause">Pause</div>
				</vds-play-button>
			</vds-media-container>
		</vds-media-controller>

		<style>
			vds-media-container::part(ui) {
				position: relative;
			}
		</style>
	`;
}

export const PlayButton = Template.bind({});
