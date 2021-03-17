import { html } from 'lit-element';
import { ifDefined } from 'lit-html/directives/if-defined';

import { ifNonEmpty } from '../../shared/directives/if-non-empty';
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
  libSrc,
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
      lib-src="${ifNonEmpty(libSrc)}"
      controls-list="${ifDefined(controlsList)}"
      ?auto-pip="${autoPiP}"
      ?disable-pip="${disablePiP}"
      ?disable-remote-playback="${disableRemotePlayback}"
      @vds-abort="${onAbort}"
      @vds-canplay="${onCanPlay}"
      @vds-canplaythrough="${onCanPlayThrough}"
      @vds-connect="${onConnect}"
      @vds-disconnect="${onDisconnect}"
      @vds-durationchange="${onDurationChange}"
      @vds-emptied="${onEmptied}"
      @vds-ended="${onEnded}"
      @vds-error="${onError}"
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
      @vds-hlsenginebuilt="${onEngineBuilt}"
      @vds-hlsengineattach="${onEngineAttach}"
      @vds-hlsenginedetach="${onEngineDetach}"
      @vds-hlsenginenosupport="${onEngineNoSupport}"
    ></vds-hls>
  `;

export const Hls = Template.bind({});
