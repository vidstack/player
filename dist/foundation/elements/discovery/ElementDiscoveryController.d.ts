/**
 * @template {import('lit').ReactiveElement} HostElement
 */
export class ElementDiscoveryController<HostElement extends import("lit").ReactiveElement> {
    /**
     * @param {HostElement} host
     * @param {import('./events.js').ScopedDiscoveryEvent<HostElement>} ScopedDiscoveryEvent
     */
    constructor(host: HostElement, ScopedDiscoveryEvent: import('./events.js').ScopedDiscoveryEvent<HostElement>);
    /**
     * @protected
     * @readonly
     */
    protected readonly disconnectDisposal: DisposalBin;
    /**
     * @protected
     * @readonly
     * @type {HostElement}
     */
    protected readonly host: HostElement;
    /**
     * @protected
     * @readonly
     * @type {import('./events.js').ScopedDiscoveryEvent<HostElement>}
     */
    protected readonly ScopedDiscoveryEvent: import('./events.js').ScopedDiscoveryEvent<HostElement>;
    /**
     * @protected
     */
    protected handleHostConnected(): void;
    /**
     * @protected
     */
    protected handleHostDisconnected(): void;
}
import { DisposalBin } from "../../events/events.js";
