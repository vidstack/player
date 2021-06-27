import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

import {
  VDS_HLS_ELEMENT_STORYBOOK_ARG_TYPES,
  VDS_HLS_ELEMENT_TAG_NAME
} from './HlsElement.js';

export default {
  title: 'UI/Providers/HLS',
  component: VDS_HLS_ELEMENT_TAG_NAME,
  argTypes: VDS_HLS_ELEMENT_STORYBOOK_ARG_TYPES
};

/**
 * @param {import('./types.js').HlsElementStorybookArgs} args
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
  onVdsWaiting,
  /// HLS Properties,
  hlsConfig,
  // HLS Events
  onVdsHlsEngineAttach,
  onVdsHlsEngineBuilt,
  onVdsHlsEngineDetach,
  onVdsHlsEngineNoSupport
}) {
  return html`
    <vds-hls
      width=${ifDefined(width)}
      volume=${volume}
      src=${src}
      preload=${ifDefined(preload)}
      poster=${ifDefined(poster)}
      height=${ifDefined(height)}
      current-time=${currentTime}
      cross-origin=${ifDefined(crossOrigin)}
      controls-list=${ifDefined(controlsList)}
      .hls-config=${hlsConfig}
      ?autoplay=${autoplay}
      ?playsinline=${playsinline}
      ?paused=${paused}
      ?muted=${muted}
      ?loop=${loop}
      ?disable-remote-playback=${disableRemotePlayback}
      ?disable-pip=${disablePiP}
      ?controls=${controls}
      ?auto-pip=${autoPiP}
      @vds-media-provider-connect=${onVdsMediaProviderConnect}
      @vds-abort=${onVdsAbort}
      @vds-can-play=${onVdsCanPlay}
      @vds-can-play-through=${onVdsCanPlayThrough}
      @vds-duration-change=${onVdsDurationChange}
      @vds-emptied=${onVdsEmptied}
      @vds-ended=${onVdsEnded}
      @vds-error=${onVdsError}
      @vds-fullscreen-change=${onVdsFullscreenChange}
      @vds-loaded-data=${onVdsLoadedData}
      @vds-load-start=${onVdsLoadStart}
      @vds-loaded-metadata=${onVdsLoadedMetadata}
      @vds-media-type-change=${onVdsMediaTypeChange}
      @vds-pause=${onVdsPause}
      @vds-play=${onVdsPlay}
      @vds-playing=${onVdsPlaying}
      @vds-progress=${onVdsProgress}
      @vds-seeked=${onVdsSeeked}
      @vds-seeking=${onVdsSeeking}
      @vds-stalled=${onVdsStalled}
      @vds-started=${onVdsStarted}
      @vds-suspend=${onVdsSuspend}
      @vds-replay=${onVdsReplay}
      @vds-time-update=${onVdsTimeUpdate}
      @vds-view-type-change=${onVdsViewTypeChange}
      @vds-volume-change=${onVdsVolumeChange}
      @vds-waiting=${onVdsWaiting}
      @vds-hls-engine-built=${onVdsHlsEngineBuilt}
      @vds-hls-engine-attach=${onVdsHlsEngineAttach}
      @vds-hls-engine-detach=${onVdsHlsEngineDetach}
      @vds-hls-engine-no-support=${onVdsHlsEngineNoSupport}
    ></vds-hls>
  `;
}

export const HLS = Template.bind({});
