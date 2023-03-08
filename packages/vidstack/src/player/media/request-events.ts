import type { DOMEvent } from 'maverick.js/std';

export interface MediaRequestEvents {
  'media-enter-fullscreen-request': MediaEnterFullscreenRequestEvent;
  'media-exit-fullscreen-request': MediaExitFullscreenRequestEvent;
  'media-hide-poster-request': MediaHidePosterRequestEvent;
  'media-live-edge-request': MediaLiveEdgeRequestEvent;
  'media-loop-request': MediaLoopRequestEvent;
  'media-mute-request': MediaMuteRequestEvent;
  'media-pause-request': MediaPauseRequestEvent;
  'media-pause-user-idle-request': MediaPauseUserIdleRequestEvent;
  'media-play-request': MediaPlayRequestEvent;
  'media-quality-change-request': MediaQualityChangeRequestEvent;
  'media-rate-change-request': MediaRateChangeRequestEvent;
  'media-resume-user-idle-request': MediaResumeUserIdleRequestEvent;
  'media-seek-request': MediaSeekRequestEvent;
  'media-seeking-request': MediaSeekingRequestEvent;
  'media-show-poster-request': MediaShowPosterRequestEvent;
  'media-start-loading': MediaStartLoadingRequestEvent;
  'media-unmute-request': MediaUnmuteRequestEvent;
  'media-volume-change-request': MediaVolumeChangeRequestEvent;
}

/**
 * Fired when requesting media to begin loading. This will only take effect if the `loading`
 * strategy on the provider is set to `custom`.
 *
 * @bubbles
 * @composed
 */
export interface MediaStartLoadingRequestEvent extends DOMEvent<void> {}

/**
 * Fired when requesting the media to be muted.
 *
 * @bubbles
 * @composed
 */
export interface MediaMuteRequestEvent extends DOMEvent<void> {}

/**
 * Fired when requesting the media to be unmuted.
 *
 * @bubbles
 * @composed
 */
export interface MediaUnmuteRequestEvent extends DOMEvent<void> {}

/**
 * Whether to request fullscreen on the media (i.e., `<media-player>`). The `prefer-media` option
 * will first see if the native fullscreen API is available, if not it'll try the media provider.
 */
export type MediaFullscreenRequestTarget = 'prefer-media' | 'media' | 'provider';

/**
 * Fired when requesting media to enter fullscreen. The event `detail` can specify the
 * fullscreen target, which can be the media or provider (defaults to `prefer-media`).
 *
 * @bubbles
 * @composed
 */
export interface MediaEnterFullscreenRequestEvent extends DOMEvent<MediaFullscreenRequestTarget> {}

/**
 * Fired when requesting media to exit fullscreen. The event `detail` can specify the fullscreen
 * target, which can be the media or provider (defaults to `prefer-media`).
 *
 * @bubbles
 * @composed
 */
export interface MediaExitFullscreenRequestEvent extends DOMEvent<MediaFullscreenRequestTarget> {}

/**
 * Fired when requesting media to seek to the live edge (i.e., set the current time to the current
 * live time).
 */
export interface MediaLiveEdgeRequestEvent extends DOMEvent<void> {}

/**
 * Fired when requesting media playback to begin/resume.
 *
 * @bubbles
 * @composed
 */
export interface MediaPlayRequestEvent extends DOMEvent<void> {}

/**
 * Fired when requesting to change the current video quality to the given index.
 *
 * @bubbles
 * @composed
 */
export interface MediaQualityChangeRequestEvent extends DOMEvent<number> {}

/**
 * Fired when requesting to change the current playback rate.
 *
 * @bubbles
 * @composed
 */
export interface MediaRateChangeRequestEvent extends DOMEvent<number> {}

/**
 * Fired when requesting media playback to temporarily stop.
 *
 * @bubbles
 * @composed
 */
export interface MediaPauseRequestEvent extends DOMEvent<void> {}

/**
 * Fired when requesting a time change. In other words, moving the play head to a new position.
 *
 * @bubbles
 * @composed
 */
export interface MediaSeekRequestEvent extends DOMEvent<number> {}

/**
 * Fired when seeking/scrubbing to a new playback position.
 *
 * @bubbles
 * @composed
 */
export interface MediaSeekingRequestEvent extends DOMEvent<number> {}

/**
 * Fired when requesting the media volume to be set to a new level.
 *
 * @bubbles
 * @composed
 */
export interface MediaVolumeChangeRequestEvent extends DOMEvent<number> {}

/**
 * Fired when user idle state tracking may resume. This is typically called after requesting
 * the idle state to pause via `media-pause-user-idle-request`.
 *
 * @bubbles
 * @composed
 */
export interface MediaResumeUserIdleRequestEvent extends DOMEvent<void> {}

/**
 * Fired when user idle state tracking should pause. This is typically used when a control
 * is being actively interacted with, and we don't want the `idle` state changing until
 * the interaction is complete (eg: scrubbing, or settings is open).
 *
 * @bubbles
 * @composed
 */
export interface MediaPauseUserIdleRequestEvent extends DOMEvent<void> {}

/**
 * Fired when requesting the poster _should_ be rendered by the media provider. This should be
 * fired if a custom poster is _not_ being used.
 *
 * @bubbles
 * @composed
 */
export interface MediaShowPosterRequestEvent extends DOMEvent<void> {}

/**
 * Fired when requesting the poster should _not_ be rendered by the media provider. This
 * should be fired if a custom poster element is being used (e.g., `media-poster`).
 *
 * @bubbles
 * @composed
 */
export interface MediaHidePosterRequestEvent extends DOMEvent<void> {}

/**
 * Internal event that is fired by a media provider when requesting media playback to restart after
 * reaching the end. This event also helps notify the player that media will be looping.
 *
 * @bubbles
 * @composed
 */
export interface MediaLoopRequestEvent extends DOMEvent<void> {}
