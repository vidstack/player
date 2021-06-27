import { VdsCustomEvent } from '../shared/events/index.js';
import { VdsEventInit } from '../shared/events/index.js';

declare global {
  interface GlobalEventHandlersEventMap extends MediaRequestEvents {}
}

export interface MediaRequestEvents {
  'vds-mute-request': VdsCustomEvent<void>;
  'vds-unmute-request': VdsCustomEvent<void>;
  'vds-enter-fullscreen-request': VdsCustomEvent<void>;
  'vds-exit-fullscreen-request': VdsCustomEvent<void>;
  'vds-play-request': VdsCustomEvent<void>;
  'vds-pause-request': VdsCustomEvent<void>;
  'vds-seek-request': VdsCustomEvent<number>;
  'vds-seeking-request': VdsCustomEvent<number>;
  'vds-volume-change-request': VdsCustomEvent<number>;
}

export class MediaRequestEvent<DetailType> extends VdsCustomEvent<DetailType> {
  static readonly TYPE: keyof MediaRequestEvents;
}

/**
 * Fired when requesting the media to be muted.
 *
 * @bubbles
 * @composed
 */
export class MuteRequestEvent extends MediaRequestEvent<void> {
  static readonly TYPE = 'vds-mute-request';
  constructor(eventInit?: VdsEventInit<void>);
}

/**
 * Fired when requesting the media to be unmuted.
 *
 * @bubbles
 * @composed
 */
export class UnmuteRequestEvent extends MediaRequestEvent<void> {
  static readonly TYPE = 'vds-unmute-request';
  constructor(eventInit?: VdsEventInit<void>);
}

/**
 * Fired when requesting media to enter fullscreen.
 *
 * @bubbles
 * @composed
 */
export class EnterFullscreenRequestEvent extends MediaRequestEvent<void> {
  static readonly TYPE = 'vds-enter-fullscreen-request';
  constructor(eventInit?: VdsEventInit<void>);
}

/**
 * Fired when requesting media to exit fullscreen.
 *
 * @bubbles
 * @composed
 */
export class ExitFullscreenRequestEvent extends MediaRequestEvent<void> {
  static readonly TYPE = 'vds-exit-fullscreen-request';
  constructor(eventInit?: VdsEventInit<void>);
}

/**
 * Fired when requesting media playback to begin/resume.
 *
 * @bubbles
 * @composed
 */
export class PlayRequestEvent extends MediaRequestEvent<void> {
  static readonly TYPE = 'vds-play-request';
  constructor(eventInit?: VdsEventInit<void>);
}

/**
 * Fired when requesting media playback to temporarily stop.
 *
 * @bubbles
 * @composed
 */
export class PauseRequestEvent extends MediaRequestEvent<void> {
  static readonly TYPE = 'vds-pause-request';
  constructor(eventInit?: VdsEventInit<void>);
}

/**
 * Fired when requesting a time change. In other words, moving the playhead to a new position.
 *
 * @bubbles
 * @composed
 */
export class SeekRequestEvent extends MediaRequestEvent<number> {
  static readonly TYPE = 'vds-seek-request';
  constructor(eventInit: VdsEventInit<number>);
}

/**
 * Fired when seeking/scrubbing to a new playback position.
 *
 * @bubbles
 * @composed
 */
export class SeekingRequestEvent extends MediaRequestEvent<number> {
  static readonly TYPE = 'vds-seeking-request';
  constructor(eventInit: VdsEventInit<number>);
}

/**
 * Fired when requesting the media volume to be set to a new level.
 *
 * @bubbles
 * @composed
 */
export class VolumeChangeRequestEvent extends MediaRequestEvent<number> {
  static readonly TYPE = 'vds-volume-change-request';
  constructor(eventInit: VdsEventInit<number>);
}
