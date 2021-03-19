import {
  buildVdsEvent,
  ExtractEventDetailType,
  VdsCustomEvent,
  VdsCustomEventConstructor,
  VdsEventInit,
  VdsEvents,
} from '../../shared/events';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface GlobalEventHandlersEventMap extends VdsUserEvents {}
}

export interface UserEvents {
  'user-muted-change': VdsCustomEvent<boolean>;
  'user-fullscreen-change': VdsCustomEvent<boolean>;
  'user-pause': VdsCustomEvent<void>;
  'user-play': VdsCustomEvent<void>;
  'user-seeked': VdsCustomEvent<number>;
  'user-seeking': VdsCustomEvent<number>;
  'user-volume-change': VdsCustomEvent<number>;
}

export type VdsUserEvents = VdsEvents<UserEvents>;

export function buildVdsUserEvent<
  P extends keyof UserEvents,
  DetailType = ExtractEventDetailType<UserEvents[P]>
>(type: P): VdsCustomEventConstructor<DetailType> {
  return class VdsUserEvent extends buildVdsEvent<DetailType>(type) {
    constructor(eventInit?: VdsEventInit<DetailType>) {
      super({
        composed: true,
        bubbles: true,
        ...(eventInit ?? {}),
      });
    }
  };
}

export class VdsUserMutedChangeEvent extends buildVdsUserEvent(
  'user-muted-change',
) {}

export class VdsUserFullscreenChangeEvent extends buildVdsUserEvent(
  'user-fullscreen-change',
) {}

export class VdsUserPauseEvent extends buildVdsUserEvent('user-pause') {}

export class VdsUserPlayEvent extends buildVdsUserEvent('user-play') {}

export class VdsUserSeekedEvent extends buildVdsUserEvent('user-seeked') {}

export class VdsUserSeekingEvent extends buildVdsUserEvent('user-seeking') {}

export class VdsUserVolumeChangeEvent extends buildVdsUserEvent(
  'user-volume-change',
) {}
