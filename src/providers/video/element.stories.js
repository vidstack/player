import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

import {
	VDS_VIDEO_ELEMENT_STORYBOOK_ARG_TYPES,
	VDS_VIDEO_ELEMENT_TAG_NAME
} from './VideoElement.js';

export default {
	title: 'UI/Providers/Video',
	component: VDS_VIDEO_ELEMENT_TAG_NAME,
	argTypes: VDS_VIDEO_ELEMENT_STORYBOOK_ARG_TYPES
};

/**
 * @param {import('./types.js').VideoElementStorybookArgs} args
 */
function Template({
	// Properties
	autoplay,
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
	controls = true,
	crossOrigin,
	preload,
	controlsList,
	autoPiP,
	disablePiP,
	disableRemotePlayback,
	// Media Provider Actions
	onVdsMediaProviderConnect,
	// Media Actions
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
			width=${ifDefined(width)}
			volume=${volume}
			src=${src}
			preload=${ifDefined(preload)}
			poster=${ifDefined(poster)}
			height=${ifDefined(height)}
			current-time=${currentTime}
			crossorigin=${ifDefined(crossOrigin)}
			controlslist=${ifDefined(controlsList)}
			?playsinline=${playsinline}
			?paused=${paused}
			?muted=${muted}
			?loop=${loop}
			?disableremoteplayback=${disableRemotePlayback}
			?disablepictureinpicture=${disablePiP}
			?controls=${controls}
			?autoplay=${autoplay}
			?autopictureinpicture=${autoPiP}
			@vds-waiting=${onVdsWaiting}
			@vds-volume-change=${onVdsVolumeChange}
			@vds-view-type-change=${onVdsViewTypeChange}
			@vds-time-update=${onVdsTimeUpdate}
			@vds-suspend=${onVdsSuspend}
			@vds-started=${onVdsStarted}
			@vds-stalled=${onVdsStalled}
			@vds-seeking=${onVdsSeeking}
			@vds-seeked=${onVdsSeeked}
			@vds-replay=${onVdsReplay}
			@vds-progress=${onVdsProgress}
			@vds-playing=${onVdsPlaying}
			@vds-play=${onVdsPlay}
			@vds-pause=${onVdsPause}
			@vds-media-type-change=${onVdsMediaTypeChange}
			@vds-media-provider-connect=${onVdsMediaProviderConnect}
			@vds-loaded-metadata=${onVdsLoadedMetadata}
			@vds-loaded-data=${onVdsLoadedData}
			@vds-load-start=${onVdsLoadStart}
			@vds-fullscreen-change=${onVdsFullscreenChange}
			@vds-error=${onVdsError}
			@vds-ended=${onVdsEnded}
			@vds-emptied=${onVdsEmptied}
			@vds-duration-change=${onVdsDurationChange}
			@vds-can-play=${onVdsCanPlay}
			@vds-can-play-through=${onVdsCanPlayThrough}
			@vds-abort=${onVdsAbort}
		></vds-video>
	`;
}

export const Video = Template.bind({});
