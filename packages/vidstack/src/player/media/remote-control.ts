import { effect, ReadSignal, signal } from 'maverick.js';
import { DOMEvent } from 'maverick.js/std';

import { createLogger, Logger } from '../../foundation/logger/create-logger';
import { RequestQueue } from '../../foundation/queue/request-queue';
import type { MediaFullscreenRequestTarget, MediaRequestEvents } from './request-events';
import { useMediaStore } from './store';

const remotes = new WeakMap<ReadSignal<EventTarget | null>, MediaRemoteControl>();

export function useMediaRemoteControl($target: ReadSignal<EventTarget | null>) {
  const logger = __DEV__ ? createLogger() : undefined,
    remote = remotes.get($target) ?? new MediaRemoteControl(logger);

  if (!remotes.has($target)) {
    effect(() => {
      if (__DEV__) logger?.setTarget($target());
      remote.setTarget($target());
    });

    remotes.set($target, remote);
  }

  return remote;
}

/**
 * A simple facade for dispatching media requests to the nearest media controller.
 */
export class MediaRemoteControl {
  protected _target = signal<EventTarget | null>(null);
  protected _requests = new RequestQueue();

  constructor(protected _logger?: Logger) {
    const $media = useMediaStore();
    effect(() => {
      if (this._target() && $media.canPlay) {
        this._requests.start();
      } else {
        this._requests.stop();
      }
    });
  }

  startLoading(trigger?: Event) {
    this._dispatchRequest('vds-start-loading', trigger);
  }

  play(trigger?: Event) {
    this._dispatchRequest('vds-play-request', trigger);
  }

  pause(trigger?: Event) {
    this._dispatchRequest('vds-pause-request', trigger);
  }

  mute(trigger?: Event) {
    this._dispatchRequest('vds-mute-request', trigger);
  }

  unmute(trigger?: Event) {
    this._dispatchRequest('vds-unmute-request', trigger);
  }

  enterFullscreen(target?: MediaFullscreenRequestTarget, trigger?: Event) {
    this._dispatchRequest('vds-enter-fullscreen-request', trigger, target);
  }

  exitFullscreen(target?: MediaFullscreenRequestTarget, trigger?: Event) {
    this._dispatchRequest('vds-exit-fullscreen-request', trigger, target);
  }

  seeking(time: number, trigger?: Event) {
    this._dispatchRequest('vds-seeking-request', trigger, time);
  }

  seek(time: number, trigger?: Event) {
    this._dispatchRequest('vds-seek-request', trigger, time);
  }

  changeVolume(volume: number, trigger?: Event) {
    this._dispatchRequest('vds-volume-change-request', trigger, volume);
  }

  resumeUserIdle(trigger?: Event) {
    this._dispatchRequest('vds-resume-user-idle-request', trigger);
  }

  pauseUserIdle(trigger?: Event) {
    this._dispatchRequest('vds-pause-user-idle-request', trigger);
  }

  showPoster(trigger?: Event) {
    this._dispatchRequest('vds-show-poster-request', trigger);
  }

  hidePoster(trigger?: Event) {
    this._dispatchRequest('vds-hide-poster-request', trigger);
  }

  setTarget(target: EventTarget | null) {
    this._target.set(target);
  }

  protected _dispatchRequest<EventType extends keyof MediaRequestEvents>(
    type: EventType,
    trigger?: Event,
    detail?: MediaRequestEvents[EventType]['detail'],
  ) {
    this._requests.queue(type, () => {
      const request = new DOMEvent<any>(type, {
        bubbles: true,
        composed: true,
        detail,
        trigger,
      });

      if (__DEV__) {
        this._logger
          ?.infoGroup(`📨 dispatching \`${type}\``)
          .labelledLog('Request Event', request)
          .labelledLog('Trigger Event', trigger)
          .dispatch();
      }

      this._target()!.dispatchEvent(request);
    });
  }
}
