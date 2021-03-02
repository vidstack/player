import { LIB_PREFIX } from '../../shared/constants';
import {
  buildVdsEvent,
  VdsCustomEvent,
  VdsCustomEventConstructor,
  VdsEventInit,
} from '../../shared/events';

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
  'muted-change': boolean;
  'volume-change': number;
  'time-change': number;
}

export type GenericVdsUserEventType<
  T extends string
> = `${typeof LIB_PREFIX}-${typeof USER_EVENT_PREFIX}-${T}-request`;

export type UserEventConstructor<
  T extends RawUserEventType
> = VdsCustomEventConstructor<RawUserEventDetailType[T]>;

export type VdsUserEventConstructors = {
  [P in RawUserEventType as GenericVdsUserEventType<P>]: UserEventConstructor<P>;
};

export type VdsUserEvents = {
  [P in RawUserEventType as GenericVdsUserEventType<P>]: VdsCustomEvent<
    RawUserEventDetailType[P]
  >;
};

export type VdsUserEventType = keyof VdsUserEvents;

export function buildUserEvent<P extends RawUserEventType>(
  type: P,
): VdsCustomEventConstructor<RawUserEventDetailType[P]> {
  const prefixedType = `${USER_EVENT_PREFIX}-${type}`;

  class UserEvent extends buildVdsEvent<RawUserEventDetailType[P]>(
    prefixedType,
  ) {
    constructor(eventInit?: VdsEventInit<RawUserEventDetailType[P]>) {
      super(eventInit);
    }
  }

  return UserEvent;
}

export class UserPlayRequestEvent extends buildUserEvent('play') {}

export class UserPauseRequestEvent extends buildUserEvent('pause') {}

export class UserMutedChangeRequestEvent extends buildUserEvent(
  'muted-change',
) {}

export class UserTimeChangeRequestEvent extends buildUserEvent('time-change') {}

export class UserVolumeChangeRequestEvent extends buildUserEvent(
  'volume-change',
) {}
