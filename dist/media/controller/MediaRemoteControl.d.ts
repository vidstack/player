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
    constructor(host: MediaRemoteControlHost);
    /**
     * @protected
     * @readonly
     * @type {MediaRemoteControlHost}
     */
    protected readonly host: MediaRemoteControlHost;
    /**
     * @param {Event} [event]
     */
    play(event?: Event | undefined): void;
    /**
     * @param {Event} [event]
     */
    pause(event?: Event | undefined): void;
    /**
     * @param {Event} [event]
     */
    mute(event?: Event | undefined): void;
    /**
     * @param {Event} [event]
     */
    unmute(event?: Event | undefined): void;
    /**
     * @param {Event} [event]
     */
    enterFullscreen(event?: Event | undefined): void;
    /**
     * @param {Event} [event]
     */
    exitFullscreen(event?: Event | undefined): void;
    /**
     * @param {number} time
     * @param {Event} event
     */
    seeking(time: number, event: Event): void;
    /**
     * @param {number} time
     * @param {Event} [event]
     */
    seek(time: number, event?: Event | undefined): void;
    /**
     * @param {number} volume
     * @param {Event} [event]
     */
    changeVolume(volume: number, event?: Event | undefined): void;
}
export type MediaRemoteControlHost = EventTarget;
