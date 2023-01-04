import type { DOMEvent } from 'maverick.js/std';

export interface MediaRequestEvents {
  'vds-start-loading': StartLoadingRequestEvent;
  'vds-mute-request': MuteRequestEvent;
  'vds-unmute-request': UnmuteRequestEvent;
  'vds-enter-fullscreen-request': EnterFullscreenRequestEvent;
  'vds-exit-fullscreen-request': ExitFullscreenRequestEvent;
  'vds-play-request': PlayRequestEvent;
  'vds-pause-request': PauseRequestEvent;
  'vds-seek-request': SeekRequestEvent;
  'vds-seeking-request': SeekingRequestEvent;
  'vds-volume-change-request': VolumeChangeRequestEvent;
  'vds-resume-user-idle-request': ResumeUserIdleRequestEvent;
  'vds-pause-user-idle-request': PauseUserIdleRequestEvent;
  'vds-show-poster-request': ShowPosterRequestEvent;
  'vds-hide-poster-request': HidePosterRequestEvent;
  'vds-loop-request': LoopRequestEvent;
}

/**
 * Fired when requesting media to begin loading. This will only take effect if the `loading`
 * strategy on the provider is set to `custom`.
 *
 * @bubbles
 * @composed
 */
export interface StartLoadingRequestEvent extends DOMEvent<void> {}

/**
 * Fired when requesting the media to be muted.
 *
 * @bubbles
 * @composed
 */
export interface MuteRequestEvent extends DOMEvent<void> {}

/**
 * Fired when requesting the media to be unmuted.
 *
 * @bubbles
 * @composed
 */
export interface UnmuteRequestEvent extends DOMEvent<void> {}

/**
 * Whether to request fullscreen on the media (i.e., `<vds-media>`) or provider element
 * (e.g., `<vds-video>`).
 *
 * @defaultValue 'media'
 */
export type MediaFullscreenRequestTarget = 'media' | 'provider';

/**
 * Fired when requesting media to enter fullscreen. The event `detail` can specify the
 * fullscreen target, which can be the media or provider element (defaults to `media`).
 *
 * @bubbles
 * @composed
 */
export interface EnterFullscreenRequestEvent extends DOMEvent<MediaFullscreenRequestTarget> {}

/**
 * Fired when requesting media to exit fullscreen. The event `detail` can specify the fullscreen
 * target, which can be the media or provider element (defaults to `media`).
 *
 * @bubbles
 * @composed
 */
export interface ExitFullscreenRequestEvent extends DOMEvent<MediaFullscreenRequestTarget> {}

/**
 * Fired when requesting media playback to begin/resume.
 *
 * @bubbles
 * @composed
 */
export interface PlayRequestEvent extends DOMEvent<void> {}

/**
 * Fired when requesting media playback to temporarily stop.
 *
 * @bubbles
 * @composed
 */
export interface PauseRequestEvent extends DOMEvent<void> {}

/**
 * Fired when requesting a time change. In other words, moving the playhead to a new position.
 *
 * @bubbles
 * @composed
 */
export interface SeekRequestEvent extends DOMEvent<number> {}

/**
 * Fired when seeking/scrubbing to a new playback position.
 *
 * @bubbles
 * @composed
 */
export interface SeekingRequestEvent extends DOMEvent<number> {}

/**
 * Fired when requesting the media volume to be set to a new level.
 *
 * @bubbles
 * @composed
 */
export interface VolumeChangeRequestEvent extends DOMEvent<number> {}

/**
 * Fired when user idle state tracking may resume. This is typically called after requesting
 * the idle state to pause via `vds-pause-user-idle-request`.
 *
 * @bubbles
 * @composed
 */
export interface ResumeUserIdleRequestEvent extends DOMEvent<void> {}

/**
 * Fired when user idle state tracking should pause. This is typically used when a control
 * is being actively interacted with, and we don't want the `idle` state changing until
 * the interaction is complete (eg: scrubbing, or settings is open).
 *
 * @bubbles
 * @composed
 */
export interface PauseUserIdleRequestEvent extends DOMEvent<void> {}

/**
 * Fired when requesting the poster _should_ be rendered by the media provider element. This
 * should be fired if a custom poster element is _not_ being used.
 *
 * @bubbles
 * @composed
 */
export interface ShowPosterRequestEvent extends DOMEvent<void> {}

/**
 * Fired when requesting the poster should _not_ be rendered by the media provider element. This
 * should be fired if a custom poster element is being used (eg: `vds-poster`).
 *
 * @bubbles
 * @composed
 */
export interface HidePosterRequestEvent extends DOMEvent<void> {}

/**
 * Internal event that is fired by a media provider when requesting media playback to restart after
 * reaching the end. This event also helps notify the media controller that media will be looping.
 *
 * @bubbles
 * @composed
 */
export interface LoopRequestEvent extends DOMEvent<void> {}
