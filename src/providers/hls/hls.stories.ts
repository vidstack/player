import './vds-hls';

import { html } from 'lit-element';
import { ifDefined } from 'lit-html/directives/if-defined';

import { ifNonEmpty } from '../../shared/directives/if-non-empty';
import { Story } from '../../shared/storybook';
import { HLS_ARG_TYPES, HlsArgTypes } from './hls.args';

export default {
  title: 'Providers/Hls',
  component: 'vds-hls',
  argTypes: HLS_ARG_TYPES,
};

const Template: Story<HlsArgTypes> = ({
  width,
  height,
  aspectRatio,
  src,
  libSrc,
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
    <vds-hls
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
      lib-src="${ifNonEmpty(libSrc)}"
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
    ></vds-hls>
  `;

export const Hls = Template.bind({});
