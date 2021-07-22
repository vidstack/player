import { VdsEvent } from '../foundation/events/index.js';

/**
 * @typedef {{
 *  'vds-mute-request': MuteRequestEvent;
 *  'vds-unmute-request': UnmuteRequestEvent;
 *  'vds-enter-fullscreen-request': EnterFullscreenRequestEvent;
 *  'vds-exit-fullscreen-request': ExitFullscreenRequestEvent;
 *  'vds-play-request': PlayRequestEvent;
 *  'vds-pause-request': PauseRequestEvent;
 *  'vds-seek-request': SeekRequestEvent;
 *  'vds-seeking-request': SeekingRequestEvent;
 *  'vds-volume-change-request': VolumeChangeRequestEvent;
 * }} MediaRequestEvents
 */

/**
 * Fired when requesting the media to be muted.
 *
 * @event
 * @bubbles
 * @composed
 * @typedef {VdsEvent<void>} MuteRequestEvent
 */

/**
 * Fired when requesting the media to be unmuted.
 *
 * @event
 * @bubbles
 * @composed
 * @typedef {VdsEvent<void>} UnmuteRequestEvent
 */

/**
 * Fired when requesting media to enter fullscreen.
 *
 * @event
 * @bubbles
 * @composed
 * @typedef {VdsEvent<void>} EnterFullscreenRequestEvent
 */

/**
 * Fired when requesting media to exit fullscreen.
 *
 * @event
 * @bubbles
 * @composed
 * @typedef {VdsEvent<void>} ExitFullscreenRequestEvent
 */

/**
 * Fired when requesting media playback to begin/resume.
 *
 * @event
 * @bubbles
 * @composed
 * @typedef {VdsEvent<void>} PlayRequestEvent
 */

/**
 * Fired when requesting media playback to temporarily stop.
 *
 * @event
 * @bubbles
 * @composed
 * @typedef {VdsEvent<void>} PauseRequestEvent
 */

/**
 * Fired when requesting a time change. In other words, moving the playhead to a new position.
 *
 * @event
 * @bubbles
 * @composed
 * @typedef {VdsEvent<number>} SeekRequestEvent
 */

/**
 * Fired when seeking/scrubbing to a new playback position.
 *
 * @event
 * @bubbles
 * @composed
 * @typedef {VdsEvent<number>} SeekingRequestEvent
 */

/**
 * Fired when requesting the media volume to be set to a new level.
 *
 * @event
 * @bubbles
 * @composed
 * @typedef {VdsEvent<number>} VolumeChangeRequestEvent
 */
