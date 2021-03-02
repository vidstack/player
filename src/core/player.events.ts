import { LIB_PREFIX } from '../shared/constants';
import {
  buildVdsEvent,
  VdsCustomEvent,
  VdsCustomEventConstructor,
  VdsEventInit,
} from '../shared/events';
import { MediaType, ViewType } from './player.types';
import { MediaProvider } from './provider/MediaProvider';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface GlobalEventHandlersEventMap extends PlayerEvents {}
}

export type RawPlayerEventType =
  | 'connect'
  | 'disconnect'
  | 'play'
  | 'pause'
  | 'playing'
  | 'poster-change'
  | 'src-change'
  | 'muted-change'
  | 'volume-change'
  | 'time-change'
  | 'duration-change'
  | 'buffered-change'
  | 'buffering-change'
  | 'view-type-change'
  | 'media-type-change'
  | 'boot-start'
  | 'boot-end'
  | 'playback-ready'
  | 'playback-start'
  | 'playback-end'
  | 'error';

export type RawPlayerEventDetailType = {
  connect: MediaProvider;
  disconnect: MediaProvider;
  play: void;
  pause: void;
  playing: void;
  'poster-change': string;
  'src-change': string;
  'muted-change': boolean;
  'volume-change': number;
  'time-change': number;
  'duration-change': number;
  'buffered-change': number;
  'buffering-change': boolean;
  'view-type-change': ViewType;
  'media-type-change': MediaType;
  'boot-start': void;
  'boot-end': void;
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
> = VdsCustomEventConstructor<RawPlayerEventDetailType[T]>;

export type PlayerEventConstructors = {
  [P in RawPlayerEventType as GenericVdsPlayerEventType<P>]: PlayerEventConstructor<P>;
};

export type PlayerEvents = {
  [P in RawPlayerEventType as GenericVdsPlayerEventType<P>]: VdsCustomEvent<
    RawPlayerEventDetailType[P]
  >;
};

export type PlayerEventType = keyof PlayerEvents;

export function buildPlayerEvent<P extends RawPlayerEventType>(
  type: P,
): VdsCustomEventConstructor<RawPlayerEventDetailType[P]> {
  class PlayerEvent extends buildVdsEvent<RawPlayerEventDetailType[P]>(type) {
    constructor(eventInit?: VdsEventInit<RawPlayerEventDetailType[P]>) {
      super({
        bubbles: false,
        ...(eventInit ?? {}),
      });
    }
  }

  return PlayerEvent;
}

export class ConnectEvent extends buildPlayerEvent('connect') {}

export class DisconnectEvent extends buildPlayerEvent('disconnect') {}

export class PlayEvent extends buildPlayerEvent('play') {}

export class PauseEvent extends buildPlayerEvent('pause') {}

export class PlayingEvent extends buildPlayerEvent('playing') {}

export class SrcChangeEvent extends buildPlayerEvent('src-change') {}

export class PosterChangeEvent extends buildPlayerEvent('poster-change') {}

export class MutedChangeEvent extends buildPlayerEvent('muted-change') {}

export class VolumeChangeEvent extends buildPlayerEvent('volume-change') {}

export class TimeChangeEvent extends buildPlayerEvent('time-change') {}

export class DurationChangeEvent extends buildPlayerEvent('duration-change') {}

export class BufferedChangeEvent extends buildPlayerEvent('buffered-change') {}

export class BufferingChangeEvent extends buildPlayerEvent(
  'buffering-change',
) {}

export class ViewTypeChangeEvent extends buildPlayerEvent('view-type-change') {}

export class MediaTypeChangeEvent extends buildPlayerEvent(
  'media-type-change',
) {}

export class PlaybackReadyEvent extends buildPlayerEvent('playback-ready') {}

export class PlaybackStartEvent extends buildPlayerEvent('playback-start') {}

export class PlaybackEndEvent extends buildPlayerEvent('playback-end') {}

export class ErrorEvent extends buildPlayerEvent('error') {}
