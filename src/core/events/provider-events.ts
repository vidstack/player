import { buildVdsEvent } from '../../shared/events';
import { PlayerState } from '../types';

export const PROVIDER_EVENT_PREFIX = 'provider';

export class ProviderPlayEvent extends buildVdsEvent<void>(
  `${PROVIDER_EVENT_PREFIX}-play`,
) {}

export class ProviderPauseEvent extends buildVdsEvent<void>(
  `${PROVIDER_EVENT_PREFIX}-pause`,
) {}

export class ProviderPlayingEvent extends buildVdsEvent<void>(
  `${PROVIDER_EVENT_PREFIX}-playing`,
) {}

export class ProviderMutedChangeEvent extends buildVdsEvent<
PlayerState['muted']
>(`${PROVIDER_EVENT_PREFIX}-muted-change`) {}

export class ProviderVolumeChangeEvent extends buildVdsEvent<
PlayerState['volume']
>(`${PROVIDER_EVENT_PREFIX}-volume-change`) {}

export class ProviderTimeChangeEvent extends buildVdsEvent<
PlayerState['currentTime']
>(`${PROVIDER_EVENT_PREFIX}-time-change`) {}

export class ProviderDurationChangeEvent extends buildVdsEvent<
PlayerState['duration']
>(`${PROVIDER_EVENT_PREFIX}-duration-change`) {}

export class ProviderBufferedChangeEvent extends buildVdsEvent<
PlayerState['buffered']
>(`${PROVIDER_EVENT_PREFIX}-buffered-change`) {}

export class ProviderBufferingChangeEvent extends buildVdsEvent<
PlayerState['isBuffering']
>(`${PROVIDER_EVENT_PREFIX}-buffered-change`) {}

export class ProviderViewTypeChangeEvent extends buildVdsEvent<
PlayerState['viewType']
>(`${PROVIDER_EVENT_PREFIX}-view-type-change`) {}

export class ProviderMediaTypeChangeEvent extends buildVdsEvent<
PlayerState['mediaType']
>(`${PROVIDER_EVENT_PREFIX}-media-type-change`) {}

export class ProviderPlaybackReadyEvent extends buildVdsEvent<
PlayerState['isPlaybackReady']
>(`${PROVIDER_EVENT_PREFIX}-playback-ready`) {}

export class ProviderPlaybackStartEvent extends buildVdsEvent<
PlayerState['hasPlaybackStarted']
>(`${PROVIDER_EVENT_PREFIX}-playback-start`) {}

export class ProviderPlaybackEndEvent extends buildVdsEvent<
PlayerState['hasPlaybackEnded']
>(`${PROVIDER_EVENT_PREFIX}-playback-end`) {}

export class ProviderErrorEvent extends buildVdsEvent<any>(
  `${PROVIDER_EVENT_PREFIX}-error`,
) {}
