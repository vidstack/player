import { buildVdsEvent } from '../../shared/events';
import { PlayerState } from '../player.types';

export const USER_EVENT_PREFIX = 'user';

export class UserPlayRequestEvent extends buildVdsEvent<void>(
  `${USER_EVENT_PREFIX}-play-request`,
) {}

export class UserPauseRequestEvent extends buildVdsEvent<void>(
  `${USER_EVENT_PREFIX}-pause-request`,
) {}

export class UserMutedChangeRequestEvent extends buildVdsEvent<
  PlayerState['muted']
>(`${USER_EVENT_PREFIX}-muted-change-request`) {}

export class UserVolumeChangeRequestEvent extends buildVdsEvent<
  PlayerState['volume']
>(`${USER_EVENT_PREFIX}-volume-change-request`) {}

export class UserTimeChangeRequestEvent extends buildVdsEvent<
  PlayerState['currentTime']
>(`${USER_EVENT_PREFIX}-time-change-request`) {}
