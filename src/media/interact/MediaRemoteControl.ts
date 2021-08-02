import { ReactiveController, ReactiveControllerHost } from 'lit';

import { ExtractEventInit, vdsEvent } from '../../base/events';
import { RequestQueue } from '../../base/queue';
import { MediaRequestEvents } from '../request.events';

/**
 * A simple facade for dispatching media requests to the nearest media controller.
 *
 * @example
 * ```ts
 * import { MediaRemoteControl } from '@vidstack/elements';
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
export class MediaRemoteControl implements ReactiveController {
  protected _ref?: Element;

  protected readonly _connectedQueue = new RequestQueue();

  constructor(protected readonly _host: ReactiveControllerHost) {
    if (_host instanceof Element) this.setRef(_host);
    _host.addController(this);
  }

  hostConnected() {
    this._connectedQueue.flush();
    this._connectedQueue.serveImmediately = true;
  }

  hostDisconnected() {
    this._connectedQueue.destroy();
  }

  /**
   * Set a reference to a DOM element that this controller will use as the target for dispatching
   * media requests from.
   */
  setRef(newRef?: Element) {
    this._ref = newRef;
  }

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

  showControls(event?: Event) {
    this._dispatchRequest('vds-show-controls-request', {
      originalEvent: event
    });
  }

  hideControls(event?: Event) {
    this._dispatchRequest('vds-hide-controls-request', {
      originalEvent: event
    });
  }

  resumeIdleTracking(event?: Event) {
    this._dispatchRequest('vds-resume-idle-tracking-request', {
      originalEvent: event
    });
  }

  pauseIdleTracking(event?: Event) {
    this._dispatchRequest('vds-pause-idle-tracking-request', {
      originalEvent: event
    });
  }

  protected _dispatchRequest<EventType extends keyof MediaRequestEvents>(
    type: EventType,
    eventInit: ExtractEventInit<MediaRequestEvents[EventType]>
  ) {
    this._connectedQueue.queue(type, () => {
      this._ref?.dispatchEvent(
        vdsEvent(type, {
          ...eventInit,
          bubbles: true,
          composed: true
        })
      );
    });
  }
}
