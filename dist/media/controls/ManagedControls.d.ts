/**
 * @typedef {import('lit').ReactiveElement} ManagedControlsHost
 */
/**
 * Fired when connecting a new controls manager with the `MediaControllerElement`.
 *
 * @bubbles
 * @composed
 * @augments ManagedElementConnectEvent<ManagedControlsHost>
 */
export class ManagedControlsConnectEvent extends ManagedElementConnectEvent<import("lit").ReactiveElement> {
    /** @readonly */
    static readonly TYPE: "vds-managed-controls-connect";
    constructor(eventInit?: import("../../bundle/index.js").VdsEventInit<import("../../foundation/elements/index.js").DiscoveryEventDetail<import("lit").ReactiveElement>> | undefined, type?: string | undefined, final?: boolean | undefined);
}
/**
 * @augments {ManagedElement<ManagedControlsHost>}
 */
export class ManagedControls extends ManagedElement<import("lit").ReactiveElement> {
    constructor(host: import("lit").ReactiveElement);
}
export type ManagedControlsHost = import('lit').ReactiveElement;
import { ManagedElementConnectEvent } from "../../foundation/elements/manager/ManagedElement.js";
import { ManagedElement } from "../../foundation/elements/manager/ManagedElement.js";
