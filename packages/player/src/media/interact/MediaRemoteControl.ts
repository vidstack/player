import {
  type ExtractEventInit,
  hostRequestQueue,
  LogDispatcher,
  vdsEvent,
} from '@vidstack/foundation';
import { type ReactiveControllerHost } from 'lit';

import type {
  EnterFullscreenRequestEvent,
  MediaFullscreenRequestTarget,
  MediaRequestEvents,
} from '../request.events';

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
  protected _ref?: Element;

  protected readonly _connectedQueue = hostRequestQueue(this._host);

  protected readonly _logger = __DEV__ ? new LogDispatcher(this._host) : undefined;

  constructor(protected readonly _host: ReactiveControllerHost & EventTarget) {}

  play(event?: Event) {
    this._dispatchRequest('vds-play-request', {
      triggerEvent: event,
    });
  }

  pause(event?: Event) {
    this._dispatchRequest('vds-pause-request', {
      triggerEvent: event,
    });
  }

  mute(event?: Event) {
    this._dispatchRequest('vds-mute-request', {
      triggerEvent: event,
    });
  }

  unmute(event?: Event) {
    this._dispatchRequest('vds-unmute-request', {
      triggerEvent: event,
    });
  }

  enterFullscreen(target?: MediaFullscreenRequestTarget, event?: Event) {
    this._dispatchRequest('vds-enter-fullscreen-request', {
      triggerEvent: event,
      detail: target,
    });
  }

  exitFullscreen(target?: MediaFullscreenRequestTarget, event?: Event) {
    this._dispatchRequest('vds-exit-fullscreen-request', {
      triggerEvent: event,
      detail: target,
    });
  }

  seeking(time: number, event?: Event) {
    this._dispatchRequest('vds-seeking-request', {
      detail: time,
      triggerEvent: event,
    });
  }

  seek(time: number, event?: Event) {
    this._dispatchRequest('vds-seek-request', {
      detail: time,
      triggerEvent: event,
    });
  }

  changeVolume(volume: number, event?: Event) {
    this._dispatchRequest('vds-volume-change-request', {
      detail: volume,
      triggerEvent: event,
    });
  }

  resumeUserIdle(event?: Event) {
    this._dispatchRequest('vds-resume-user-idle-request', {
      triggerEvent: event,
    });
  }

  pauseUserIdle(event?: Event) {
    this._dispatchRequest('vds-pause-user-idle-request', {
      triggerEvent: event,
    });
  }

  showPoster(event?: Event) {
    this._dispatchRequest('vds-show-poster-request', {
      triggerEvent: event,
    });
  }

  hidePoster(event?: Event) {
    this._dispatchRequest('vds-hide-poster-request', {
      triggerEvent: event,
    });
  }

  protected _dispatchRequest<EventType extends keyof MediaRequestEvents>(
    type: EventType,
    eventInit: ExtractEventInit<MediaRequestEvents[EventType]>,
  ) {
    this._connectedQueue.queue(type, () => {
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

      this._host.dispatchEvent(request);
    });
  }
}
