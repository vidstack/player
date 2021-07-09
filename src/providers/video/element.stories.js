import './define.js';

import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

import { on } from '../../foundation/directives/index.js';
import { FullscreenChangeEvent } from '../../foundation/fullscreen/index.js';
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
import {
  VIDEO_ELEMENT_STORYBOOK_ARG_TYPES,
  VIDEO_ELEMENT_TAG_NAME
} from './VideoElement.js';

export default {
  title: 'Providers/Video',
  component: VIDEO_ELEMENT_TAG_NAME,
  argTypes: VIDEO_ELEMENT_STORYBOOK_ARG_TYPES
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
    ></vds-video>
  `;
}

export const Video = Template.bind({});
