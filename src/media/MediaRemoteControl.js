import {
  EnterFullscreenRequestEvent,
  ExitFullscreenRequestEvent,
  MuteRequestEvent,
  PauseRequestEvent,
  PlayRequestEvent,
  SeekingRequestEvent,
  SeekRequestEvent,
  UnmuteRequestEvent,
  VolumeChangeRequestEvent
} from './media-request.events.js';

export class MediaRemoteControl {
  /**
   * @protected
   * @readonly
   * @type {Element}
   */
  host;

  /**
   * @param {Element} host
   */
  constructor(host) {
    this.host = host;
  }

  /**
   * @param {Event} [event]
   * @returns {void}
   */
  play(event) {
    this.host.dispatchEvent(
      new PlayRequestEvent({
        originalEvent: event
      })
    );
  }

  /**
   * @param {Event} [event]
   * @returns {void}
   */
  pause(event) {
    this.host.dispatchEvent(
      new PauseRequestEvent({
        originalEvent: event
      })
    );
  }

  /**
   * @param {Event} [event]
   * @returns {void}
   */
  mute(event) {
    this.host.dispatchEvent(
      new MuteRequestEvent({
        originalEvent: event
      })
    );
  }

  /**
   * @param {Event} [event]
   * @returns {void}
   */
  unmute(event) {
    this.host.dispatchEvent(
      new UnmuteRequestEvent({
        originalEvent: event
      })
    );
  }

  /**
   * @param {Event} [event]
   * @returns {void}
   */
  enterFullscreen(event) {
    this.host.dispatchEvent(
      new EnterFullscreenRequestEvent({
        originalEvent: event
      })
    );
  }

  /**
   * @param {Event} [event]
   * @returns {void}
   */
  exitFullscreen(event) {
    this.host.dispatchEvent(
      new ExitFullscreenRequestEvent({
        originalEvent: event
      })
    );
  }

  /**
   * @param {number} time
   * @param {Event} event
   * @returns {void}
   */
  seeking(time, event) {
    this.host.dispatchEvent(
      new SeekingRequestEvent({
        detail: time,
        originalEvent: event
      })
    );
  }

  /**
   * @param {number} time
   * @param {Event} [event]
   * @returns {void}
   */
  seek(time, event) {
    this.host.dispatchEvent(
      new SeekRequestEvent({
        detail: time,
        originalEvent: event
      })
    );
  }

  /**
   * @param {number} volume
   * @param {Event} [event]
   * @returns {void}
   */
  changeVolume(volume, event) {
    this.host.dispatchEvent(
      new VolumeChangeRequestEvent({
        detail: volume,
        originalEvent: event
      })
    );
  }
}
