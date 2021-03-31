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

/**
 * Fired when the user is requesting the muted state to change.
 *
 * @bubbles
 * @composed
 */
export class VdsUserMutedChangeEvent extends buildVdsUserEvent(
  'user-muted-change',
) {}

/**
 * Fired when the user is requesting the current fullscreen mode to change.
 *
 * @bubbles
 * @composed
 */
export class VdsUserFullscreenChangeEvent extends buildVdsUserEvent(
  'user-fullscreen-change',
) {}

/**
 * Fired when the user is requesting playback to pause.
 *
 * @bubbles
 * @composed
 */
export class VdsUserPauseEvent extends buildVdsUserEvent('user-pause') {}

/**
 * Fired when the user is requesting playback to begin/resume.
 *
 * @bubbles
 * @composed
 */
export class VdsUserPlayEvent extends buildVdsUserEvent('user-play') {}

/**
 * Fired when the user has seeked to a new playback position and is requesting a time change.
 *
 * @bubbles
 * @composed
 */
export class VdsUserSeekedEvent extends buildVdsUserEvent('user-seeked') {}

/**
 * Fired when the user is seeking/scrubbing to a new playback position.
 *
 * @bubbles
 * @composed
 */
export class VdsUserSeekingEvent extends buildVdsUserEvent('user-seeking') {}

/**
 * Fired when the user requests a volume change.
 *
 * @bubbles
 * @composed
 */
export class VdsUserVolumeChangeEvent extends buildVdsUserEvent(
  'user-volume-change',
) {}
