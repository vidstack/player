import { LIB_PREFIX } from '../shared/constants';
import {
  buildVdsEvent,
  VdsCustomEvent,
  VdsCustomEventConstructor,
} from '../shared/events';
import { Device } from '../utils';
import { PlayerState } from './player.types';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface GlobalEventHandlersEventMap extends VdsPlayerEvents {}
}

export type RawPlayerEventType =
  | 'play'
  | 'pause'
  | 'playing'
  | 'current-src-change'
  | 'muted-change'
  | 'volume-change'
  | 'time-change'
  | 'duration-change'
  | 'buffered-change'
  | 'buffering-change'
  | 'view-type-change'
  | 'media-type-change'
  | 'device-change'
  | 'boot-start'
  | 'boot-end'
  | 'ready'
  | 'playback-ready'
  | 'playback-start'
  | 'playback-end'
  | 'error';

export type RawPlayerEventDetailType = {
  play: void;
  pause: void;
  playing: void;
  'current-src-change': PlayerState['currentSrc'];
  'muted-change': PlayerState['muted'];
  'volume-change': PlayerState['volume'];
  'time-change': PlayerState['currentTime'];
  'duration-change': PlayerState['duration'];
  'buffered-change': PlayerState['buffered'];
  'buffering-change': PlayerState['isBuffering'];
  'view-type-change': PlayerState['viewType'];
  'media-type-change': PlayerState['mediaType'];
  'device-change': Device;
  'boot-start': void;
  'boot-end': void;
  ready: void;
  'playback-ready': void;
  'playback-start': void;
  'playback-end': void;
  error: unknown;
};

export type GenericVdsPlayerEventType<
  T extends string
> = `${typeof LIB_PREFIX}-${T}`;

export type PlayerEventConstructor<
  T extends RawPlayerEventType
> = VdsCustomEventConstructor<
  RawPlayerEventDetailType[T],
  GenericVdsPlayerEventType<T>
>;

export type VdsPlayerEventConstructors = {
  [P in RawPlayerEventType as GenericVdsPlayerEventType<P>]: PlayerEventConstructor<P>;
};

export type VdsPlayerEvents = {
  [P in RawPlayerEventType as GenericVdsPlayerEventType<P>]: VdsCustomEvent<
    RawPlayerEventDetailType[P],
    GenericVdsPlayerEventType<P>
  >;
};

export type VdsPlayerEventType = keyof VdsPlayerEvents;

export function buildsVdsPlayerEvent<T extends RawPlayerEventType>(
  type: T,
): PlayerEventConstructor<T> {
  return buildVdsEvent(type) as PlayerEventConstructor<T>;
}

export class PlayEvent extends buildsVdsPlayerEvent('play') {}

export class PauseEvent extends buildsVdsPlayerEvent('pause') {}

export class PlayingEvent extends buildsVdsPlayerEvent('playing') {}

export class CurrentSrcChange extends buildsVdsPlayerEvent(
  'current-src-change',
) {}

export class MutedChangeEvent extends buildsVdsPlayerEvent('muted-change') {}

export class VolumeChangeEvent extends buildsVdsPlayerEvent('volume-change') {}

export class TimeChangeEvent extends buildsVdsPlayerEvent('time-change') {}

export class DurationChangeEvent extends buildsVdsPlayerEvent(
  'duration-change',
) {}

export class BufferedChangeEvent extends buildsVdsPlayerEvent(
  'buffered-change',
) {}

export class BufferingChangeEvent extends buildsVdsPlayerEvent(
  'buffered-change',
) {}

export class ViewTypeChangeEvent extends buildsVdsPlayerEvent(
  'view-type-change',
) {}

export class MediaTypeChangeEvent extends buildsVdsPlayerEvent(
  'media-type-change',
) {}

export class ReadyEvent extends buildsVdsPlayerEvent('ready') {}

export class PlaybackReadyEvent extends buildsVdsPlayerEvent(
  'playback-ready',
) {}

export class PlaybackStartEvent extends buildsVdsPlayerEvent(
  'playback-start',
) {}

export class PlaybackEndEvent extends buildsVdsPlayerEvent('playback-end') {}

export class DeviceChangeEvent extends buildsVdsPlayerEvent('device-change') {}

export class ErrorEvent extends buildsVdsPlayerEvent('error') {}
