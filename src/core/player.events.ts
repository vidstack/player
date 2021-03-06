import { LIB_PREFIX } from '../shared/constants';
import {
  buildVdsEvent,
  VdsCustomEvent,
  VdsCustomEventConstructor,
  VdsEventInit,
} from '../shared/events';
import { MediaType } from './MediaType';
import { MediaProvider } from './provider/MediaProvider';
import { ViewType } from './ViewType';

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
  | 'playback-ready'
  | 'playback-start'
  | 'playback-end'
  | 'replay'
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
  'playback-ready': void;
  'playback-start': void;
  'playback-end': void;
  replay: void;
  error: unknown;
};

export type GenericPlayerEventType<
  T extends string
> = `${typeof LIB_PREFIX}-${T}`;

export type PlayerEvents = {
  [P in RawPlayerEventType as GenericPlayerEventType<P>]: VdsCustomEvent<
    RawPlayerEventDetailType[P]
  >;
};

export type PlayerEventType = keyof PlayerEvents;

export function buildPlayerEvent<
  P extends RawPlayerEventType,
  DetailType = RawPlayerEventDetailType[P]
>(type: P): VdsCustomEventConstructor<DetailType> {
  class PlayerEvent extends buildVdsEvent<DetailType>(type) {
    constructor(eventInit?: VdsEventInit<DetailType>) {
      super({
        bubbles: false,
        ...(eventInit ?? {}),
      });
    }
  }

  return PlayerEvent;
}

/**
 * Emitted when the provider connects to the DOM.
 */
export class ConnectEvent extends buildPlayerEvent('connect') {}

/**
 * Emitted when the provider disconnects from the DOM.
 */
export class DisconnectEvent extends buildPlayerEvent('disconnect') {}

/**
 * Emitted when playback attempts to start.
 */
export class PlayEvent extends buildPlayerEvent('play') {}

/**
 * Emitted when playback pauses.
 */
export class PauseEvent extends buildPlayerEvent('pause') {}

/**
 * Emitted when playback being playback.
 */
export class PlayingEvent extends buildPlayerEvent('playing') {}

/**
 * Emitted when the current src changes.
 */
export class SrcChangeEvent extends buildPlayerEvent('src-change') {}

/**
 * Emitted when the current poster changes.
 */
export class PosterChangeEvent extends buildPlayerEvent('poster-change') {}

/**
 * Emitted when the muted state changes.
 */
export class MutedChangeEvent extends buildPlayerEvent('muted-change') {}

/**
 * Emitted when the volume state changes.
 */
export class VolumeChangeEvent extends buildPlayerEvent('volume-change') {}

/**
 * Emitted when the current playback time changes.
 */
export class TimeChangeEvent extends buildPlayerEvent('time-change') {}

/**
 * Emitted when the length of the media changes.
 */
export class DurationChangeEvent extends buildPlayerEvent('duration-change') {}

/**
 * Emitted when the length of the media downloaded changes.
 */
export class BufferedChangeEvent extends buildPlayerEvent('buffered-change') {}

/**
 * Emitted when playback resumes/stops due to lack of data.
 */
export class BufferingChangeEvent extends buildPlayerEvent(
  'buffering-change',
) {}

/**
 * Emitted when the view type of the current provider/media changes.
 */
export class ViewTypeChangeEvent extends buildPlayerEvent('view-type-change') {}

/**
 * Emitted when the media type of the current provider/media changes.
 */
export class MediaTypeChangeEvent extends buildPlayerEvent(
  'media-type-change',
) {}

/**
 * Emitted when playback is ready to start - analgous with `canPlay`.
 */
export class PlaybackReadyEvent extends buildPlayerEvent('playback-ready') {}

/**
 * Emitted when playback has started (`currentTime > 0`).
 */
export class PlaybackStartEvent extends buildPlayerEvent('playback-start') {}

/**
 * Emitted when playback ends (`currentTime === duration`).
 */
export class PlaybackEndEvent extends buildPlayerEvent('playback-end') {}

/**
 * Emitted when playback ends and then starts again due to the `loop` property being `true`.
 */
export class ReplayEvent extends buildPlayerEvent('replay') {}

/**
 * Emitted when a provider encounters any error.
 */
export class ErrorEvent extends buildPlayerEvent('error') {}
