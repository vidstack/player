import {
  buildVdsEvent,
  ExtractEventDetailType,
  VdsCustomEvent,
  VdsCustomEventConstructor,
  VdsEvents,
} from '../../shared/events';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface GlobalEventHandlersEventMap extends VdsUserEvents {}
}

export interface UserEvents {
  userplay: VdsCustomEvent<void>;
  userpause: VdsCustomEvent<void>;
  usermutedchange: VdsCustomEvent<boolean>;
  uservolumechange: VdsCustomEvent<number>;
  userseeking: VdsCustomEvent<number>;
  userseeked: VdsCustomEvent<number>;
}

export type VdsUserEvents = VdsEvents<UserEvents>;

export function buildVdsUserEvent<
  P extends keyof UserEvents,
  DetailType = ExtractEventDetailType<UserEvents[P]>
>(type: P): VdsCustomEventConstructor<DetailType> {
  return class VdsUserEvent extends buildVdsEvent<DetailType>(type) {};
}

export class VdsUserPlayEvent extends buildVdsUserEvent('userplay') {}

export class VdsUserPauseEvent extends buildVdsUserEvent('userpause') {}

export class VdsUserMutedChange extends buildVdsUserEvent('usermutedchange') {}

export class VdsUserVolumeChange extends buildVdsUserEvent(
  'uservolumechange',
) {}

export class VdsUserSeeking extends buildVdsUserEvent('userseeking') {}

export class VdsUserSeeked extends buildVdsUserEvent('userseeked') {}
