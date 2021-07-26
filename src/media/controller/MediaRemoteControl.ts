import { vdsEvent } from '@base/events/index';

export type MediaRemoteControlHost = EventTarget;

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
export class MediaRemoteControl {
  constructor(protected readonly _host: MediaRemoteControlHost) {}

  play(event?: Event) {
    this._host.dispatchEvent(
      vdsEvent('vds-play-request', {
        bubbles: true,
        composed: true,
        originalEvent: event
      })
    );
  }

  pause(event?: Event) {
    this._host.dispatchEvent(
      vdsEvent('vds-pause-request', {
        bubbles: true,
        composed: true,
        originalEvent: event
      })
    );
  }

  mute(event?: Event) {
    this._host.dispatchEvent(
      vdsEvent('vds-mute-request', {
        bubbles: true,
        composed: true,
        originalEvent: event
      })
    );
  }

  unmute(event?: Event) {
    this._host.dispatchEvent(
      vdsEvent('vds-unmute-request', {
        bubbles: true,
        composed: true,
        originalEvent: event
      })
    );
  }

  enterFullscreen(event?: Event) {
    this._host.dispatchEvent(
      vdsEvent('vds-enter-fullscreen-request', {
        bubbles: true,
        composed: true,
        originalEvent: event
      })
    );
  }

  exitFullscreen(event?: Event) {
    this._host.dispatchEvent(
      vdsEvent('vds-exit-fullscreen-request', {
        bubbles: true,
        composed: true,
        originalEvent: event
      })
    );
  }

  seeking(time: number, event?: Event) {
    this._host.dispatchEvent(
      vdsEvent('vds-seeking-request', {
        bubbles: true,
        composed: true,
        detail: time,
        originalEvent: event
      })
    );
  }

  seek(time: number, event?: Event) {
    this._host.dispatchEvent(
      vdsEvent('vds-seek-request', {
        bubbles: true,
        composed: true,
        detail: time,
        originalEvent: event
      })
    );
  }

  changeVolume(volume: number, event?: Event) {
    this._host.dispatchEvent(
      vdsEvent('vds-volume-change-request', {
        bubbles: true,
        composed: true,
        detail: volume,
        originalEvent: event
      })
    );
  }
}
