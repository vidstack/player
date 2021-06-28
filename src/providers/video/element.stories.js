import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

import {
  VIDEO_ELEMENT_STORYBOOK_ARG_TYPES,
  VIDEO_ELEMENT_TAG_NAME
} from './VideoElement.js';

export default {
  title: 'UI/Providers/Video',
  component: VIDEO_ELEMENT_TAG_NAME,
  argTypes: VIDEO_ELEMENT_STORYBOOK_ARG_TYPES
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
  onWaiting
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
      @vds-waiting=${onWaiting}
      @vds-volume-change=${onVolumeChange}
      @vds-view-type-change=${onViewTypeChange}
      @vds-time-update=${onTimeUpdate}
      @vds-suspend=${onSuspend}
      @vds-started=${onStarted}
      @vds-stalled=${onStalled}
      @vds-seeking=${onSeeking}
      @vds-seeked=${onSeeked}
      @vds-replay=${onReplay}
      @vds-progress=${onProgress}
      @vds-playing=${onPlaying}
      @vds-play=${onPlay}
      @vds-pause=${onPause}
      @vds-media-type-change=${onMediaTypeChange}
      @vds-media-provider-connect=${onMediaProviderConnect}
      @vds-loaded-metadata=${onLoadedMetadata}
      @vds-loaded-data=${onLoadedData}
      @vds-load-start=${onLoadStart}
      @vds-fullscreen-change=${onFullscreenChange}
      @vds-error=${onError}
      @vds-ended=${onEnded}
      @vds-emptied=${onEmptied}
      @vds-duration-change=${onDurationChange}
      @vds-can-play=${onCanPlay}
      @vds-can-play-through=${onCanPlayThrough}
      @vds-abort=${onAbort}
    ></vds-video>
  `;
}

export const Video = Template.bind({});
