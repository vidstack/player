import '../../media/define.js';
import './define.js';

import { html } from 'lit';

import { VDS_BUFFERING_INDICATOR_ELEMENT_TAG_NAME } from './BufferingIndicatorElement.js';

export default {
	title: 'UI/Foundation/Buffering Indicator',
	component: VDS_BUFFERING_INDICATOR_ELEMENT_TAG_NAME,
	argTypes: {
		fakeCanPlay: {
			control: 'boolean',
			defaultValue: true
		},
		fakeBuffering: {
			control: 'boolean',
			defaultValue: true
		}
	}
};

function Template({
	// Fakes
	fakeCanPlay,
	fakeBuffering,
	// Props
	delay,
	showWhileBooting,
	// Events
	onVdsBufferingIndicatorShow,
	onVdsBufferingIndicatorHide
}) {
	return html`
		<vds-media-controller .canPlay="${fakeCanPlay}" .waiting="${fakeBuffering}">
			<vds-media-container>
				<vds-buffering-indicator
					?show-while-booting="${showWhileBooting}"
					delay="${delay}"
					@vds-buffering-indicator-show="${onVdsBufferingIndicatorShow}"
					@vds-buffering-indicator-hide="${onVdsBufferingIndicatorHide}"
				>
					<div>I'm Buffering!</div>
				</vds-buffering-indicator>
			</vds-media-container>
		</vds-media-controller>

		<style>
			vds-media-container::part(ui) {
				position: relative;
			}
		</style>
	`;
}

export const BufferingIndicator = Template.bind({});
