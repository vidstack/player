import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

import {
  HLS_ELEMENT_STORYBOOK_ARG_TYPES,
  HLS_ELEMENT_TAG_NAME
} from './HlsElement.js';

export default {
  title: 'UI/Providers/HLS',
  component: HLS_ELEMENT_TAG_NAME,
  argTypes: HLS_ELEMENT_STORYBOOK_ARG_TYPES
};

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
  onMediaProviderConnect,
  // Media Actions
  onAbort,
  onCanPlay,
  onCanPlayThrough,
  onDurationChange,
  onEmptied,
  onEnded,
  onError,
  onFullscreenChange,
  onLoadedData,
  onLoadedMetadata,
  onLoadStart,
  onMediaTypeChange,
  onPause,
  onPlay,
  onPlaying,
  onProgress,
  onSeeked,
  onSeeking,
  onStalled,
  onStarted,
  onSuspend,
  onReplay,
  onTimeUpdate,
  onViewTypeChange,
  onVolumeChange,
  onWaiting,
  /// HLS Properties,
  hlsConfig,
  // HLS Events
  onHlsEngineAttach,
  onHlsEngineBuilt,
  onHlsEngineDetach,
  onHlsEngineNoSupport
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
      @vds-media-provider-connect=${onMediaProviderConnect}
      @vds-abort=${onAbort}
      @vds-can-play=${onCanPlay}
      @vds-can-play-through=${onCanPlayThrough}
      @vds-duration-change=${onDurationChange}
      @vds-emptied=${onEmptied}
      @vds-ended=${onEnded}
      @vds-error=${onError}
      @vds-fullscreen-change=${onFullscreenChange}
      @vds-loaded-data=${onLoadedData}
      @vds-load-start=${onLoadStart}
      @vds-loaded-metadata=${onLoadedMetadata}
      @vds-media-type-change=${onMediaTypeChange}
      @vds-pause=${onPause}
      @vds-play=${onPlay}
      @vds-playing=${onPlaying}
      @vds-progress=${onProgress}
      @vds-seeked=${onSeeked}
      @vds-seeking=${onSeeking}
      @vds-stalled=${onStalled}
      @vds-started=${onStarted}
      @vds-suspend=${onSuspend}
      @vds-replay=${onReplay}
      @vds-time-update=${onTimeUpdate}
      @vds-view-type-change=${onViewTypeChange}
      @vds-volume-change=${onVolumeChange}
      @vds-waiting=${onWaiting}
      @vds-hls-engine-built=${onHlsEngineBuilt}
      @vds-hls-engine-attach=${onHlsEngineAttach}
      @vds-hls-engine-detach=${onHlsEngineDetach}
      @vds-hls-engine-no-support=${onHlsEngineNoSupport}
    ></vds-hls>
  `;
}

export const HLS = Template.bind({});
