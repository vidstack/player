import { FullscreenChangeEvent } from '../../foundation/fullscreen/events.js';
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
} from '../events.js';
import { MediaProviderConnectEvent } from './MediaProviderElement.js';

export const MEDIA_PROVIDER_ELEMENT_STORYBOOK_ARG_TYPES = {
  // Properties
  autoplay: { control: false },
  controls: { control: StorybookControl.Boolean, defaultValue: true },
  currentTime: { control: StorybookControl.Number, defaultValue: 0 },
  loop: { control: StorybookControl.Boolean },
  muted: { control: StorybookControl.Boolean },
  paused: { control: StorybookControl.Boolean, defaultValue: true },
  playsinline: { control: StorybookControl.Boolean },
  volume: {
    control: {
      type: StorybookControl.Number,
      step: 0.05
    },
    defaultValue: 0.5
  },
  // Media Actions
  onAbort: storybookAction(AbortEvent.TYPE),
  onCanPlay: storybookAction(CanPlayEvent.TYPE),
  onCanPlayThrough: storybookAction(CanPlayThroughEvent.TYPE),
  onDurationChange: storybookAction(DurationChangeEvent.TYPE),
  onEmptied: storybookAction(EmptiedEvent.TYPE),
  onEnded: storybookAction(EndedEvent.TYPE),
  onError: storybookAction(ErrorEvent.TYPE),
  onFullscreenChange: storybookAction(FullscreenChangeEvent.TYPE),
  onLoadedData: storybookAction(LoadedDataEvent.TYPE),
  onLoadedMetadata: storybookAction(LoadedMetadataEvent.TYPE),
  onLoadStart: storybookAction(LoadStartEvent.TYPE),
  onMediaTypeChange: storybookAction(MediaTypeChangeEvent.TYPE),
  onPause: storybookAction(PauseEvent.TYPE),
  onPlay: storybookAction(PlayEvent.TYPE),
  onPlaying: storybookAction(PlayingEvent.TYPE),
  onProgress: storybookAction(ProgressEvent.TYPE),
  onReplay: storybookAction(ReplayEvent.TYPE),
  onSeeked: storybookAction(SeekedEvent.TYPE),
  onSeeking: storybookAction(SeekingEvent.TYPE),
  onStalled: storybookAction(StalledEvent.TYPE),
  onStarted: storybookAction(StartedEvent.TYPE),
  onSuspend: storybookAction(SuspendEvent.TYPE),
  onTimeUpdate: storybookAction(TimeUpdateEvent.TYPE),
  onViewTypeChange: storybookAction(ViewTypeChangeEvent.TYPE),
  onVolumeChange: storybookAction(VolumeChangeEvent.TYPE),
  onWaiting: storybookAction(WaitingEvent.TYPE),
  // Media Provider Actions
  onMediaProviderConnect: storybookAction(MediaProviderConnectEvent.TYPE)
};
