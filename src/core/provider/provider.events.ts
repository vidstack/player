import { LIB_PREFIX } from '../../shared/constants';
import {
  buildVdsEvent,
  VdsCustomEvent,
  VdsCustomEventConstructor,
} from '../../shared/events';
import {
  BufferedChangeEvent,
  BufferingChangeEvent,
  DurationChangeEvent,
  ErrorEvent,
  MediaTypeChangeEvent,
  MutedChangeEvent,
  PauseEvent,
  PlaybackEndEvent,
  PlaybackReadyEvent,
  PlaybackStartEvent,
  PlayEvent,
  PlayingEvent,
  ReadyEvent,
  TimeChangeEvent,
  ViewTypeChangeEvent,
  VolumeChangeEvent,
} from '../player.events';
import { PlayerState } from '../player.types';
import { MediaProvider } from './MediaProvider';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface GlobalEventHandlersEventMap extends VdsProviderEvents {}
}

export const PROVIDER_EVENT_PREFIX = 'provider';

export type RawProviderEventType =
  | 'connect'
  | 'disconnect'
  | 'play'
  | 'pause'
  | 'playing'
  | 'muted-change'
  | 'volume-change'
  | 'time-change'
  | 'duration-change'
  | 'buffered-change'
  | 'buffering-change'
  | 'view-type-change'
  | 'media-type-change'
  | 'provider-ready'
  | 'playback-ready'
  | 'playback-start'
  | 'playback-end'
  | 'error';

export type RawProviderEventDetailType = {
  connect: MediaProvider;
  disconnect: MediaProvider;
  play: void;
  pause: void;
  playing: void;
  'muted-change': PlayerState['muted'];
  'volume-change': PlayerState['volume'];
  'time-change': PlayerState['currentTime'];
  'duration-change': PlayerState['duration'];
  'buffered-change': PlayerState['buffered'];
  'buffering-change': PlayerState['isBuffering'];
  'view-type-change': PlayerState['viewType'];
  'media-type-change': PlayerState['mediaType'];
  'provider-ready': void;
  'playback-ready': void;
  'playback-start': void;
  'playback-end': void;
  error: unknown;
};

export type GenericVdsProviderEventType<
  T extends string
> = `${typeof LIB_PREFIX}-${typeof PROVIDER_EVENT_PREFIX}-${T}`;

export type ProviderEventConstructor<
  T extends RawProviderEventType
> = VdsCustomEventConstructor<
  RawProviderEventDetailType[T],
  GenericVdsProviderEventType<T>
>;

export type VdsProviderEventConstructors = {
  [P in RawProviderEventType as GenericVdsProviderEventType<P>]: ProviderEventConstructor<P>;
};

export type VdsProviderEvents = {
  [P in RawProviderEventType as GenericVdsProviderEventType<P>]: VdsCustomEvent<
    RawProviderEventDetailType[P],
    GenericVdsProviderEventType<P>
  >;
};

export type VdsProviderEventType = keyof VdsProviderEvents;

export function buildVdsProviderEvent<T extends RawProviderEventType>(
  type: T,
): ProviderEventConstructor<T> {
  return buildVdsEvent(
    `${PROVIDER_EVENT_PREFIX}-${type}`,
  ) as ProviderEventConstructor<T>;
}

export class ProviderConnectEvent extends buildVdsProviderEvent('connect') {}

export class ProviderDisconnectEvent extends buildVdsProviderEvent(
  'disconnect',
) {}

export class ProviderPlayEvent extends buildVdsProviderEvent('play') {}

export class ProviderPauseEvent extends buildVdsProviderEvent('pause') {}

export class ProviderPlayingEvent extends buildVdsProviderEvent('playing') {}

export class ProviderMutedChangeEvent extends buildVdsProviderEvent(
  'muted-change',
) {}

export class ProviderVolumeChangeEvent extends buildVdsProviderEvent(
  'volume-change',
) {}

export class ProviderTimeChangeEvent extends buildVdsProviderEvent(
  'time-change',
) {}

export class ProviderDurationChangeEvent extends buildVdsProviderEvent(
  'duration-change',
) {}

export class ProviderBufferedChangeEvent extends buildVdsProviderEvent(
  'buffered-change',
) {}

export class ProviderBufferingChangeEvent extends buildVdsProviderEvent(
  'buffering-change',
) {}

export class ProviderViewTypeChangeEvent extends buildVdsProviderEvent(
  'view-type-change',
) {}

export class ProviderMediaTypeChangeEvent extends buildVdsProviderEvent(
  'media-type-change',
) {}

export class ProviderReadyEvent extends buildVdsProviderEvent(
  'provider-ready',
) {}

export class ProviderPlaybackReadyEvent extends buildVdsProviderEvent(
  'playback-ready',
) {}

export class ProviderPlaybackStartEvent extends buildVdsProviderEvent(
  'playback-start',
) {}

export class ProviderPlaybackEndEvent extends buildVdsProviderEvent(
  'playback-end',
) {}

export class ProviderErrorEvent extends buildVdsProviderEvent('error') {}

export const ALL_PROVIDER_EVENT_TYPES: VdsProviderEventType[] = [
  ProviderPlayEvent.TYPE,
  ProviderPauseEvent.TYPE,
  ProviderPlayingEvent.TYPE,
  ProviderMutedChangeEvent.TYPE,
  ProviderVolumeChangeEvent.TYPE,
  ProviderTimeChangeEvent.TYPE,
  ProviderDurationChangeEvent.TYPE,
  ProviderBufferedChangeEvent.TYPE,
  ProviderBufferingChangeEvent.TYPE,
  ProviderViewTypeChangeEvent.TYPE,
  ProviderMediaTypeChangeEvent.TYPE,
  ProviderReadyEvent.TYPE,
  ProviderPlaybackReadyEvent.TYPE,
  ProviderPlaybackStartEvent.TYPE,
  ProviderPlaybackEndEvent.TYPE,
  ProviderErrorEvent.TYPE,
];

/**
 * Map of provider event types to the corresponding player event constructor. Most provider events
 * map 1:1 with player events, so this map is used to find the matching event. This is used by the
 * event translation unit inside the player.
 */
export const PROVIDER_EVENT_TYPE_TO_PLAYER_EVENT_MAP = {
  [ProviderConnectEvent.TYPE]: undefined,
  [ProviderDisconnectEvent.TYPE]: undefined,
  [ProviderPlayEvent.TYPE]: PlayEvent,
  [ProviderPauseEvent.TYPE]: PauseEvent,
  [ProviderPlayingEvent.TYPE]: PlayingEvent,
  [ProviderMutedChangeEvent.TYPE]: MutedChangeEvent,
  [ProviderVolumeChangeEvent.TYPE]: VolumeChangeEvent,
  [ProviderTimeChangeEvent.TYPE]: TimeChangeEvent,
  [ProviderDurationChangeEvent.TYPE]: DurationChangeEvent,
  [ProviderBufferedChangeEvent.TYPE]: BufferedChangeEvent,
  [ProviderBufferingChangeEvent.TYPE]: BufferingChangeEvent,
  [ProviderViewTypeChangeEvent.TYPE]: ViewTypeChangeEvent,
  [ProviderMediaTypeChangeEvent.TYPE]: MediaTypeChangeEvent,
  [ProviderReadyEvent.TYPE]: ReadyEvent,
  [ProviderPlaybackReadyEvent.TYPE]: PlaybackReadyEvent,
  [ProviderPlaybackStartEvent.TYPE]: PlaybackStartEvent,
  [ProviderPlaybackEndEvent.TYPE]: PlaybackEndEvent,
  [ProviderErrorEvent.TYPE]: ErrorEvent,
};
