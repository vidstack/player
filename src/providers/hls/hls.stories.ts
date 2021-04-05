import { html } from 'lit-element';
import { ifDefined } from 'lit-html/directives/if-defined';

import { Story } from '../../shared/storybook';
import { HLS_PROVIDER_STORYBOOK_ARG_TYPES } from './hls.args';
import { HlsProviderActions, HlsProviderProps } from './hls.types';
import { HLS_TAG_NAME } from './vds-hls';

export default {
  title: 'Providers/Hls',
  component: HLS_TAG_NAME,
  argTypes: HLS_PROVIDER_STORYBOOK_ARG_TYPES,
};

const Template: Story<HlsProviderProps & HlsProviderActions> = ({
  width,
  height,
  aspectRatio,
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
  onAbort,
  onCanPlay,
  onCanPlayThrough,
  onConnect,
  onDisconnect,
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
  onEngineBuilt,
  onEngineAttach,
  onEngineDetach,
  onEngineNoSupport,
}) =>
  html`
    <vds-hls
      src="${src}"
      width="${ifDefined(width)}"
      height="${ifDefined(height)}"
      aspect-ratio="${ifDefined(aspectRatio)}"
      poster="${ifDefined(poster)}"
      ?paused="${paused}"
      volume="${volume}"
      current-time="${currentTime}"
      ?muted="${muted}"
      ?playsinline="${playsinline}"
      ?loop="${loop}"
      ?controls="${controls}"
      cross-origin="${ifDefined(crossOrigin)}"
      preload="${ifDefined(preload)}"
      controls-list="${ifDefined(controlsList)}"
      ?auto-pip="${autoPiP}"
      ?disable-pip="${disablePiP}"
      ?disable-remote-playback="${disableRemotePlayback}"
      @vds-abort="${onAbort}"
      @vds-can-play="${onCanPlay}"
      @vds-can-play-through="${onCanPlayThrough}"
      @vds-connect="${onConnect}"
      @vds-disconnect="${onDisconnect}"
      @vds-duration-change="${onDurationChange}"
      @vds-emptied="${onEmptied}"
      @vds-ended="${onEnded}"
      @vds-error="${onError}"
      @vds-fullscreen-change="${onFullscreenChange}"
      @vds-loaded-data="${onLoadedData}"
      @vds-load-start="${onLoadStart}"
      @vds-loaded-metadata="${onLoadedMetadata}"
      @vds-media-type-change="${onMediaTypeChange}"
      @vds-pause="${onPause}"
      @vds-play="${onPlay}"
      @vds-playing="${onPlaying}"
      @vds-progress="${onProgress}"
      @vds-seeked="${onSeeked}"
      @vds-seeking="${onSeeking}"
      @vds-stalled="${onStalled}"
      @vds-started="${onStarted}"
      @vds-suspend="${onSuspend}"
      @vds-replay="${onReplay}"
      @vds-time-update="${onTimeUpdate}"
      @vds-view-type-change="${onViewTypeChange}"
      @vds-volume-change="${onVolumeChange}"
      @vds-waiting="${onWaiting}"
      @vds-hls-engine-built="${onEngineBuilt}"
      @vds-hls-engine-attach="${onEngineAttach}"
      @vds-hls-engine-detach="${onEngineDetach}"
      @vds-hls-engine-no-support="${onEngineNoSupport}"
    ></vds-hls>
  `;

export const Hls = Template.bind({});
