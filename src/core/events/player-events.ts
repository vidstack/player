import { buildVdsEvent } from '../../shared/events';
import { PlayerState } from '../player.types';

export class PlayEvent extends buildVdsEvent<void>('play') {}

export class PauseEvent extends buildVdsEvent<void>('pause') {}

export class PlayingEvent extends buildVdsEvent<void>('playing') {}

export class MutedChangeEvent extends buildVdsEvent<PlayerState['muted']>(
  'muted-change',
) {}

export class VolumeChangeEvent extends buildVdsEvent<PlayerState['volume']>(
  'volume-change',
) {}

export class TimeChangeEvent extends buildVdsEvent<PlayerState['currentTime']>(
  'time-change',
) {}

export class DurationChangeEvent extends buildVdsEvent<PlayerState['duration']>(
  'duration-change',
) {}

export class BufferedChangeEvent extends buildVdsEvent<PlayerState['buffered']>(
  'buffered-change',
) {}

export class BufferingChangeEvent extends buildVdsEvent<
  PlayerState['isBuffering']
>('buffered-change') {}

export class ViewTypeChangeEvent extends buildVdsEvent<PlayerState['viewType']>(
  'view-type-change',
) {}

export class MediaTypeChangeEvent extends buildVdsEvent<
  PlayerState['mediaType']
>('media-type-change') {}

export class ReadyEvent extends buildVdsEvent<PlayerState['isProviderReady']>(
  'ready',
) {}

export class PlaybackReadyEvent extends buildVdsEvent<
  PlayerState['isPlaybackReady']
>('playback-ready') {}

export class PlaybackStartEvent extends buildVdsEvent<
  PlayerState['hasPlaybackStarted']
>('playback-start') {}

export class PlaybackEndEvent extends buildVdsEvent<
  PlayerState['hasPlaybackEnded']
>('playback-end') {}

export class MobileDeviceChangeEvent extends buildVdsEvent<
  PlayerState['isMobileDevice']
>('mobile-device-change') {}

export class TouchInputChangeEvent extends buildVdsEvent<
  PlayerState['isTouchInput']
>('touch-input-change') {}

export class ErrorEvent extends buildVdsEvent<unknown>('error') {}
