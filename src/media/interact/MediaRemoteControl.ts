import type { ReactiveControllerHost } from 'lit';

import { ExtractEventInit, vdsEvent } from '../../base/events';
import { LogDispatcher } from '../../base/logger';
import { createHostedRequestQueue } from '../../base/queue';
import { MediaRequestEvents } from '../request.events';

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

  protected readonly _connectedQueue = createHostedRequestQueue(this._host);

  protected readonly _logger = __DEV__
    ? new LogDispatcher(this._host)
    : undefined;

  constructor(protected readonly _host: ReactiveControllerHost & EventTarget) {}

  play(event?: Event) {
    this._dispatchRequest('vds-play-request', {
      originalEvent: event
    });
  }

  pause(event?: Event) {
    this._dispatchRequest('vds-pause-request', {
      originalEvent: event
    });
  }

  mute(event?: Event) {
    this._dispatchRequest('vds-mute-request', {
      originalEvent: event
    });
  }

  unmute(event?: Event) {
    this._dispatchRequest('vds-unmute-request', {
      originalEvent: event
    });
  }

  enterFullscreen(event?: Event) {
    this._dispatchRequest('vds-enter-fullscreen-request', {
      originalEvent: event
    });
  }

  exitFullscreen(event?: Event) {
    this._dispatchRequest('vds-exit-fullscreen-request', {
      originalEvent: event
    });
  }

  seeking(time: number, event?: Event) {
    this._dispatchRequest('vds-seeking-request', {
      detail: time,
      originalEvent: event
    });
  }

  seek(time: number, event?: Event) {
    this._dispatchRequest('vds-seek-request', {
      detail: time,
      originalEvent: event
    });
  }

  changeVolume(volume: number, event?: Event) {
    this._dispatchRequest('vds-volume-change-request', {
      detail: volume,
      originalEvent: event
    });
  }

  protected _dispatchRequest<EventType extends keyof MediaRequestEvents>(
    type: EventType,
    eventInit: ExtractEventInit<MediaRequestEvents[EventType]>
  ) {
    this._connectedQueue.queue(type, () => {
      const request = vdsEvent(type, {
        ...eventInit,
        bubbles: true,
        composed: true
      });

      if (__DEV__) {
        this._logger
          ?.infoGroup(`📨 dispatching \`${type}\``)
          .labelledLog('Request Event', request)
          .labelledLog('Trigger Event', eventInit.originalEvent)
          .dispatch();
      }

      this._host.dispatchEvent(request);
    });
  }
}
