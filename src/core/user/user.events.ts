import { LIB_PREFIX } from '../../shared/constants';
import {
  buildVdsEvent,
  VdsCustomEvent,
  VdsCustomEventConstructor,
} from '../../shared/events';
import { PlayerState } from '../player.types';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface GlobalEventHandlersEventMap extends VdsUserEvents {}
}

export const USER_EVENT_PREFIX = 'user';

export type RawUserEventType =
  | 'play'
  | 'pause'
  | 'muted-change'
  | 'volume-change'
  | 'time-change';

export interface RawUserEventDetailType {
  play: void;
  pause: void;
  'muted-change': PlayerState['muted'];
  'volume-change': PlayerState['volume'];
  'time-change': PlayerState['currentTime'];
}

export type GenericVdsUserEventType<
  T extends string
> = `${typeof LIB_PREFIX}-${typeof USER_EVENT_PREFIX}-${T}-request`;

export type UserEventConstructor<
  T extends RawUserEventType
> = VdsCustomEventConstructor<
  RawUserEventDetailType[T],
  GenericVdsUserEventType<T>
>;

export type VdsUserEventConstructors = {
  [P in RawUserEventType as GenericVdsUserEventType<P>]: UserEventConstructor<P>;
};

export type VdsUserEvents = {
  [P in RawUserEventType as GenericVdsUserEventType<P>]: VdsCustomEvent<
    RawUserEventDetailType[P],
    GenericVdsUserEventType<P>
  >;
};

export type VdsUserEventType = keyof VdsUserEvents;

export function buildVdsUserEvent<T extends RawUserEventType>(
  type: T,
): UserEventConstructor<T> {
  return buildVdsEvent(
    `${USER_EVENT_PREFIX}-${type}-request`,
  ) as UserEventConstructor<T>;
}

export class UserPlayRequestEvent extends buildVdsUserEvent('play') {}

export class UserPauseRequestEvent extends buildVdsUserEvent('pause') {}

export class UserMutedChangeRequestEvent extends buildVdsUserEvent(
  'muted-change',
) {}

export class UserTimeChangeRequestEvent extends buildVdsUserEvent(
  'time-change',
) {}

export class UserVolumeChangeRequestEvent extends buildVdsUserEvent(
  'volume-change',
) {}

export const ALL_USER_EVENT_TYPES: VdsUserEventType[] = [
  UserPlayRequestEvent.TYPE,
  UserPauseRequestEvent.TYPE,
  UserMutedChangeRequestEvent.TYPE,
  UserVolumeChangeRequestEvent.TYPE,
  UserTimeChangeRequestEvent.TYPE,
];
