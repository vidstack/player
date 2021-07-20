/**
 * @typedef {import('lit').ReactiveElement} ScreenOrientationControllerHost
 */
/**
 * Contains the logic for managing the window's screen orientation.
 *
 * @example
 * ```ts
 * import { LitElement } from 'lit';
 * import { ScreenOrientationController } from '@vidstack/elements';
 *
 * class MyElement extends LitElement {
 *   screenOrientationController = new ScreenOrientationController(this);
 * }
 * ```
 */
export class ScreenOrientationController {
    /**
     * @param {ScreenOrientationControllerHost} host
     */
    constructor(host: ScreenOrientationControllerHost);
    /**
     * @protected
     * @readonly
     */
    protected readonly disconnectDisposal: DisposalBin;
    /**
     * @protected
     * @type {ScreenOrientation | undefined}
     */
    protected screenOrientation: ScreenOrientation | undefined;
    /**
     * @protected
     * @type {boolean}
     */
    protected isScreenOrientationLocked: boolean;
    /**
     * @protected
     * @readonly
     * @type {ScreenOrientationControllerHost}
     */
    protected readonly host: ScreenOrientationControllerHost;
    /**
     * @protected
     * @returns {Promise<void>}
     */
    protected handleHostConnected(): Promise<void>;
    /**
     * Dispose of any event listeners and unlock screen orientation (if locked).
     *
     * @protected
     * @returns {Promise<void>}
     */
    protected handleHostDisconnected(): Promise<void>;
    /**
     * The current screen orientation. It will return `undefined` if the Screen Orientation API
     * is not available.
     *
     * @type {ScreenOrientation | undefined}
     */
    get currentOrientation(): string | undefined;
    /**
     * Whether the native Screen Orientation API is available.
     *
     * @type {boolean}
     */
    get canOrient(): boolean;
    /**
     * Whether the screen orientation is currently locked.
     *
     * @type {boolean}
     * @default false
     */
    get isLocked(): boolean;
    /**
     * Locks the orientation of the player to the desired orientation type using the
     * Screen Orientation API. This method will throw an error if the API is unavailable.
     *
     * @param {ScreenOrientationLock} lockType - The screen lock orientation type.
     * @returns {Promise<void>}
     * @link https://developer.mozilla.org/en-US/docs/Web/API/Screen/orientation
     * @see https://w3c.github.io/screen-orientation
     */
    lock(lockType: ScreenOrientationLock): Promise<void>;
    /**
     * Unlocks the orientation of the player to it's default state using the Screen Orientation
     * API. This method will throw an error if the API is unavailable.
     *
     * @returns {Promise<void>}
     * @link https://developer.mozilla.org/en-US/docs/Web/API/Screen/orientation
     * @see https://w3c.github.io/screen-orientation
     */
    unlock(): Promise<void>;
    /**
     * @protected
     */
    protected addScreenOrientationEventListeners(): void;
    /**
     * @protected
     * @returns {import('../types').Unsubscribe}
     */
    protected addScreenOrientationChangeEventListener(): import('../types').Unsubscribe;
    /**
     * @protected
     * @param {Event} event
     */
    protected handleOrientationChange(event: Event): void;
    /**
     * @protected
     */
    protected updateScreenOrientation(): void;
    /**
     * @protected
     * @throws {Error} - Will throw if Screen Orientation API is unavailable.
     */
    protected throwIfScreenOrientationUnavailable(): void;
}
export type ScreenOrientationControllerHost = import('lit').ReactiveElement;
import { DisposalBin } from "../events/events.js";
import { ScreenOrientation } from "./ScreenOrientation.js";
import { ScreenOrientationLock } from "./ScreenOrientation.js";
