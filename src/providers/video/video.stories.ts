import './vds-video';

import { html } from 'lit-element';
import { ifDefined } from 'lit-html/directives/if-defined';

import { Story } from '../../shared/storybook';
import { VIDEO_ARG_TYPES, VideoArgTypes } from './video.args';

export default {
  title: 'Providers/Video',
  component: 'vds-video',
  argTypes: VIDEO_ARG_TYPES,
};

const Template: Story<VideoArgTypes> = ({
  width,
  height,
  aspectRatio,
  src,
  poster,
  paused,
  volume,
  currentTime,
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
  onConnect,
  onDisconnect,
  onPause,
  onPlay,
  onPlaying,
  onPosterChange,
  onMutedChange,
  onVolumeChange,
  onTimeChange,
  onDurationChange,
  onBufferedChange,
  onBufferingChange,
  onViewTypeChange,
  onMediaTypeChange,
  onPlaybackReady,
  onPlaybackStart,
  onPlaybackEnd,
  onReplay,
  onError,
}) =>
  html`
    <vds-video
      src="${src}"
      width="${width}"
      height="${height}"
      aspect-ratio="${aspectRatio}"
      poster="${poster}"
      ?paused="${paused}"
      volume="${volume}"
      current-time="${currentTime}"
      ?muted="${muted}"
      ?playsinline="${playsinline}"
      ?loop="${loop}"
      ?controls="${controls}"
      cross-origin="${crossOrigin}"
      preload="${preload}"
      controls-list="${ifDefined(controlsList)}"
      ?auto-pip="${autoPiP}"
      ?disable-pip="${disablePiP}"
      ?disable-remote-playback="${disableRemotePlayback}"
      @vds-connect="${onConnect}"
      @vds-disconnect="${onDisconnect}"
      @vds-pause="${onPause}"
      @vds-play="${onPlay}"
      @vds-playing="${onPlaying}"
      @vds-poster-change="${onPosterChange}"
      @vds-muted-change="${onMutedChange}"
      @vds-volume-change="${onVolumeChange}"
      @vds-time-change="${onTimeChange}"
      @vds-duration-change="${onDurationChange}"
      @vds-buffered-change="${onBufferedChange}"
      @vds-buffering-change="${onBufferingChange}"
      @vds-view-type-change="${onViewTypeChange}"
      @vds-media-type-change="${onMediaTypeChange}"
      @vds-playback-ready="${onPlaybackReady}"
      @vds-playback-start="${onPlaybackStart}"
      @vds-playback-end="${onPlaybackEnd}"
      @vds-replay="${onReplay}"
      @vds-error="${onError}"
    ></vds-video>
  `;

export const Video = Template.bind({});
