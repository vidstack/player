import {
  type ExtractEventInit,
  hostRequestQueue,
  LogDispatcher,
  RequestQueue,
  vdsEvent,
} from '@vidstack/foundation';
import { type ReactiveControllerHost } from 'lit';

import type { MediaFullscreenRequestTarget, MediaRequestEvents } from '../request.events';

/**
 * A simple facade for dispatching media requests to the nearest media controller.
 *
 * @example
 * ```ts
 * import { MediaRemoteControl } from '@vidstack/player';
 *
 * class MyElement extends HTMLElement {
 *   mediaRemoteControl = new MediaRemoteControl(this);
 *
 *   sendPlayRequest() {
 *     this.mediaRemoteControl.play();
 *   }
 * }
 * ```
 */
export class MediaRemoteControl {
  protected _target?: EventTarget | null;
  protected _logger?: LogDispatcher;
  protected readonly _requests: RequestQueue;

  constructor(_host?: ReactiveControllerHost & EventTarget) {
    if (_host) {
      this._target = _host;
      this._createLogger(_host);
      this._requests = hostRequestQueue(_host);
    } else {
      this._requests = new RequestQueue();
    }
  }

  startLoading(triggerEvent?: Event) {
    this._dispatchRequest('vds-start-loading', { triggerEvent });
  }

  play(triggerEvent?: Event) {
    this._dispatchRequest('vds-play-request', { triggerEvent });
  }

  pause(triggerEvent?: Event) {
    this._dispatchRequest('vds-pause-request', { triggerEvent });
  }

  mute(triggerEvent?: Event) {
    this._dispatchRequest('vds-mute-request', { triggerEvent });
  }

  unmute(triggerEvent?: Event) {
    this._dispatchRequest('vds-unmute-request', { triggerEvent });
  }

  enterFullscreen(target?: MediaFullscreenRequestTarget, triggerEvent?: Event) {
    this._dispatchRequest('vds-enter-fullscreen-request', {
      triggerEvent,
      detail: target,
    });
  }

  exitFullscreen(target?: MediaFullscreenRequestTarget, triggerEvent?: Event) {
    this._dispatchRequest('vds-exit-fullscreen-request', {
      triggerEvent,
      detail: target,
    });
  }

  seeking(time: number, triggerEvent?: Event) {
    this._dispatchRequest('vds-seeking-request', {
      detail: time,
      triggerEvent,
    });
  }

  seek(time: number, triggerEvent?: Event) {
    this._dispatchRequest('vds-seek-request', {
      detail: time,
      triggerEvent,
    });
  }

  changeVolume(volume: number, triggerEvent?: Event) {
    this._dispatchRequest('vds-volume-change-request', {
      detail: volume,
      triggerEvent,
    });
  }

  resumeUserIdle(triggerEvent?: Event) {
    this._dispatchRequest('vds-resume-user-idle-request', { triggerEvent });
  }

  pauseUserIdle(triggerEvent?: Event) {
    this._dispatchRequest('vds-pause-user-idle-request', { triggerEvent });
  }

  showPoster(triggerEvent?: Event) {
    this._dispatchRequest('vds-show-poster-request', { triggerEvent });
  }

  hidePoster(triggerEvent?: Event) {
    this._dispatchRequest('vds-hide-poster-request', { triggerEvent });
  }

  setTarget(target?: EventTarget | null) {
    if (this._target === target) return;

    this._target = target;

    if (target) {
      this._createLogger(target);
      this._requests.start();
    } else {
      this._requests.stop();
    }
  }

  protected _dispatchRequest<EventType extends keyof MediaRequestEvents>(
    type: EventType,
    eventInit: ExtractEventInit<MediaRequestEvents[EventType]>,
  ) {
    this._requests.queue(type, () => {
      const request = vdsEvent(type, {
        ...eventInit,
        bubbles: true,
        composed: true,
      });

      if (__DEV__) {
        this._logger
          ?.infoGroup(`📨 dispatching \`${type}\``)
          .labelledLog('Request Event', request)
          .labelledLog('Trigger Event', eventInit.triggerEvent)
          .dispatch();
      }

      this._target?.dispatchEvent(request);
    });
  }

  protected _createLogger(target: EventTarget) {
    if (__DEV__) {
      this._logger = new LogDispatcher(target);
    }
  }
}
