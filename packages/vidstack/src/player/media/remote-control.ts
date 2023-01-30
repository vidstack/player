import { Dispose, effect, peek, ReadSignal, root, signal, WriteSignal } from 'maverick.js';
import { DOMEvent } from 'maverick.js/std';

import { createLogger, Logger } from '../../foundation/logger/create-logger';
import { RequestQueue } from '../../foundation/queue/request-queue';
import type { MediaPlayerElement } from '../element/types';
import { useMedia } from './context';
import type { MediaFullscreenRequestTarget, MediaRequestEvents } from './request-events';

const remotes = new WeakMap<ReadSignal<EventTarget | null>, MediaRemoteControl>();

export function useMediaRemoteControl($target: ReadSignal<EventTarget | null>) {
  const logger = __DEV__ ? createLogger() : undefined,
    media = useMedia(),
    remote = remotes.get($target) || new MediaRemoteControl(logger);

  if (!remotes.has($target)) {
    effect(() => {
      const target = $target();
      if (__DEV__) logger?.setTarget(target);
      remote.setTarget(target);
      remote.setPlayer(media.$player());
    });

    remotes.set($target, remote);
  }

  return remote;
}

/**
 * A simple facade for dispatching media requests to the nearest media controller.
 */
export class MediaRemoteControl {
  protected _$target!: WriteSignal<EventTarget | null>;
  protected _$player!: WriteSignal<MediaPlayerElement | null>;
  protected _requests = new RequestQueue();
  protected _dispose!: Dispose;

  constructor(protected _logger?: Logger) {
    root((dispose) => {
      this._$target = signal<EventTarget | null>(null);
      this._$player = signal<MediaPlayerElement | null>(null);

      effect(() => {
        if (this._$target() && this._$player()) this._requests._start();
        else this._requests._stop();
      });

      this._dispose = dispose;
    });
  }

  setTarget(target: EventTarget | null) {
    this._$target.set(target);
    if (!target) this._$player.set(null);
  }

  getPlayer(): MediaPlayerElement | null {
    const player = peek(this._$player);
    if (player) return player;

    peek(this._$target)?.dispatchEvent(
      new DOMEvent('find-media-player', {
        detail: this._$player,
        bubbles: true,
        composed: true,
      }),
    );

    return peek(this._$player);
  }

  setPlayer(player: MediaPlayerElement | null) {
    this._$player.set(player);
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
    const player = this.getPlayer();

    if (!player) {
      if (__DEV__) this._noMediaWarning(this.togglePaused.name);
      return;
    }

    player.onAttach(() => {
      if (player.state.paused) this.play(trigger);
      else this.pause(trigger);
    });
  }

  toggleMuted(trigger?: Event) {
    const player = this.getPlayer();

    if (!player) {
      if (__DEV__) this._noMediaWarning(this.toggleMuted.name);
      return;
    }

    player.onAttach(() => {
      if (player.state.muted) this.unmute(trigger);
      else this.mute(trigger);
    });
  }

  toggleFullscreen(target?: MediaFullscreenRequestTarget, trigger?: Event) {
    const player = this.getPlayer();

    if (!player) {
      if (__DEV__) this._noMediaWarning(this.toggleFullscreen.name);
      return;
    }

    player.onAttach(() => {
      if (player.state.fullscreen) this.exitFullscreen(target, trigger);
      else this.enterFullscreen(target, trigger);
    });
  }

  destroy() {
    this._dispose();
  }

  protected _dispatchRequest<EventType extends keyof MediaRequestEvents>(
    type: EventType,
    trigger?: Event,
    detail?: MediaRequestEvents[EventType]['detail'],
  ) {
    if (!peek(this._$player)) this.getPlayer();

    this._requests._enqueue(type, () => {
      const request = new DOMEvent<any>(type, {
        bubbles: true,
        composed: true,
        detail,
        trigger,
      });

      if (__DEV__) {
        this._logger
          ?.infoGroup(`📨 dispatching \`${type}\``)
          .labelledLog('Target', peek(this._$target))
          .labelledLog('Player', peek(this._$player))
          .labelledLog('Request Event', request)
          .labelledLog('Trigger Event', trigger)
          .dispatch();
      }

      this._$target()!.dispatchEvent(request);
    });
  }

  private _noMediaWarning(method: string) {
    if (__DEV__) {
      if (!peek(this._$target)) {
        console.warn(
          `[vidstack] attempted to call \`MediaRemoteControl.${method}\`() that requires player` +
            ` which was not found because target has not connected to the DOM yet`,
        );

        return;
      }

      console.warn(
        `[vidstack] attempted to call \`MediaRemoteControl.${method}\`() that requires` +
          ' player but failed because remote could not find a parent player element from target',
      );
    }
  }
}
