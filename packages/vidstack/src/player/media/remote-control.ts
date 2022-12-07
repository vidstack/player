import { effect, ReadSignal } from 'maverick.js';
import { DOMEvent } from 'maverick.js/std';

import { createLogger, Logger } from '../../foundation/logger/create-logger';
import { RequestQueue } from '../../foundation/queue/request-queue';
import type { MediaFullscreenRequestTarget, MediaRequestEvents } from './request-events';

export function useMediaRemoteControl($target: ReadSignal<EventTarget | null>) {
  const logger = __DEV__ ? createLogger() : undefined,
    remote = new MediaRemoteControl(logger);

  effect(() => {
    if (__DEV__) logger?.setTarget($target());
    remote.setTarget($target());
  });

  return remote;
}

/**
 * A simple facade for dispatching media requests to the nearest media controller.
 */
export class MediaRemoteControl {
  protected _target?: EventTarget | null;
  protected _requests = new RequestQueue();

  constructor(protected _logger?: Logger) {}

  startLoading(triggerEvent?: Event) {
    this._dispatchRequest('vds-start-loading', undefined, triggerEvent);
  }

  play(triggerEvent?: Event) {
    this._dispatchRequest('vds-play-request', undefined, triggerEvent);
  }

  pause(triggerEvent?: Event) {
    this._dispatchRequest('vds-pause-request', undefined, triggerEvent);
  }

  mute(triggerEvent?: Event) {
    this._dispatchRequest('vds-mute-request', undefined, triggerEvent);
  }

  unmute(triggerEvent?: Event) {
    this._dispatchRequest('vds-unmute-request', undefined, triggerEvent);
  }

  enterFullscreen(target?: MediaFullscreenRequestTarget, triggerEvent?: Event) {
    this._dispatchRequest('vds-enter-fullscreen-request', target, triggerEvent);
  }

  exitFullscreen(target?: MediaFullscreenRequestTarget, triggerEvent?: Event) {
    this._dispatchRequest('vds-exit-fullscreen-request', target, triggerEvent);
  }

  seeking(time: number, triggerEvent?: Event) {
    this._dispatchRequest('vds-seeking-request', time, triggerEvent);
  }

  seek(time: number, triggerEvent?: Event) {
    this._dispatchRequest('vds-seek-request', time, triggerEvent);
  }

  changeVolume(volume: number, triggerEvent?: Event) {
    this._dispatchRequest('vds-volume-change-request', volume, triggerEvent);
  }

  resumeUserIdle(triggerEvent?: Event) {
    this._dispatchRequest('vds-resume-user-idle-request', undefined, triggerEvent);
  }

  pauseUserIdle(triggerEvent?: Event) {
    this._dispatchRequest('vds-pause-user-idle-request', undefined, triggerEvent);
  }

  showPoster(triggerEvent?: Event) {
    this._dispatchRequest('vds-show-poster-request', undefined, triggerEvent);
  }

  hidePoster(triggerEvent?: Event) {
    this._dispatchRequest('vds-hide-poster-request', undefined, triggerEvent);
  }

  setTarget(target?: EventTarget | null) {
    if (this._target === target) return;

    this._target = target;

    if (target) {
      this._requests.start();
    } else {
      this._requests.stop();
    }
  }

  protected _dispatchRequest<EventType extends keyof MediaRequestEvents>(
    type: EventType,
    detail?: MediaRequestEvents[EventType]['detail'],
    triggerEvent?: Event,
  ) {
    this._requests.queue(type, () => {
      const request = new DOMEvent(type, {
        bubbles: true,
        composed: true,
        detail,
        triggerEvent,
      });

      if (__DEV__) {
        this._logger
          ?.infoGroup(`📨 dispatching \`${type}\``)
          .labelledLog('Request Event', request)
          .labelledLog('Trigger Event', triggerEvent)
          .dispatch();
      }

      this._target?.dispatchEvent(request);
    });
  }
}
