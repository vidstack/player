import * as FullscreenEvents from '../../base/fullscreen/events';
import type { Values } from '../../global/helpers';
import * as MediaEvents from '../events';

export type MediaMachineEventPayload = {
  'autoplay-change': MediaEvents.AutoplayChangeEvent;
  'autoplay-fail': MediaEvents.AutoplayFailEvent;
  'can-play': MediaEvents.CanPlayEvent | MediaEvents.CanPlayThroughEvent;
  'controls-change': MediaEvents.ControlsChangeEvent;
  'fullscreen-change': FullscreenEvents.FullscreenChangeEvent;
  'fullscreen-support-change': FullscreenEvents.FullscreenSupportChange;
  'loop-change': MediaEvents.LoopChangeEvent;
  'play-fail': MediaEvents.PlayFailEvent;
  'playsinline-change': MediaEvents.PlaysinlineChangeEvent;
  'poster-change': MediaEvents.PosterChangeEvent;
  'src-change': MediaEvents.SrcChangeEvent;
  'time-update': MediaEvents.TimeUpdateEvent;
  'volume-change': MediaEvents.VolumeChangeEvent;
  abort: { error: unknown };
  autoplay: MediaEvents.AutoplayEvent;
  ended: MediaEvents.EndedEvent;
  error: MediaEvents.ErrorEvent;
  loaded: MediaEvents.LoadedMetadataEvent;
  loading: MediaEvents.LoadStartEvent;
  pause: MediaEvents.PauseEvent | MediaEvents.SeekedEvent;
  play: MediaEvents.PlayEvent;
  playing: MediaEvents.PlayingEvent;
  progress: MediaEvents.ProgressEvent;
  seeking: MediaEvents.SeekingEvent;
  waiting: MediaEvents.WaitingEvent;
};

export type MediaMachineEventType = keyof MediaMachineEventPayload;

export type MediaMachineEvents = Values<{
  [EventType in MediaMachineEventType]: {
    type: EventType;
    trigger: MediaMachineEventPayload[EventType];
  };
}>;
