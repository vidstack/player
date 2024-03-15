import { Component } from 'maverick.js';
import { DOMEvent } from 'maverick.js/std';

import type { ScreenOrientationLockType } from '../..';
import type { MediaPlayer } from '../../components/player';
import { Logger } from '../../foundation/logger/controller';
import type { MediaFullscreenRequestTarget, MediaRequestEvents } from '../api/media-request-events';
import { isTrackCaptionKind } from '../tracks/text/text-track';

/**
 * A simple facade for dispatching media requests to the nearest media player element.
 *
 * @docs {@link https://www.vidstack.io/docs/player/core-concepts/state#remote-control}
 * @docs {@link https://www.vidstack.io/docs/player/core-concepts/state#updating}
 *
 */
export class MediaRemoteControl {
  private _target: EventTarget | null = null;
  private _player: MediaPlayer | null = null;
  private _prevTrackIndex = -1;

  constructor(private _logger = __DEV__ ? new Logger() : undefined) {}

  /**
   * Set the target from which to dispatch media requests events from. The events should bubble
   * up from this target to the player element.
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
   * Returns the current player element. This method will attempt to find the player by
   * searching up from either the given `target` or default target set via `remote.setTarget`.
   *
   * @example
   * ```ts
   * const player = remote.getPlayer();
   * ```
   */
  getPlayer(target?: EventTarget | null): MediaPlayer | null {
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
   * Set the current player element so the remote can support toggle methods such as
   * `togglePaused` as they rely on the current media state.
   */
  setPlayer(player: MediaPlayer | null) {
    this._player = player;
  }

  /**
   * Dispatch a request to start the media loading process. This will only work if the media
   * player has been initialized with a custom loading strategy `load="custom">`.
   *
   * @docs {@link https://www.vidstack.io/docs/player/core-concepts/loading#loading-strategies}
   */
  startLoading(trigger?: Event) {
    this._dispatchRequest('media-start-loading', trigger);
  }

  /**
   * Dispatch a request to start the poster loading process. This will only work if the media
   * player has been initialized with a custom poster loading strategy `posterLoad="custom">`.
   *
   * @docs {@link https://www.vidstack.io/docs/player/core-concepts/loading#loading-strategies}
   */
  startLoadingPoster(trigger?: Event) {
    this._dispatchRequest('media-poster-start-loading', trigger);
  }

  /**
   * Dispatch a request to connect to AirPlay.
   *
   * @see {@link https://www.apple.com/au/airplay}
   */
  requestAirPlay(trigger?: Event) {
    this._dispatchRequest('media-airplay-request', trigger);
  }

  /**
   * Dispatch a request to connect to Google Cast.
   *
   * @see {@link https://developers.google.com/cast/docs/overview}
   */
  requestGoogleCast(trigger?: Event) {
    this._dispatchRequest('media-google-cast-request', trigger);
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
   * @docs {@link https://www.vidstack.io/docs/player/core-concepts/fullscreen#remote-control}
   */
  enterFullscreen(target?: MediaFullscreenRequestTarget, trigger?: Event) {
    this._dispatchRequest('media-enter-fullscreen-request', trigger, target);
  }

  /**
   * Dispatch a request to exit fullscreen.
   *
   * @docs {@link https://www.vidstack.io/docs/player/core-concepts/fullscreen#remote-control}
   */
  exitFullscreen(target?: MediaFullscreenRequestTarget, trigger?: Event) {
    this._dispatchRequest('media-exit-fullscreen-request', trigger, target);
  }

  /**
   * Dispatch a request to lock the screen orientation.
   *
   * @docs {@link https://www.vidstack.io/docs/player/core-concepts/screen-orientation#remote-control}
   */
  lockScreenOrientation(lockType: ScreenOrientationLockType, trigger?: Event) {
    this._dispatchRequest('media-orientation-lock-request', trigger, lockType);
  }

  /**
   * Dispatch a request to unlock the screen orientation.
   *
   * @docs {@link https://www.vidstack.io/docs/player/core-concepts/screen-orientation#remote-control}
   */
  unlockScreenOrientation(trigger?: Event) {
    this._dispatchRequest('media-orientation-unlock-request', trigger);
  }

  /**
   * Dispatch a request to enter picture-in-picture mode.
   *
   * @docs {@link https://www.vidstack.io/docs/player/core-concepts/picture-in-picture#remote-control}
   */
  enterPictureInPicture(trigger?: Event) {
    this._dispatchRequest('media-enter-pip-request', trigger);
  }

  /**
   * Dispatch a request to exit picture-in-picture mode.
   *
   * @docs {@link https://www.vidstack.io/docs/player/core-concepts/picture-in-picture#remote-control}
   */
  exitPictureInPicture(trigger?: Event) {
    this._dispatchRequest('media-exit-pip-request', trigger);
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
   * Dispatch a request to change the current audio track.
   *
   * @example
   * ```ts
   * remote.changeAudioTrack(1); // track at index 1
   * ```
   */
  changeAudioTrack(index: number, trigger?: Event) {
    this._dispatchRequest('media-audio-track-change-request', trigger, index);
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
   * Request auto quality selection.
   */
  requestAutoQuality(trigger?: Event) {
    this.changeQuality(-1, trigger);
  }

  /**
   * Dispatch a request to change the mode of the text track at the given index.
   *
   * @example
   * ```ts
   * remote.changeTextTrackMode(1, 'showing'); // track at index 1
   * ```
   */
  changeTextTrackMode(index: number, mode: TextTrackMode, trigger?: Event) {
    this._dispatchRequest('media-text-track-change-request', trigger, {
      index,
      mode,
    });
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
   * Dispatch a request to change the media audio gain.
   *
   * @example
   * ```ts
   * remote.changeAudioGain(1); // Disable audio gain (100% of current volume)
   * remote.changeAudioGain(1.5); // 150% louder than current volume
   * remote.changeAudioGain(2); // 200% louder than current volume
   * ```
   */
  changeAudioGain(gain: number, trigger?: Event) {
    this._dispatchRequest('media-audio-gain-change-request', trigger, gain);
  }

  /**
   * Dispatch a request to resume idle tracking on controls.
   */
  resumeControls(trigger?: Event) {
    this._dispatchRequest('media-resume-controls-request', trigger);
  }

  /**
   * Dispatch a request to pause controls idle tracking. Pausing tracking will result in the
   * controls being visible until `remote.resumeControls()` is called. This method
   * is generally used when building custom controls and you'd like to prevent the UI from
   * disappearing.
   *
   * @example
   * ```ts
   * // Prevent controls hiding while menu is being interacted with.
   * function onSettingsOpen() {
   *   remote.pauseControls();
   * }
   *
   * function onSettingsClose() {
   *   remote.resumeControls();
   * }
   * ```
   */
  pauseControls(trigger?: Event) {
    this._dispatchRequest('media-pause-controls-request', trigger);
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
   * Dispatch a request to toggle the controls visibility.
   */
  toggleControls(trigger?: Event) {
    const player = this.getPlayer(trigger?.target);

    if (!player) {
      if (__DEV__) this._noPlayerWarning(this.toggleControls.name);
      return;
    }

    if (!player.controls.showing) {
      player.controls.show(0, trigger);
    } else {
      player.controls.hide(0, trigger);
    }
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
   * @docs {@link https://www.vidstack.io/docs/player/core-concepts/fullscreen#remote-control}
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

  /**
   * Dispatch a request to toggle the media picture-in-picture mode.
   *
   * @docs {@link https://www.vidstack.io/docs/player/core-concepts/picture-in-picture#remote-control}
   */
  togglePictureInPicture(trigger?: Event) {
    const player = this.getPlayer(trigger?.target);

    if (!player) {
      if (__DEV__) this._noPlayerWarning(this.togglePictureInPicture.name);
      return;
    }

    if (player.state.pictureInPicture) this.exitPictureInPicture(trigger);
    else this.enterPictureInPicture(trigger);
  }

  /**
   * Show captions.
   */
  showCaptions(trigger?: Event) {
    const player = this.getPlayer(trigger?.target);

    if (!player) {
      if (__DEV__) this._noPlayerWarning(this.showCaptions.name);
      return;
    }

    let tracks = player.state.textTracks,
      index = this._prevTrackIndex;

    if (!tracks[index] || !isTrackCaptionKind(tracks[index])) {
      index = -1;
    }

    if (index === -1) {
      index = tracks.findIndex((track) => isTrackCaptionKind(track) && track.default);
    }

    if (index === -1) {
      index = tracks.findIndex((track) => isTrackCaptionKind(track));
    }

    if (index >= 0) this.changeTextTrackMode(index, 'showing', trigger);

    this._prevTrackIndex = -1;
  }

  /**
   * Turn captions off.
   */
  disableCaptions(trigger?: Event) {
    const player = this.getPlayer(trigger?.target);

    if (!player) {
      if (__DEV__) this._noPlayerWarning(this.disableCaptions.name);
      return;
    }

    const tracks = player.state.textTracks,
      track = player.state.textTrack;

    if (track) {
      const index = tracks.indexOf(track);
      this.changeTextTrackMode(index, 'disabled', trigger);
      this._prevTrackIndex = index;
    }
  }

  /**
   * Dispatch a request to toggle the current captions mode.
   */
  toggleCaptions(trigger?: Event) {
    const player = this.getPlayer(trigger?.target);

    if (!player) {
      if (__DEV__) this._noPlayerWarning(this.toggleCaptions.name);
      return;
    }

    if (player.state.textTrack) {
      this.disableCaptions();
    } else {
      this.showCaptions();
    }
  }

  userPrefersLoopChange(prefersLoop: boolean, trigger?: Event) {
    this._dispatchRequest('media-user-loop-change-request', trigger, prefersLoop);
  }

  private _dispatchRequest<EventType extends keyof MediaRequestEvents>(
    type: EventType,
    trigger?: Event,
    detail?: MediaRequestEvents[EventType]['detail'],
  ) {
    const request = new DOMEvent<any>(type, {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail,
      trigger,
    });

    let target: EventTarget | undefined | null = trigger?.target || null;
    if (target && target instanceof Component) target = target.el;

    const shouldUsePlayer =
      !target ||
      target === document ||
      target === window ||
      target === document.body ||
      (this._player?.el && target instanceof Node && !this._player.el.contains(target));

    target = shouldUsePlayer ? this._target ?? this.getPlayer()?.el : target ?? this._target;

    if (__DEV__) {
      this._logger
        ?.debugGroup(`📨 dispatching \`${type}\``)
        .labelledLog('Target', target)
        .labelledLog('Player', this._player)
        .labelledLog('Request Event', request)
        .labelledLog('Trigger Event', trigger)
        .dispatch();
    }

    if (this._player) {
      // Special case if the player load strategy is set to `play`.
      if (type === 'media-play-request' && !this._player.state.canLoad) {
        target?.dispatchEvent(request);
      } else {
        this._player.canPlayQueue._enqueue(type, () => target?.dispatchEvent(request));
      }
    } else {
      target?.dispatchEvent(request);
    }
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
