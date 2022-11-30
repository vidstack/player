import type { DOMEvent } from 'maverick.js/std';

declare global {
  interface MaverickEventRecord extends MediaRequestEvents {}
}

export type MediaRequestEvents = {
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
};

/**
 * Fired when requesting media to begin loading. This will only take effect if the `loading`
 * strategy on the provider is set to `custom`.
 *
 * @event
 * @bubbles
 * @composed
 */
export type StartLoadingRequestEvent = DOMEvent<void>;

/**
 * Fired when requesting the media to be muted.
 *
 * @event
 * @bubbles
 * @composed
 */
export type MuteRequestEvent = DOMEvent<void>;

/**
 * Fired when requesting the media to be unmuted.
 *
 * @event
 * @bubbles
 * @composed
 */
export type UnmuteRequestEvent = DOMEvent<void>;

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
 * @event
 * @bubbles
 * @composed
 */
export type EnterFullscreenRequestEvent = DOMEvent<MediaFullscreenRequestTarget>;

/**
 * Fired when requesting media to exit fullscreen. The event `detail` can specify the fullscreen
 * target, which can be the media or provider element (defaults to `media`).
 *
 * @event
 * @bubbles
 * @composed
 */
export type ExitFullscreenRequestEvent = DOMEvent<MediaFullscreenRequestTarget>;

/**
 * Fired when requesting media playback to begin/resume.
 *
 * @event
 * @bubbles
 * @composed
 */
export type PlayRequestEvent = DOMEvent<void>;

/**
 * Fired when requesting media playback to temporarily stop.
 *
 * @event
 * @bubbles
 * @composed
 */
export type PauseRequestEvent = DOMEvent<void>;

/**
 * Fired when requesting a time change. In other words, moving the playhead to a new position.
 *
 * @event
 * @bubbles
 * @composed
 */
export type SeekRequestEvent = DOMEvent<number>;

/**
 * Fired when seeking/scrubbing to a new playback position.
 *
 * @event
 * @bubbles
 * @composed
 */
export type SeekingRequestEvent = DOMEvent<number>;

/**
 * Fired when requesting the media volume to be set to a new level.
 *
 * @event
 * @bubbles
 * @composed
 */
export type VolumeChangeRequestEvent = DOMEvent<number>;

/**
 * Fired when user idle state tracking may resume. This is typically called after requesting
 * the idle state to pause via `vds-pause-user-idle-request`.
 *
 * @event
 * @bubbles
 * @composed
 */
export type ResumeUserIdleRequestEvent = DOMEvent<void>;

/**
 * Fired when user idle state tracking should pause. This is typically used when a control
 * is being actively interacted with, and we don't want the `idle` state changing until
 * the interaction is complete (eg: scrubbing, or settings is open).
 *
 * @event
 * @bubbles
 * @composed
 */
export type PauseUserIdleRequestEvent = DOMEvent<void>;

/**
 * Fired when requesting the poster _should_ be rendered by the media provider element. This
 * should be fired if a custom poster element is _not_ being used.
 *
 * @event
 * @bubbles
 * @composed
 */
export type ShowPosterRequestEvent = DOMEvent<void>;

/**
 * Fired when requesting the poster should _not_ be rendered by the media provider element. This
 * should be fired if a custom poster element is being used (eg: `vds-poster`).
 *
 * @event
 * @bubbles
 * @composed
 */
export type HidePosterRequestEvent = DOMEvent<void>;

/**
 * Internal event that is fired by a media provider when requesting media playback to restart after
 * reaching the end. This event also helps notify the media controller that media will be looping.
 *
 * @event
 * @bubbles
 * @composed
 */
export type LoopRequestEvent = DOMEvent<void>;
