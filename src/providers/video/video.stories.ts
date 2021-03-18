import { html } from 'lit-element';
import { ifDefined } from 'lit-html/directives/if-defined';

import { Story } from '../../shared/storybook';
import { VIDEO_TAG_NAME } from './vds-video';
import { VIDEO_PROVIDER_STORYBOOK_ARG_TYPES } from './video.args';
import { VideoProviderActions, VideoProviderProps } from './video.types';

export default {
  title: 'Providers/Video',
  component: VIDEO_TAG_NAME,
  argTypes: VIDEO_PROVIDER_STORYBOOK_ARG_TYPES,
};

const Template: Story<VideoProviderProps & VideoProviderActions> = ({
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
}) =>
  html`
    <vds-video
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
      crossorigin="${ifDefined(crossOrigin)}"
      preload="${ifDefined(preload)}"
      controlslist="${ifDefined(controlsList)}"
      ?autopictureinpicture="${autoPiP}"
      ?disablepictureinpicture="${disablePiP}"
      ?disableremoteplayback="${disableRemotePlayback}"
      @vds-abort="${onAbort}"
      @vds-canplay="${onCanPlay}"
      @vds-canplaythrough="${onCanPlayThrough}"
      @vds-connect="${onConnect}"
      @vds-disconnect="${onDisconnect}"
      @vds-durationchange="${onDurationChange}"
      @vds-emptied="${onEmptied}"
      @vds-ended="${onEnded}"
      @vds-error="${onError}"
      @vds-fullscreenchange="${onFullscreenChange}"
      @vds-loadeddata="${onLoadedData}"
      @vds-loadstart="${onLoadStart}"
      @vds-loadedmetadata="${onLoadedMetadata}"
      @vds-mediatypechange="${onMediaTypeChange}"
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
      @vds-timeupdate="${onTimeUpdate}"
      @vds-viewtypechange="${onViewTypeChange}"
      @vds-volumechange="${onVolumeChange}"
      @vds-waiting="${onWaiting}"
    ></vds-video>
  `;

export const Video = Template.bind({});
