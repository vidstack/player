import { DOMEvent } from 'maverick.js/std';

import type { Logger } from '../../foundation/logger/create-logger';
import type { MediaPlayerElement } from '../element/types';
import type { MediaFullscreenRequestTarget, MediaRequestEvents } from './request-events';

/**
 * A simple facade for dispatching media requests to the nearest media controller.
 */
export class MediaRemoteControl {
  protected _target: EventTarget | null = null;
  protected _player: MediaPlayerElement | null = null;

  constructor(protected _logger?: Logger) {}

  setTarget(target: EventTarget | null) {
    this._target = target;
    if (__DEV__) this._logger?.setTarget(target);
  }

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

  setPlayer(player: MediaPlayerElement | null) {
    this._player = player;
  }

  startLoading(trigger?: Event) {
    this._dispatchRequest('media-start-loading', trigger);
  }

  play(trigger?: Event) {
    this._dispatchRequest('media-play-request', trigger);
  }

  pause(trigger?: Event) {
    this._dispatchRequest('media-pause-request', trigger);
  }

  mute(trigger?: Event) {
    this._dispatchRequest('media-mute-request', trigger);
  }

  unmute(trigger?: Event) {
    this._dispatchRequest('media-unmute-request', trigger);
  }

  enterFullscreen(target?: MediaFullscreenRequestTarget, trigger?: Event) {
    this._dispatchRequest('media-enter-fullscreen-request', trigger, target);
  }

  exitFullscreen(target?: MediaFullscreenRequestTarget, trigger?: Event) {
    this._dispatchRequest('media-exit-fullscreen-request', trigger, target);
  }

  seeking(time: number, trigger?: Event) {
    this._dispatchRequest('media-seeking-request', trigger, time);
  }

  seek(time: number, trigger?: Event) {
    this._dispatchRequest('media-seek-request', trigger, time);
  }

  changeVolume(volume: number, trigger?: Event) {
    this._dispatchRequest('media-volume-change-request', trigger, volume);
  }

  resumeUserIdle(trigger?: Event) {
    this._dispatchRequest('media-resume-user-idle-request', trigger);
  }

  pauseUserIdle(trigger?: Event) {
    this._dispatchRequest('media-pause-user-idle-request', trigger);
  }

  showPoster(trigger?: Event) {
    this._dispatchRequest('media-show-poster-request', trigger);
  }

  hidePoster(trigger?: Event) {
    this._dispatchRequest('media-hide-poster-request', trigger);
  }

  togglePaused(trigger?: Event) {
    const player = this.getPlayer(trigger?.target);

    if (!player) {
      if (__DEV__) this._noPlayerWarning(this.togglePaused.name);
      return;
    }

    if (player.state.paused) this.play(trigger);
    else this.pause(trigger);
  }

  toggleMuted(trigger?: Event) {
    const player = this.getPlayer(trigger?.target);

    if (!player) {
      if (__DEV__) this._noPlayerWarning(this.toggleMuted.name);
      return;
    }

    if (player.state.muted) this.unmute(trigger);
    else this.mute(trigger);
  }

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

    const target = trigger?.target ?? this._target;

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
