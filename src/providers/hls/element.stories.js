import './define.js';

import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

import { ifNonEmpty, on } from '../../foundation/directives/index.js';
import { FullscreenChangeEvent } from '../../foundation/fullscreen/index.js';
import {
  storybookAction,
  StorybookControl
} from '../../foundation/storybook/index.js';
import {
  AbortEvent,
  CanPlayEvent,
  CanPlayThroughEvent,
  DurationChangeEvent,
  EmptiedEvent,
  EndedEvent,
  ErrorEvent,
  LoadedDataEvent,
  LoadedMetadataEvent,
  LoadStartEvent,
  MediaProviderConnectEvent,
  MediaTypeChangeEvent,
  PauseEvent,
  PlayEvent,
  PlayingEvent,
  ProgressEvent,
  ReplayEvent,
  SeekedEvent,
  SeekingEvent,
  StalledEvent,
  StartedEvent,
  SuspendEvent,
  TimeUpdateEvent,
  ViewTypeChangeEvent,
  VolumeChangeEvent,
  WaitingEvent
} from '../../media/index.js';
import { VIDEO_ELEMENT_STORYBOOK_ARG_TYPES } from '../video/element.stories.js';
import {
  HlsAttachEvent,
  HlsBuildEvent,
  HlsDetachEvent,
  HlsNoSupportEvent
} from './events.js';
import { HLS_ELEMENT_TAG_NAME } from './HlsElement.js';

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
  onHlsEngineAttach: storybookAction(HlsAttachEvent.TYPE),
  onHlsEngineBuilt: storybookAction(HlsBuildEvent.TYPE),
  onHlsEngineDetach: storybookAction(HlsDetachEvent.TYPE),
  onHlsEngineNoSupport: storybookAction(HlsNoSupportEvent.TYPE)
};

export default {
  title: 'Providers/HLS',
  component: HLS_ELEMENT_TAG_NAME,
  argTypes: HLS_ELEMENT_STORYBOOK_ARG_TYPES,
  excludeStories: /.*STORYBOOK_ARG_TYPES$/
};

/**
 * @param {any} args
 * @returns {import('lit').TemplateResult}
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
      ${on(AbortEvent.TYPE, onAbort)}
      ${on(CanPlayEvent.TYPE, onCanPlay)}
      ${on(CanPlayThroughEvent.TYPE, onCanPlayThrough)}
      ${on(DurationChangeEvent.TYPE, onDurationChange)}
      ${on(EmptiedEvent.TYPE, onEmptied)}
      ${on(EndedEvent.TYPE, onEnded)}
      ${on(ErrorEvent.TYPE, onError)}
      ${on(FullscreenChangeEvent.TYPE, onFullscreenChange)}
      ${on(LoadedDataEvent.TYPE, onLoadedData)}
      ${on(LoadedMetadataEvent.TYPE, onLoadedMetadata)}
      ${on(LoadStartEvent.TYPE, onLoadStart)}
      ${on(MediaProviderConnectEvent.TYPE, onMediaProviderConnect)}
      ${on(MediaTypeChangeEvent.TYPE, onMediaTypeChange)}
      ${on(PauseEvent.TYPE, onPause)}
      ${on(PlayEvent.TYPE, onPlay)}
      ${on(PlayingEvent.TYPE, onPlaying)}
      ${on(ProgressEvent.TYPE, onProgress)}
      ${on(ReplayEvent.TYPE, onReplay)}
      ${on(SeekedEvent.TYPE, onSeeked)}
      ${on(SeekingEvent.TYPE, onSeeking)}
      ${on(StalledEvent.TYPE, onStalled)}
      ${on(StartedEvent.TYPE, onStarted)}
      ${on(SuspendEvent.TYPE, onSuspend)}
      ${on(TimeUpdateEvent.TYPE, onTimeUpdate)}
      ${on(ViewTypeChangeEvent.TYPE, onViewTypeChange)}
      ${on(VolumeChangeEvent.TYPE, onVolumeChange)}
      ${on(WaitingEvent.TYPE, onWaiting)}
      ${on(HlsBuildEvent.TYPE, onHlsEngineBuilt)}
      ${on(HlsAttachEvent.TYPE, onHlsEngineAttach)}
      ${on(HlsDetachEvent.TYPE, onHlsEngineDetach)}
      ${on(HlsNoSupportEvent.TYPE, onHlsEngineNoSupport)}
    ></vds-hls>
  `;
}

export const HLS = Template.bind({});
