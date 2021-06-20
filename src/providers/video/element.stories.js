import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

import { VDS_VIDEO_ELEMENT_TAG_NAME } from './VideoElement.js';

export default {
	title: 'UI/Providers/Video',
	component: VDS_VIDEO_ELEMENT_TAG_NAME,
	argTypes: {
		src: {
			defaultValue:
				'https://stream.mux.com/dGTf2M5TBA5ZhXvwEIOziAHBhF2Rn00jk79SZ4gAFPn8/medium.mp4'
		},
		poster: {
			defaultValue: 'https://media-files.vidstack.io/poster.png'
		}
	}
};

function Template({
	// Props
	width,
	height,
	src,
	poster,
	paused,
	volume,
	currentTime = 0,
	muted,
	playsinline,
	loop,
	controls,
	crossOrigin,
	preload,
	controlsList,
	autoPiP,
	disablePiP,
	disableRemotePlayback,
	// Media Provider Events
	onVdsMediaProviderConnect,
	// Media Events
	onVdsAbort,
	onVdsCanPlay,
	onVdsCanPlayThrough,
	onVdsDurationChange,
	onVdsEmptied,
	onVdsEnded,
	onVdsError,
	onVdsFullscreenChange,
	onVdsLoadedData,
	onVdsLoadedMetadata,
	onVdsLoadStart,
	onVdsMediaTypeChange,
	onVdsPause,
	onVdsPlay,
	onVdsPlaying,
	onVdsProgress,
	onVdsSeeked,
	onVdsSeeking,
	onVdsStalled,
	onVdsStarted,
	onVdsSuspend,
	onVdsReplay,
	onVdsTimeUpdate,
	onVdsViewTypeChange,
	onVdsVolumeChange,
	onVdsWaiting
}) {
	return html`
		<vds-video
			src="${src}"
			width="${ifDefined(width)}"
			height="${ifDefined(height)}"
			poster="${ifDefined(poster)}"
			?paused="${paused}"
			volume="${volume}"
			current-time="${currentTime}"
			?muted="${muted}"
			?playsinline="${playsinline}"
			?loop="${loop}"
			?controls="${controls}"
			crossorigin="${ifDefined(crossOrigin)}"
			preload="${ifDefined(preload)}"
			controlslist="${ifDefined(controlsList)}"
			?autopictureinpicture="${autoPiP}"
			?disablepictureinpicture="${disablePiP}"
			?disableremoteplayback="${disableRemotePlayback}"
			@vds-media-provider-connect="${onVdsMediaProviderConnect}"
			@vds-abort="${onVdsAbort}"
			@vds-can-play="${onVdsCanPlay}"
			@vds-can-play-through="${onVdsCanPlayThrough}"
			@vds-duration-change="${onVdsDurationChange}"
			@vds-emptied="${onVdsEmptied}"
			@vds-ended="${onVdsEnded}"
			@vds-error="${onVdsError}"
			@vds-fullscreen-change="${onVdsFullscreenChange}"
			@vds-loaded-data="${onVdsLoadedData}"
			@vds-load-start="${onVdsLoadStart}"
			@vds-loaded-metadata="${onVdsLoadedMetadata}"
			@vds-media-type-change="${onVdsMediaTypeChange}"
			@vds-pause="${onVdsPause}"
			@vds-play="${onVdsPlay}"
			@vds-playing="${onVdsPlaying}"
			@vds-progress="${onVdsProgress}"
			@vds-seeked="${onVdsSeeked}"
			@vds-seeking="${onVdsSeeking}"
			@vds-stalled="${onVdsStalled}"
			@vds-started="${onVdsStarted}"
			@vds-suspend="${onVdsSuspend}"
			@vds-replay="${onVdsReplay}"
			@vds-time-update="${onVdsTimeUpdate}"
			@vds-view-type-change="${onVdsViewTypeChange}"
			@vds-volume-change="${onVdsVolumeChange}"
			@vds-waiting="${onVdsWaiting}"
		></vds-video>
	`;
}

export const Video = Template.bind({});
