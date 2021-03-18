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
  usermutedchange: VdsCustomEvent<boolean>;
  userfullscreenchange: VdsCustomEvent<boolean>;
  userpause: VdsCustomEvent<void>;
  userplay: VdsCustomEvent<void>;
  userseeked: VdsCustomEvent<number>;
  userseeking: VdsCustomEvent<number>;
  uservolumechange: VdsCustomEvent<number>;
}

export type VdsUserEvents = VdsEvents<UserEvents>;

export function buildVdsUserEvent<
  P extends keyof UserEvents,
  DetailType = ExtractEventDetailType<UserEvents[P]>
>(type: P): VdsCustomEventConstructor<DetailType> {
  return class VdsUserEvent extends buildVdsEvent<DetailType>(type) {};
}

export class VdsUserMutedChangeEvent extends buildVdsUserEvent(
  'usermutedchange',
) {}

export class VdsUserFullscreenChangeEvent extends buildVdsUserEvent(
  'userfullscreenchange',
) {}

export class VdsUserPauseEvent extends buildVdsUserEvent('userpause') {}

export class VdsUserPlayEvent extends buildVdsUserEvent('userplay') {}

export class VdsUserSeekedEvent extends buildVdsUserEvent('userseeked') {}

export class VdsUserSeekingEvent extends buildVdsUserEvent('userseeking') {}

export class VdsUserVolumeChangeEvent extends buildVdsUserEvent(
  'uservolumechange',
) {}
