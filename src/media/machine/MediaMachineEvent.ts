import type { Values } from '../../global/helpers';
import * as MediaEvents from '../events';
import { MediaType } from '../MediaType';
import { ViewType } from '../ViewType';

export type MediaMachineEventPayload = {
  'autoplay-change': { autoplay: boolean };
  'autoplay-fail': { error: unknown };
  'can-fullscreen': { supported: boolean };
  'can-play': {
    duration: number;
    trigger: MediaEvents.CanPlayEvent | MediaEvents.CanPlayThroughEvent;
  };
  'controls-change': { controls: boolean };
  'fullscreen-change': { fullscreen: boolean };
  'loop-change': { loop: boolean };
  'play-fail': { error: unknown };
  'playsinline-change': { playsinline: boolean };
  'poster-change': { poster: string };
  'src-change': { src: string };
  'time-update': { trigger: MediaEvents.TimeUpdateEvent };
  'volume-change': { trigger: MediaEvents.VolumeChangeEvent };
  abort: { error: unknown };
  autoplay: void;
  ended: { trigger: MediaEvents.EndedEvent };
  error: { error: unknown };
  loaded: {
    src: string;
    duration: number;
    trigger: MediaEvents.LoadedMetadataEvent;
  };
  loading: {
    src: string;
    poster: string;
    mediaType: MediaType;
    viewType: ViewType;
    trigger: MediaEvents.LoadStartEvent;
  };
  pause: { trigger: MediaEvents.PauseEvent };
  play: { trigger: MediaEvents.PlayEvent };
  playing: { trigger: MediaEvents.PlayingEvent };
  progress: {
    buffered: TimeRanges;
    seekable: TimeRanges;
    trigger: MediaEvents.ProgressEvent;
  };
  seeked: { trigger: MediaEvents.SeekedEvent };
  seeking: { trigger: MediaEvents.SeekingEvent };
  waiting: { trigger: MediaEvents.WaitingEvent };
};

export type MediaMachineEventType = keyof MediaMachineEventPayload;

export type MediaMachineEvents = Values<{
  [EventType in MediaMachineEventType]: {
    type: EventType;
  } & MediaMachineEventPayload[EventType];
}>;
