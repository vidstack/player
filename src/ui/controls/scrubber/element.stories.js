import '../../../media/define';
import './define';

import { html } from 'lit';

import { createTimeRanges } from '../../../media';
import { ifNonEmpty } from '../../../shared/directives/if-non-empty';
import { VDS_SCRUBBER_ELEMENT_TAG_NAME } from './ScrubberElement';

export default {
	title: 'UI/Foundation/Controls/Scrubber',
	component: VDS_SCRUBBER_ELEMENT_TAG_NAME,
	argTypes: {
		fakeCurrentTime: {
			control: 'number',
			defaultValue: 1000
		},
		fakeDuration: {
			control: 'number',
			defaultValue: 3600
		},
		fakeSeekableAmount: {
			control: 'number',
			defaultValue: 1800
		}
	}
};

function Template({
	// Fakes
	fakeCurrentTime,
	fakeSeekableAmount,
	fakeDuration,
	// Props
	sliderLabel,
	progressLabel,
	progressText,
	hidden,
	disabled,
	step,
	stepMultiplier,
	orientation,
	throttle,
	previewTimeThrottle,
	userSeekingThrottle,
	noPreviewTrack,
	noPreviewClamp,
	// Scrubber Events
	onVdsScrubberPreviewShow,
	onVdsScrubberPreviewHide,
	onVdsScrubberPreviewTimeUpdate,
	// Media Request Events
	onVdsSeekRequest,
	onVdsSeekingRequest
}) {
	return html`
		<vds-media-controller
			.canPlay="${true}"
			.currentTime="${fakeCurrentTime}"
			.duration="${fakeDuration}"
			.seekable="${createTimeRanges(0, fakeSeekableAmount)}"
		>
			<vds-media-container>
				<vds-fake-media-provider slot="media"></vds-fake-media-provider>

				<vds-scrubber
					slider-label="${ifNonEmpty(sliderLabel)}"
					progress-label="${ifNonEmpty(progressLabel)}"
					progress-text="${ifNonEmpty(progressText)}"
					?hidden="${hidden}"
					?disabled="${disabled}"
					step="${step}"
					step-multiplier="${stepMultiplier}"
					orientation="${orientation}"
					?no-preview-track="${noPreviewTrack}"
					?no-preview-clamp="${noPreviewClamp}"
					throttle="${throttle}"
					preview-time-throttle="${previewTimeThrottle}"
					user-seeking-throttle="${userSeekingThrottle}"
					@vds-seek-request="${onVdsSeekRequest}"
					@vds-seeking-request="${onVdsSeekingRequest}"
					@vds-scrubber-preview-show="${onVdsScrubberPreviewShow}"
					@vds-scrubber-preview-hide="${onVdsScrubberPreviewHide}"
					@vds-scrubber-preview-time-update="${onVdsScrubberPreviewTimeUpdate}"
				>
					<div class="preview" slot="preview">Preview</div>
				</vds-scrubber>
			</vds-media-container>
		</vds-media-controller>

		<style>
			vds-scrubber {
				margin-top: 48px;
			}

			.preview {
				background-color: #161616;
				color: #ff2a5d;
				opacity: 1;
				position: absolute;
				left: 0;
				bottom: 40px;
				transition: opacity 0.3s ease-in;
			}

			.preview[hidden] {
				opacity: 0;
			}
		</style>
	`;
}

export const Scrubber = Template.bind({});
