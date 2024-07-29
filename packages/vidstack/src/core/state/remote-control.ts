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
 * @docs {@link https://www.vidstack.io/docs/player/core-concepts/state-management#updating}
 *
 */
export class MediaRemoteControl {
  #target: EventTarget | null = null;
  #player: MediaPlayer | null = null;
  #prevTrackIndex = -1;
  #logger?: Logger;

  constructor(logger = __DEV__ ? new Logger() : undefined) {
    this.#logger = logger;
  }

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
    this.#target = target;
    if (__DEV__) this.#logger?.setTarget(target);
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
    if (this.#player) return this.#player;

    (target ?? this.#target)?.dispatchEvent(
      new DOMEvent('find-media-player', {
        detail: (player) => void (this.#player = player),
        bubbles: true,
        composed: true,
      }),
    );

    return this.#player;
  }

  /**
   * Set the current player element so the remote can support toggle methods such as
   * `togglePaused` as they rely on the current media state.
   */
  setPlayer(player: MediaPlayer | null) {
    this.#player = player;
  }

  /**
   * Dispatch a request to start the media loading process. This will only work if the media
   * player has been initialized with a custom loading strategy `load="custom">`.
   *
   * @docs {@link https://www.vidstack.io/docs/player/core-concepts/loading#load-strategies}
   */
  startLoading(trigger?: Event) {
    this.#dispatchRequest('media-start-loading', trigger);
  }

  /**
   * Dispatch a request to start the poster loading process. This will only work if the media
   * player has been initialized with a custom poster loading strategy `posterLoad="custom">`.
   *
   * @docs {@link https://www.vidstack.io/docs/player/core-concepts/loading#load-strategies}
   */
  startLoadingPoster(trigger?: Event) {
    this.#dispatchRequest('media-poster-start-loading', trigger);
  }

  /**
   * Dispatch a request to connect to AirPlay.
   *
   * @see {@link https://www.apple.com/au/airplay}
   */
  requestAirPlay(trigger?: Event) {
    this.#dispatchRequest('media-airplay-request', trigger);
  }

  /**
   * Dispatch a request to connect to Google Cast.
   *
   * @see {@link https://developers.google.com/cast/docs/overview}
   */
  requestGoogleCast(trigger?: Event) {
    this.#dispatchRequest('media-google-cast-request', trigger);
  }

  /**
   * Dispatch a request to begin/resume media playback.
   */
  play(trigger?: Event) {
    this.#dispatchRequest('media-play-request', trigger);
  }

  /**
   * Dispatch a request to pause media playback.
   */
  pause(trigger?: Event) {
    this.#dispatchRequest('media-pause-request', trigger);
  }

  /**
   * Dispatch a request to set the media volume to mute (0).
   */
  mute(trigger?: Event) {
    this.#dispatchRequest('media-mute-request', trigger);
  }

  /**
   * Dispatch a request to unmute the media volume and set it back to it's previous state.
   */
  unmute(trigger?: Event) {
    this.#dispatchRequest('media-unmute-request', trigger);
  }

  /**
   * Dispatch a request to enter fullscreen.
   *
   * @docs {@link https://www.vidstack.io/docs/player/api/fullscreen#remote-control}
   */
  enterFullscreen(target?: MediaFullscreenRequestTarget, trigger?: Event) {
    this.#dispatchRequest('media-enter-fullscreen-request', trigger, target);
  }

  /**
   * Dispatch a request to exit fullscreen.
   *
   * @docs {@link https://www.vidstack.io/docs/player/api/fullscreen#remote-control}
   */
  exitFullscreen(target?: MediaFullscreenRequestTarget, trigger?: Event) {
    this.#dispatchRequest('media-exit-fullscreen-request', trigger, target);
  }

  /**
   * Dispatch a request to lock the screen orientation.
   *
   * @docs {@link https://www.vidstack.io/docs/player/screen-orientation#remote-control}
   */
  lockScreenOrientation(lockType: ScreenOrientationLockType, trigger?: Event) {
    this.#dispatchRequest('media-orientation-lock-request', trigger, lockType);
  }

  /**
   * Dispatch a request to unlock the screen orientation.
   *
   * @docs {@link https://www.vidstack.io/docs/player/api/screen-orientation#remote-control}
   */
  unlockScreenOrientation(trigger?: Event) {
    this.#dispatchRequest('media-orientation-unlock-request', trigger);
  }

  /**
   * Dispatch a request to enter picture-in-picture mode.
   *
   * @docs {@link https://www.vidstack.io/docs/player/api/picture-in-picture#remote-control}
   */
  enterPictureInPicture(trigger?: Event) {
    this.#dispatchRequest('media-enter-pip-request', trigger);
  }

  /**
   * Dispatch a request to exit picture-in-picture mode.
   *
   * @docs {@link https://www.vidstack.io/docs/player/api/picture-in-picture#remote-control}
   */
  exitPictureInPicture(trigger?: Event) {
    this.#dispatchRequest('media-exit-pip-request', trigger);
  }

  /**
   * Notify the media player that a seeking process is happening and to seek to the given `time`.
   */
  seeking(time: number, trigger?: Event) {
    this.#dispatchRequest('media-seeking-request', trigger, time);
  }

  /**
   * Notify the media player that a seeking operation has completed and to seek to the given `time`.
   * This is generally called after a series of `remote.seeking()` calls.
   */
  seek(time: number, trigger?: Event) {
    this.#dispatchRequest('media-seek-request', trigger, time);
  }

  seekToLiveEdge(trigger?: Event) {
    this.#dispatchRequest('media-live-edge-request', trigger);
  }

  /**
   * Dispatch a request to update the length of the media in seconds.
   *
   * @example
   * ```ts
   * remote.changeDuration(100); // 100 seconds
   * ```
   */
  changeDuration(duration: number, trigger?: Event) {
    this.#dispatchRequest('media-duration-change-request', trigger, duration);
  }

  /**
   * Dispatch a request to update the clip start time. This is the time at which media playback
   * should start at.
   *
   * @example
   * ```ts
   * remote.changeClipStart(100); // start at 100 seconds
   * ```
   */
  changeClipStart(startTime: number, trigger?: Event) {
    this.#dispatchRequest('media-clip-start-change-request', trigger, startTime);
  }

  /**
   * Dispatch a request to update the clip end time. This is the time at which media playback
   * should end at.
   *
   * @example
   * ```ts
   * remote.changeClipEnd(100); // end at 100 seconds
   * ```
   */
  changeClipEnd(endTime: number, trigger?: Event) {
    this.#dispatchRequest('media-clip-end-change-request', trigger, endTime);
  }

  /**
   * Dispatch a request to update the media volume to the given `volume` level which is a value
   * between 0 and 1.
   *
   * @docs {@link https://www.vidstack.io/docs/player/api/audio-gain#remote-control}
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
    this.#dispatchRequest('media-volume-change-request', trigger, Math.max(0, Math.min(1, volume)));
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
    this.#dispatchRequest('media-audio-track-change-request', trigger, index);
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
    this.#dispatchRequest('media-quality-change-request', trigger, index);
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
    this.#dispatchRequest('media-text-track-change-request', trigger, {
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
    this.#dispatchRequest('media-rate-change-request', trigger, rate);
  }

  /**
   * Dispatch a request to change the media audio gain.
   *
   * @example
   * ```ts
   * remote.changeAudioGain(1); // Disable audio gain
   * remote.changeAudioGain(1.5); // 50% louder
   * remote.changeAudioGain(2); // 100% louder
   * ```
   */
  changeAudioGain(gain: number, trigger?: Event) {
    this.#dispatchRequest('media-audio-gain-change-request', trigger, gain);
  }

  /**
   * Dispatch a request to resume idle tracking on controls.
   */
  resumeControls(trigger?: Event) {
    this.#dispatchRequest('media-resume-controls-request', trigger);
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
    this.#dispatchRequest('media-pause-controls-request', trigger);
  }

  /**
   * Dispatch a request to toggle the media playback state.
   */
  togglePaused(trigger?: Event) {
    const player = this.getPlayer(trigger?.target);

    if (!player) {
      if (__DEV__) this.#noPlayerWarning(this.togglePaused.name);
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
      if (__DEV__) this.#noPlayerWarning(this.toggleControls.name);
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
      if (__DEV__) this.#noPlayerWarning(this.toggleMuted.name);
      return;
    }

    if (player.state.muted) this.unmute(trigger);
    else this.mute(trigger);
  }

  /**
   * Dispatch a request to toggle the media fullscreen state.
   *
   * @docs {@link https://www.vidstack.io/docs/player/api/fullscreen#remote-control}
   */
  toggleFullscreen(target?: MediaFullscreenRequestTarget, trigger?: Event) {
    const player = this.getPlayer(trigger?.target);

    if (!player) {
      if (__DEV__) this.#noPlayerWarning(this.toggleFullscreen.name);
      return;
    }

    if (player.state.fullscreen) this.exitFullscreen(target, trigger);
    else this.enterFullscreen(target, trigger);
  }

  /**
   * Dispatch a request to toggle the media picture-in-picture mode.
   *
   * @docs {@link https://www.vidstack.io/docs/player/api/picture-in-picture#remote-control}
   */
  togglePictureInPicture(trigger?: Event) {
    const player = this.getPlayer(trigger?.target);

    if (!player) {
      if (__DEV__) this.#noPlayerWarning(this.togglePictureInPicture.name);
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
      if (__DEV__) this.#noPlayerWarning(this.showCaptions.name);
      return;
    }

    let tracks = player.state.textTracks,
      index = this.#prevTrackIndex;

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

    this.#prevTrackIndex = -1;
  }

  /**
   * Turn captions off.
   */
  disableCaptions(trigger?: Event) {
    const player = this.getPlayer(trigger?.target);

    if (!player) {
      if (__DEV__) this.#noPlayerWarning(this.disableCaptions.name);
      return;
    }

    const tracks = player.state.textTracks,
      track = player.state.textTrack;

    if (track) {
      const index = tracks.indexOf(track);
      this.changeTextTrackMode(index, 'disabled', trigger);
      this.#prevTrackIndex = index;
    }
  }

  /**
   * Dispatch a request to toggle the current captions mode.
   */
  toggleCaptions(trigger?: Event) {
    const player = this.getPlayer(trigger?.target);

    if (!player) {
      if (__DEV__) this.#noPlayerWarning(this.toggleCaptions.name);
      return;
    }

    if (player.state.textTrack) {
      this.disableCaptions();
    } else {
      this.showCaptions();
    }
  }

  userPrefersLoopChange(prefersLoop: boolean, trigger?: Event) {
    this.#dispatchRequest('media-user-loop-change-request', trigger, prefersLoop);
  }

  #dispatchRequest<EventType extends keyof MediaRequestEvents>(
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
      (this.#player?.el && target instanceof Node && !this.#player.el.contains(target));

    target = shouldUsePlayer ? (this.#target ?? this.getPlayer()?.el) : (target ?? this.#target);

    if (__DEV__) {
      this.#logger
        ?.debugGroup(`📨 dispatching \`${type}\``)
        .labelledLog('Target', target)
        .labelledLog('Player', this.#player)
        .labelledLog('Request Event', request)
        .labelledLog('Trigger Event', trigger)
        .dispatch();
    }

    if (this.#player) {
      // Special case if the player load strategy is set to `play`.
      if (type === 'media-play-request' && !this.#player.state.canLoad) {
        target?.dispatchEvent(request);
      } else {
        this.#player.canPlayQueue.enqueue(type, () => target?.dispatchEvent(request));
      }
    } else {
      target?.dispatchEvent(request);
    }
  }

  #noPlayerWarning(method: string) {
    if (__DEV__) {
      console.warn(
        `[vidstack] attempted to call \`MediaRemoteControl.${method}\`() that requires` +
          ' player but failed because remote could not find a parent player element from target',
      );
    }
  }
}
