/**
 *  @typedef {import('../../foundation/elements').ElementManagerHost} ControlsManagerHost
 */
/**
 * A registry for all media controls that:
 *
 * - Listens for new controls connecting in the DOM and adds them to the registry.
 * - Manages showing and hiding all controls in-sync.
 * - Listens for relevant requests such as `ShowControlsRequestEvent` and handles them.
 * - Updates `controlsContext.hidden`.
 *
 * @augments {ElementManager<import('./ManagedControls').ManagedControlsHost>}
 */
export class ControlsManager extends ElementManager<import("lit").ReactiveElement> {
    /**
     * @param {ControlsManagerHost} host
     */
    constructor(host: ControlsManagerHost);
    /**
     * Whether controls are currently hidden.
     *
     * @type {boolean}
     */
    get isHidden(): boolean;
    /**
     * @protected
     * @readonly
     * @type {import('../../foundation/context/types').ContextProvider<boolean>}
     */
    protected readonly hidden: import('../../foundation/context/types').ContextProvider<boolean>;
    /**
     * @protected
     * @readonly
     * @type {EventListenerController}
     */
    protected readonly eventListenerController: EventListenerController<any>;
    /**
     * Show all controls.
     *
     * @param {Event} [request]
     */
    show(request?: Event | undefined): Promise<void>;
    /**
     * Hide all controls.
     *
     * @param {Event} [request]
     */
    hide(request?: Event | undefined): Promise<void>;
    /**
     * Wait for all controls `updateComplete` to finish.
     */
    waitForUpdateComplete(): Promise<void>;
    /**
     * @private
     * @type {boolean}
     */
    private prevHiddenValue;
    /**
     * @protected
     * @param {Event} [request]
     */
    protected handleControlsChange(request?: Event | undefined): void;
    /**
     * @protected
     * @param {ShowControlsRequestEvent} request
     * @returns {Promise<void>}
     */
    protected handleShowControlsRequest(request: ShowControlsRequestEvent): Promise<void>;
    /**
     * @protected
     * @param {HideControlsRequestEvent} request
     * @returns {Promise<void>}
     */
    protected handleHideControlsRequest(request: HideControlsRequestEvent): Promise<void>;
}
export type ControlsManagerHost = import('../../foundation/elements').ElementManagerHost;
import { ElementManager } from "../../foundation/elements/manager/ElementManager.js";
import { EventListenerController } from "../../foundation/events/EventListenerController.js";
import { ShowControlsRequestEvent } from "./events.js";
import { HideControlsRequestEvent } from "./events.js";
