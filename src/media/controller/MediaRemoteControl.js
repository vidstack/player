import { vdsEvent } from '@base/events/index.js';

/**
 * @typedef {EventTarget} MediaRemoteControlHost
 */

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
  /**
   * @param {MediaRemoteControlHost} host
   */
  constructor(host) {
    /**
     * @protected
     * @readonly
     * @type {MediaRemoteControlHost}
     */
    this._host = host;
  }

  /**
   * @param {Event} [event]
   */
  play(event) {
    this._host.dispatchEvent(
      vdsEvent('vds-play-request', {
        bubbles: true,
        composed: true,
        originalEvent: event
      })
    );
  }

  /**
   * @param {Event} [event]
   */
  pause(event) {
    this._host.dispatchEvent(
      vdsEvent('vds-pause-request', {
        bubbles: true,
        composed: true,
        originalEvent: event
      })
    );
  }

  /**
   * @param {Event} [event]
   */
  mute(event) {
    this._host.dispatchEvent(
      vdsEvent('vds-mute-request', {
        bubbles: true,
        composed: true,
        originalEvent: event
      })
    );
  }

  /**
   * @param {Event} [event]
   */
  unmute(event) {
    this._host.dispatchEvent(
      vdsEvent('vds-unmute-request', {
        bubbles: true,
        composed: true,
        originalEvent: event
      })
    );
  }

  /**
   * @param {Event} [event]
   */
  enterFullscreen(event) {
    this._host.dispatchEvent(
      vdsEvent('vds-enter-fullscreen-request', {
        bubbles: true,
        composed: true,
        originalEvent: event
      })
    );
  }

  /**
   * @param {Event} [event]
   */
  exitFullscreen(event) {
    this._host.dispatchEvent(
      vdsEvent('vds-exit-fullscreen-request', {
        bubbles: true,
        composed: true,
        originalEvent: event
      })
    );
  }

  /**
   * @param {number} time
   * @param {Event} [event]
   */
  seeking(time, event) {
    this._host.dispatchEvent(
      vdsEvent('vds-seeking-request', {
        bubbles: true,
        composed: true,
        detail: time,
        originalEvent: event
      })
    );
  }

  /**
   * @param {number} time
   * @param {Event} [event]
   */
  seek(time, event) {
    this._host.dispatchEvent(
      vdsEvent('vds-seek-request', {
        bubbles: true,
        composed: true,
        detail: time,
        originalEvent: event
      })
    );
  }

  /**
   * @param {number} volume
   * @param {Event} [event]
   */
  changeVolume(volume, event) {
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
