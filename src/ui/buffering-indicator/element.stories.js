import '../../media/define.js';
import '../../media/test-utils/define.js';
import './define.js';

import { html } from 'lit';

import {
	VDS_BUFFERING_INDICATOR_ELEMENT_STORYBOOK_ARG_TYPES,
	VDS_BUFFERING_INDICATOR_ELEMENT_TAG_NAME
} from './BufferingIndicatorElement.js';

export default {
	title: 'UI/Foundation/Buffering Indicator',
	component: VDS_BUFFERING_INDICATOR_ELEMENT_TAG_NAME,
	argTypes: VDS_BUFFERING_INDICATOR_ELEMENT_STORYBOOK_ARG_TYPES
};

/**
 * @param {import('./types.js').BufferingIndicatorElementStorybookArgs} args
 */
function Template({
	// Properties
	delay,
	showWhileBooting,
	// Actions
	onVdsBufferingIndicatorShow,
	onVdsBufferingIndicatorHide,
	// Fake Properties
	fakeCanPlay,
	fakeBuffering
}) {
	return html`
		<vds-media-controller>
			<vds-media-container>
				<vds-fake-media-provider
					.canPlayContext=${fakeCanPlay}
					.waitingContext=${fakeBuffering}
					slot="media"
				></vds-fake-media-provider>
				<vds-buffering-indicator
					?show-while-booting=${showWhileBooting}
					delay=${delay}
					@vds-buffering-indicator-show=${onVdsBufferingIndicatorShow}
					@vds-buffering-indicator-hide=${onVdsBufferingIndicatorHide}
				>
					<div>I'm Buffering!</div>
				</vds-buffering-indicator>
			</vds-media-container>
		</vds-media-controller>
	`;
}

export const BufferingIndicator = Template.bind({});
