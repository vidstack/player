import './define';

import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

import { ifNonEmpty, on } from '../../base/directives';
import { storybookAction, StorybookControl } from '../../base/storybook';
import { VIDEO_ELEMENT_STORYBOOK_ARG_TYPES } from '../video/element.stories';
import { HLS_ELEMENT_TAG_NAME } from './HlsElement';

export const HLS_ELEMENT_STORYBOOK_ARG_TYPES = {
  ...VIDEO_ELEMENT_STORYBOOK_ARG_TYPES,
  hlsConfig: { control: StorybookControl.Object },
  hlsLibrary: {
    control: StorybookControl.Text,
    defaultValue: 'https://cdn.jsdelivr.net/npm/hls.js@0.14.7/dist/hls.js'
  },
  src: {
    control: StorybookControl.Text,
    defaultValue:
      'https://stream.mux.com/dGTf2M5TBA5ZhXvwEIOziAHBhF2Rn00jk79SZ4gAFPn8.m3u8'
  },
  onHlsAttach: storybookAction('vds-hls-attach'),
  onHlsBuild: storybookAction('vds-hls-build'),
  onHlsDetach: storybookAction('vds-hls-detach'),
  onHlsLoad: storybookAction('vds-hls-load'),
  onHlsLoadError: storybookAction('vds-hls-load-error'),
  onHlsNoSupport: storybookAction('vds-hls-no-support')
};

export default {
  title: 'Providers/HLS',
  component: HLS_ELEMENT_TAG_NAME,
  argTypes: HLS_ELEMENT_STORYBOOK_ARG_TYPES,
  excludeStories: /.*STORYBOOK_ARG_TYPES$/
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
  hlsLibrary,
  // HLS Events
  onHlsAttach,
  onHlsBuild,
  onHlsDetach,
  onHlsLoad,
  onHlsLoadError,
  onHlsNoSupport
}: any) {
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
      hls-library=${ifNonEmpty(hlsLibrary)}
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
      ${on('vds-abort', onAbort)}
      ${on('vds-can-play', onCanPlay)}
      ${on('vds-can-play-through', onCanPlayThrough)}
      ${on('vds-duration-change', onDurationChange)}
      ${on('vds-emptied', onEmptied)}
      ${on('vds-ended', onEnded)}
      ${on('vds-error', onError)}
      ${on('vds-fullscreen-change', onFullscreenChange)}
      ${on('vds-loaded-data', onLoadedData)}
      ${on('vds-loaded-metadata', onLoadedMetadata)}
      ${on('vds-load-start', onLoadStart)}
      ${on('vds-media-provider-connect', onMediaProviderConnect)}
      ${on('vds-media-type-change', onMediaTypeChange)}
      ${on('vds-pause', onPause)}
      ${on('vds-play', onPlay)}
      ${on('vds-playing', onPlaying)}
      ${on('vds-progress', onProgress)}
      ${on('vds-replay', onReplay)}
      ${on('vds-seeked', onSeeked)}
      ${on('vds-seeking', onSeeking)}
      ${on('vds-stalled', onStalled)}
      ${on('vds-started', onStarted)}
      ${on('vds-suspend', onSuspend)}
      ${on('vds-time-update', onTimeUpdate)}
      ${on('vds-view-type-change', onViewTypeChange)}
      ${on('vds-volume-change', onVolumeChange)}
      ${on('vds-waiting', onWaiting)}
      ${on('vds-hls-build', onHlsBuild)}
      ${on('vds-hls-attach', onHlsAttach)}
      ${on('vds-hls-detach', onHlsDetach)}
      ${on('vds-hls-load', onHlsLoad)}
      ${on('vds-hls-load-error', onHlsLoadError)}
      ${on('vds-hls-no-support', onHlsNoSupport)}
    ></vds-hls>
  `;
}

export const HLS = Template.bind({});
