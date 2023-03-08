import { DOMEvent } from 'maverick.js/std';

import type { Logger } from '../../foundation/logger/create-logger';
import type { MediaPlayerElement } from '../element/types';
import type { MediaFullscreenRequestTarget, MediaRequestEvents } from './request-events';

/**
 * A simple facade for dispatching media requests to the nearest media player element.
 *
 * @docs {@link https://www.vidstack.io/docs/player/core-concepts/state-management#media-remote}
 * @docs {@link https://www.vidstack.io/docs/react/player/core-concepts/state-management#updating}
 *
 */
export class MediaRemoteControl {
  protected _target: EventTarget | null = null;
  protected _player: MediaPlayerElement | null = null;

  constructor(protected _logger?: Logger) {}

  /**
   * Set the target from which to dispatch media requests events from. The events should bubble
   * up from this target to the `<media-player>` element.
   *
   * @example
   * ```ts
   * const button = document.querySelector('button');
   * remote.setTarget(button);
   * ```
   */
  setTarget(target: EventTarget | null) {
    this._target = target;
    if (__DEV__) this._logger?.setTarget(target);
  }

  /**
   * Returns the current `<media-player>` element. This method will attempt to find the player by
   * searching up from either the given `target` or default target set via `remote.setTarget`.
   *
   * @example
   * ```ts
   * const player = remote.getPlayer();
   * ```
   */
  getPlayer(target?: EventTarget | null): MediaPlayerElement | null {
    if (this._player) return this._player;

    (target ?? this._target)?.dispatchEvent(
      new DOMEvent('find-media-player', {
        detail: (player) => void (this._player = player),
        bubbles: true,
        composed: true,
      }),
    );

    return this._player;
  }

  /**
   * Set the current `<media-player>` element so the remote can support toggle methods such as
   * `togglePaused` as they rely on the current media state.
   */
  setPlayer(player: MediaPlayerElement | null) {
    this._player = player;
  }

  /**
   * Dispatch a request to start the media loading process. This will only work if the media
   * player has been initialized with a custom loading strategy `<media-player load="custom">`.
   *
   * @docs {@link https://www.vidstack.io/docs/react/player/core-concepts/loading#loading-strategies}
   */
  startLoading(trigger?: Event) {
    this._dispatchRequest('media-start-loading', trigger);
  }

  /**
   * Dispatch a request to begin/resume media playback.
   */
  play(trigger?: Event) {
    this._dispatchRequest('media-play-request', trigger);
  }

  /**
   * Dispatch a request to pause media playback.
   */
  pause(trigger?: Event) {
    this._dispatchRequest('media-pause-request', trigger);
  }

  /**
   * Dispatch a request to set the media volume to mute (0).
   */
  mute(trigger?: Event) {
    this._dispatchRequest('media-mute-request', trigger);
  }

  /**
   * Dispatch a request to unmute the media volume and set it back to it's previous state.
   */
  unmute(trigger?: Event) {
    this._dispatchRequest('media-unmute-request', trigger);
  }

  /**
   * Dispatch a request to enter fullscreen.
   *
   * @docs {@link https://www.vidstack.io/docs/react/player/core-concepts/fullscreen#media-remote}
   */
  enterFullscreen(target?: MediaFullscreenRequestTarget, trigger?: Event) {
    this._dispatchRequest('media-enter-fullscreen-request', trigger, target);
  }

  /**
   * Dispatch a request to exit fullscreen.
   *
   * @docs {@link https://www.vidstack.io/docs/react/player/core-concepts/fullscreen#media-remote}
   */
  exitFullscreen(target?: MediaFullscreenRequestTarget, trigger?: Event) {
    this._dispatchRequest('media-exit-fullscreen-request', trigger, target);
  }

  /**
   * Notify the media player that a seeking process is happening and to seek to the given `time`.
   */
  seeking(time: number, trigger?: Event) {
    this._dispatchRequest('media-seeking-request', trigger, time);
  }

  /**
   * Notify the media player that a seeking operation has completed and to seek to the given `time`.
   * This is generally called after a series of `remote.seeking()` calls.
   */
  seek(time: number, trigger?: Event) {
    this._dispatchRequest('media-seek-request', trigger, time);
  }

  seekToLiveEdge(trigger?: Event) {
    this._dispatchRequest('media-live-edge-request', trigger);
  }

  /**
   * Dispatch a request to update the media volume to the given `volume` level which is a value
   * between 0 and 1.
   *
   * @example
   * ```ts
   * remote.changeVolume(0); // 0%
   * remote.changeVolume(0.05); // 5%
   * remote.changeVolume(0.5); // 50%
   * remote.changeVolume(0.75); // 70%
   * remote.changeVolume(1); // 100%
   * ```
   */
  changeVolume(volume: number, trigger?: Event) {
    this._dispatchRequest('media-volume-change-request', trigger, Math.max(0, Math.min(1, volume)));
  }

  /**
   * Dispatch a request to change the video quality. The special value `-1` represents auto quality
   * selection.
   *
   * @example
   * ```ts
   * remote.changeQuality(-1); // auto
   * remote.changeQuality(1); // quality at index 1
   * ```
   */
  changeQuality(index: number, trigger?: Event) {
    this._dispatchRequest('media-quality-change-request', trigger, index);
  }

  /**
   * Dispatch a request to change the media playback rate.
   *
   * @example
   * ```ts
   * remote.changePlaybackRate(0.5); // Half the normal speed
   * remote.changePlaybackRate(1); // Normal speed
   * remote.changePlaybackRate(1.5); // 50% faster than normal
   * remote.changePlaybackRate(2); // Double the normal speed
   * ```
   */
  changePlaybackRate(rate: number, trigger?: Event) {
    this._dispatchRequest('media-rate-change-request', trigger, rate);
  }

  /**
   * Dispatch a request to resume user idle tracking. Refer to {@link MediaRemoteControl.pauseUserIdle}
   * for more information.
   */
  resumeUserIdle(trigger?: Event) {
    this._dispatchRequest('media-resume-user-idle-request', trigger);
  }

  /**
   * Dispatch a request to pause user idle tracking. Pausing tracking will result in the `user-idle`
   * attribute and state being `false` until `remote.resumeUserIdle()` is called. This method
   * is generally used when building custom controls and you'd like to prevent the UI from
   * dissapearing.
   *
   * @example
   * ```ts
   * // Prevent user idling while menu is being interacted with.
   * function onSettingsOpen() {
   *   remote.pauseUserIdle();
   * }
   *
   * function onSettingsClose() {
   *   remote.resumeUserIdle();
   * }
   * ```
   */
  pauseUserIdle(trigger?: Event) {
    this._dispatchRequest('media-pause-user-idle-request', trigger);
  }

  /**
   * Dispatch a request to load and show the native poster element.
   */
  showPoster(trigger?: Event) {
    this._dispatchRequest('media-show-poster-request', trigger);
  }

  /**
   * Dispatch a request to prevent loading and to hide the native poster element.
   */
  hidePoster(trigger?: Event) {
    this._dispatchRequest('media-hide-poster-request', trigger);
  }

  /**
   * Dispatch a request to toggle the media playback state.
   */
  togglePaused(trigger?: Event) {
    const player = this.getPlayer(trigger?.target);

    if (!player) {
      if (__DEV__) this._noPlayerWarning(this.togglePaused.name);
      return;
    }

    if (player.state.paused) this.play(trigger);
    else this.pause(trigger);
  }

  /**
   * Dispatch a request to toggle the media muted state.
   */
  toggleMuted(trigger?: Event) {
    const player = this.getPlayer(trigger?.target);

    if (!player) {
      if (__DEV__) this._noPlayerWarning(this.toggleMuted.name);
      return;
    }

    if (player.state.muted) this.unmute(trigger);
    else this.mute(trigger);
  }

  /**
   * Dispatch a request to toggle the media fullscreen state.
   *
   * @docs {@link https://www.vidstack.io/docs/react/player/core-concepts/fullscreen#media-remote}
   */
  toggleFullscreen(target?: MediaFullscreenRequestTarget, trigger?: Event) {
    const player = this.getPlayer(trigger?.target);

    if (!player) {
      if (__DEV__) this._noPlayerWarning(this.toggleFullscreen.name);
      return;
    }

    if (player.state.fullscreen) this.exitFullscreen(target, trigger);
    else this.enterFullscreen(target, trigger);
  }

  protected _dispatchRequest<EventType extends keyof MediaRequestEvents>(
    type: EventType,
    trigger?: Event,
    detail?: MediaRequestEvents[EventType]['detail'],
  ) {
    const request = new DOMEvent<any>(type, {
      bubbles: true,
      composed: true,
      detail,
      trigger,
    });

    const target =
      trigger?.target === document ||
      trigger?.target === window ||
      trigger?.target === document.body
        ? this._target ?? this.getPlayer()
        : trigger?.target ?? this._target;

    if (__DEV__) {
      this._logger
        ?.infoGroup(`📨 dispatching \`${type}\``)
        .labelledLog('Target', target)
        .labelledLog('Player', this._player)
        .labelledLog('Request Event', request)
        .labelledLog('Trigger Event', trigger)
        .dispatch();
    }

    target?.dispatchEvent(request);
  }

  private _noPlayerWarning(method: string) {
    if (__DEV__) {
      console.warn(
        `[vidstack] attempted to call \`MediaRemoteControl.${method}\`() that requires` +
          ' player but failed because remote could not find a parent player element from target',
      );
    }
  }
}
