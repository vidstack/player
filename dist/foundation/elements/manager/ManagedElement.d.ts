/**
 * @bubbles
 * @composed
 * @template {Element} ManagedElement
 * @augments DiscoveryEvent<ManagedElement>
 */
export class ManagedElementConnectEvent<ManagedElement extends Element> extends DiscoveryEvent<ManagedElement> {
}
/**
 * @template {import('lit').ReactiveElement} HostElement
 */
export class ManagedElement<HostElement extends import("lit").ReactiveElement> {
    /**
     * @protected
     * @type {import('../discovery').ScopedDiscoveryEvent<any>}
     */
    protected static get ScopedDiscoveryEvent(): import("../discovery/events.js").ScopedDiscoveryEvent<any>;
    /**
     * @param {HostElement} host
     */
    constructor(host: HostElement);
    /**
     * @protected
     * @readonly
     */
    protected readonly disconnectDisposal: DisposalBin;
    /**
     * @readonly
     * @type {HostElement}
     */
    readonly host: HostElement;
    /**
     * @protected
     * @readonly
     * @type {ElementDiscoveryController<HostElement>}
     */
    protected readonly discoveryController: ElementDiscoveryController<HostElement>;
    /**
     * @protected
     * @returns {import('../discovery').ScopedDiscoveryEvent<Element>}
     */
    protected getScopedDiscoveryEvent(): import('../discovery').ScopedDiscoveryEvent<Element>;
}
import { DiscoveryEvent } from "../discovery/events.js";
import { DisposalBin } from "../../events/events.js";
import { ElementDiscoveryController } from "../discovery/ElementDiscoveryController.js";
