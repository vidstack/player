import type { DOMEvent } from 'maverick.js/std';

import type { ScreenOrientationLockType } from '../../foundation/orientation/types';

export interface MediaRequestEvents {
  'media-airplay-request': MediaAirPlayRequestEvent;
  'media-audio-track-change-request': MediaAudioTrackChangeRequestEvent;
  'media-enter-fullscreen-request': MediaEnterFullscreenRequestEvent;
  'media-exit-fullscreen-request': MediaExitFullscreenRequestEvent;
  'media-enter-pip-request': MediaEnterPIPRequestEvent;
  'media-exit-pip-request': MediaExitPIPRequestEvent;
  'media-google-cast-request': MediaGoogleCastRequestEvent;
  'media-live-edge-request': MediaLiveEdgeRequestEvent;
  'media-loop-request': MediaLoopRequestEvent;
  'media-user-loop-change-request': MediaUserLoopChangeRequestEvent;
  'media-orientation-lock-request': MediaOrientationLockRequestEvent;
  'media-orientation-unlock-request': MediaOrientationUnlockRequestEvent;
  'media-mute-request': MediaMuteRequestEvent;
  'media-pause-request': MediaPauseRequestEvent;
  'media-pause-controls-request': MediaPauseControlsRequestEvent;
  'media-play-request': MediaPlayRequestEvent;
  'media-quality-change-request': MediaQualityChangeRequestEvent;
  'media-rate-change-request': MediaRateChangeRequestEvent;
  'media-audio-gain-change-request': MediaAudioGainChangeRequestEvent;
  'media-resume-controls-request': MediaResumeControlsRequestEvent;
  'media-seek-request': MediaSeekRequestEvent;
  'media-seeking-request': MediaSeekingRequestEvent;
  'media-start-loading': MediaStartLoadingRequestEvent;
  'media-poster-start-loading': MediaPosterStartLoadingRequestEvent;
  'media-text-track-change-request': MediaTextTrackChangeRequestEvent;
  'media-unmute-request': MediaUnmuteRequestEvent;
  'media-volume-change-request': MediaVolumeChangeRequestEvent;
}

/**
 * Fired when requesting the AirPlay picker to open.
 *
 * @bubbles
 * @composed
 */
export interface MediaAirPlayRequestEvent extends DOMEvent<void> {}

/**
 * Fired when requesting the media poster to begin loading. This will only take effect if the
 * `posterLoad` strategy on the player is set to `custom`.
 *
 * @bubbles
 * @composed
 */
export interface MediaPosterStartLoadingRequestEvent extends DOMEvent<void> {}

/**
 * Fired when requesting to change the `mode` on a text track at the given index in the
 * `TextTrackList` on the player.
 *
 * @bubbles
 * @composed
 */
export interface MediaTextTrackChangeRequestEvent
  extends DOMEvent<{
    index: number;
    mode: TextTrackMode;
  }> {}

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
 * Fired when requesting to change the current audio track to the given index in the
 * `AudioTrackList` on the player.
 *
 * @bubbles
 * @composed
 */
export interface MediaAudioTrackChangeRequestEvent extends DOMEvent<number> {}

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
 * Fired when requesting media to enter picture-in-picture mode.
 *
 * @bubbles
 * @composed
 */
export interface MediaEnterPIPRequestEvent extends DOMEvent<void> {}

/**
 * Fired when requesting media to exit picture-in-picture mode.
 *
 * @bubbles
 * @composed
 */
export interface MediaExitPIPRequestEvent extends DOMEvent<void> {}

/**
 * Fired when requesting Google Cast.
 *
 * @bubbles
 * @composed
 */
export interface MediaGoogleCastRequestEvent extends DOMEvent<void> {}

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
 * Fired when requesting to change the current video quality to the given index in the
 * `VideoQualityList` on the player.
 *
 * @bubbles
 * @composed
 * @detail qualityIndex
 */
export interface MediaQualityChangeRequestEvent extends DOMEvent<number> {}

/**
 * Fired when requesting to change the current playback rate.
 *
 * @bubbles
 * @composed
 * @detail rate
 */
export interface MediaRateChangeRequestEvent extends DOMEvent<number> {}

/**
 * Fired when requesting to change the current audio gain.
 *
 * @bubbles
 * @composed
 * @detail gain
 */
export interface MediaAudioGainChangeRequestEvent extends DOMEvent<number> {}

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
 * @detail seekTo
 */
export interface MediaSeekRequestEvent extends DOMEvent<number> {}

/**
 * Fired when seeking/scrubbing to a new playback position.
 *
 * @bubbles
 * @composed
 * @detail time
 */
export interface MediaSeekingRequestEvent extends DOMEvent<number> {}

/**
 * Fired when requesting media to begin loading. This will only take effect if the `load`
 * strategy on the player is set to `custom`.
 *
 * @bubbles
 * @composed
 */
export interface MediaStartLoadingRequestEvent extends DOMEvent<void> {}

/**
 * Fired when requesting the media volume to be set to a new level.
 *
 * @bubbles
 * @composed
 * @detail volume
 */
export interface MediaVolumeChangeRequestEvent extends DOMEvent<number> {}

/**
 * Fired when controls visibility tracking may resume. This is typically called after requesting
 * tracking to pause via `media-pause-controls-request`.
 *
 * @bubbles
 * @composed
 */
export interface MediaResumeControlsRequestEvent extends DOMEvent<void> {}

/**
 * Fired when controls visibility tracking should pause. This is typically used when a control
 * is being actively interacted with, and we don't want the controls to be hidden before
 * the interaction is complete (eg: scrubbing, or settings is open).
 *
 * @bubbles
 * @composed
 */
export interface MediaPauseControlsRequestEvent extends DOMEvent<void> {}

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
 * @internal
 * @bubbles
 * @composed
 */
export interface MediaLoopRequestEvent extends DOMEvent<void> {}

/**
 * Fired when the user loop preference changes.
 *
 * @bubbles
 * @composed
 */
export interface MediaUserLoopChangeRequestEvent extends DOMEvent<boolean> {}

/**
 * Fired when requesting the screen orientation to be locked to a certain type.
 *
 * @bubbles
 * @composed
 */
export interface MediaOrientationLockRequestEvent extends DOMEvent<ScreenOrientationLockType> {}

/**
 * Fired when requesting the screen orientation to be unlocked.
 *
 * @bubbles
 * @composed
 */
export interface MediaOrientationUnlockRequestEvent extends DOMEvent<void> {}
