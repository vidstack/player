import { VdsEvent } from '@base/events/index';

export type MediaRequestEvents = {
  'vds-mute-request': MuteRequestEvent;
  'vds-unmute-request': UnmuteRequestEvent;
  'vds-enter-fullscreen-request': EnterFullscreenRequestEvent;
  'vds-exit-fullscreen-request': ExitFullscreenRequestEvent;
  'vds-play-request': PlayRequestEvent;
  'vds-pause-request': PauseRequestEvent;
  'vds-seek-request': SeekRequestEvent;
  'vds-seeking-request': SeekingRequestEvent;
  'vds-volume-change-request': VolumeChangeRequestEvent;
};

/**
 * Fired when requesting the media to be muted.
 *
 * @event
 * @bubbles
 * @composed
 */
export type MuteRequestEvent = VdsEvent<number>;

/**
 * Fired when requesting the media to be unmuted.
 *
 * @event
 * @bubbles
 * @composed
 */
export type UnmuteRequestEvent = VdsEvent<void>;

/**
 * Fired when requesting media to enter fullscreen.
 *
 * @event
 * @bubbles
 * @composed
 */
export type EnterFullscreenRequestEvent = VdsEvent<void>;

/**
 * Fired when requesting media to exit fullscreen.
 *
 * @event
 * @bubbles
 * @composed
 */
export type ExitFullscreenRequestEvent = VdsEvent<void>;

/**
 * Fired when requesting media playback to begin/resume.
 *
 * @event
 * @bubbles
 * @composed
 */
export type PlayRequestEvent = VdsEvent<void>;

/**
 * Fired when requesting media playback to temporarily stop.
 *
 * @event
 * @bubbles
 * @composed
 */
export type PauseRequestEvent = VdsEvent<void>;

/**
 * Fired when requesting a time change. In other words, moving the playhead to a new position.
 *
 * @event
 * @bubbles
 * @composed
 */
export type SeekRequestEvent = VdsEvent<number>;

/**
 * Fired when seeking/scrubbing to a new playback position.
 *
 * @event
 * @bubbles
 * @composed
 */
export type SeekingRequestEvent = VdsEvent<number>;

/**
 * Fired when requesting the media volume to be set to a new level.
 *
 * @event
 * @bubbles
 * @composed
 */
export type VolumeChangeRequestEvent = VdsEvent<number>;
