/**
 * @typedef {{
 *  requestFullscreen(): Promise<void>;
 *  exitFullscreen(): Promise<void>;
 * } & import('lit').ReactiveElement} FullscreenControllerHost
 */
/**
 * Unfortunately fullscreen isn't straight forward due to cross-browser inconsistencies. This
 * class abstract the logic for handling fullscreen across browsers.
 *
 * @example
 * ```ts
 * import { LitElement } from 'lit';
 * import { FullscreenController, ScreenOrientationController } from '@vidstack/elements';
 *
 * class MyElement extends LitElement {
 *   fullscreenController = new FullscreenController(
 *     this,
 *     new ScreenOrientationController(this),
 *   );
 *
 *   requestFullscreen() {
 *     if (this.fullscreenController.isRequestingNativeFullscreen) {
 *       return super.requestFullscreen();
 *     }
 *
 *     return this.fullscreenController.requestFullscreen();
 *   }
 *
 *   exitFullscreen() {
 *     return this.fullscreenController.exitFullscreen();
 *   }
 * }
 * ```
 */
export class FullscreenController {
    /**
     * @param {FullscreenControllerHost} host
     * @param {ScreenOrientationController} screenOrientationController
     */
    constructor(host: FullscreenControllerHost, screenOrientationController: ScreenOrientationController);
    /**
     * @protected
     */
    protected disconnectDisposal: DisposalBin;
    /**
     * Used to avoid an inifinite loop by indicating when the native `requestFullscreen()` method
     * is being called.
     *
     * Bad Call Stack: host.requestFullscreen() -> controller.requestFullscreen() ->
     * fscreen.requestFullscreen() -> controller.requestFullscreen() -> fscreen.requestFullscreen() ...
     *
     * Good Call Stack: host.requestFullscreen() -> controller.requestFullscreen() -> fscreen.requestFullscreen()
     * -> (native request fullscreen method on host)
     */
    isRequestingNativeFullscreen: boolean;
    /**
     * This will indicate the orientation to lock the screen to when in fullscreen mode. The default
     * is `undefined` which indicates no screen orientation change.
     *
     * @type {ScreenOrientationLock | undefined}
     */
    screenOrientationLock: ScreenOrientationLock | undefined;
    /**
     * @protected
     * @readonly
     * @type {FullscreenControllerHost}
     */
    protected readonly host: FullscreenControllerHost;
    /**
     * @protected
     * @readonly
     * @type {ScreenOrientationController}
     */
    protected readonly screenOrientationController: ScreenOrientationController;
    /**
     * Dispose of any event listeners and exit fullscreen (if active).
     *
     * @protected
     * @returns {Promise<void>}
     */
    protected handleHostDisconnected(): Promise<void>;
    /**
     * Whether fullscreen mode can be requested, generally is an API available to do so.
     *
     * @type {boolean}
     */
    get isSupported(): boolean;
    /**
     * Whether the native Fullscreen API is enabled/available.
     *
     * @type {boolean}
     */
    get isSupportedNatively(): boolean;
    /**
     * Whether the host element is in fullscreen mode.
     *
     * @type {boolean}
     */
    get isFullscreen(): boolean;
    /**
     * Whether the host element is in fullscreen mode via the native Fullscreen API.
     *
     * @returns {boolean}
     */
    get isNativeFullscreen(): boolean;
    /**
     * @protected
     * @param {(this: HTMLElement, event: Event) => void} handler
     * @returns {import('../types').Unsubscribe}
     */
    protected addFullscreenChangeEventListener(handler: (this: HTMLElement, event: Event) => void): import('../types').Unsubscribe;
    /**
     * @protected
     * @param {(this: HTMLElement, event: Event) => void} handler
     * @returns {import('../types').Unsubscribe}
     */
    protected addFullscreenErrorEventListener(handler: (this: HTMLElement, event: Event) => void): import('../types').Unsubscribe;
    /**
     * @returns {Promise<void>}
     */
    requestFullscreen(): Promise<void>;
    /**
     * @protected
     * @returns {Promise<void>}
     */
    protected makeEnterFullscreenRequest(): Promise<void>;
    /**
     * @protected
     * @param {Event} [event]
     */
    protected handleFullscreenChange(event?: Event | undefined): void;
    /**
     * @protected
     * @param {Event} event
     */
    protected handleFullscreenError(event: Event): void;
    /**
     * @returns {Promise<void>}
     */
    exitFullscreen(): Promise<void>;
    /**
     * @protected
     * @returns {Promise<void>}
     */
    protected makeExitFullscreenRequest(): Promise<void>;
    /**
     * @protected
     * @returns {boolean}
     */
    protected shouldOrientScreen(): boolean;
    /**
     * @protected
     * @returns {Promise<void>}
     */
    protected lockScreenOrientation(): Promise<void>;
    /**
     * @protected
     * @returns {Promise<void>}
     */
    protected unlockScreenOrientation(): Promise<void>;
    /**
     * @protected
     * @throws {Error} - Will throw if Fullscreen API is not enabled or supported.
     */
    protected throwIfNoFullscreenSupport(): void;
}
export type FullscreenControllerHost = {
    requestFullscreen(): Promise<void>;
    exitFullscreen(): Promise<void>;
} & import('lit').ReactiveElement;
import { DisposalBin } from "../events/events.js";
import { ScreenOrientationLock } from "../screen-orientation/ScreenOrientation.js";
import { ScreenOrientationController } from "../screen-orientation/ScreenOrientationController.js";
