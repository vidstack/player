/**
 * @typedef {import('lit').ReactiveElement} ElementManagerHost
 */
/**
 * @template {import('lit').ReactiveElement} Element
 */
export class ElementManager<Element extends import("lit").ReactiveElement> {
    /**
     * @protected
     * @type {import('../discovery').ScopedDiscoveryEvent<any>}
     */
    protected static get ScopedDiscoveryEvent(): import("../discovery").ScopedDiscoveryEvent<any>;
    /**
     * @param {ElementManagerHost} host
     */
    constructor(host: ElementManagerHost);
    /**
     * @protected
     * @readonly
     * @type {Omit<Set<Element>, 'clear'>}
     */
    protected readonly managedElements: Omit<Set<Element>, 'clear'>;
    /**
     * @protected
     * @readonly
     */
    protected readonly disconnectDisposal: DisposalBin;
    /**
     * @protected
     * @readonly
     * @type {ElementManagerHost}
     */
    protected readonly host: ElementManagerHost;
    /**
     * @protected
     */
    protected handleHostConnected(): void;
    /**
     * @protected
     */
    protected handleHostDisconnected(): void;
    /**
     * @protected
     * @param {ManagedElementConnectEvent<Element>} event
     */
    protected handleElementConnect(event: ManagedElementConnectEvent<Element>): void;
    /**
     * @protected
     * @returns {import('../discovery').ScopedDiscoveryEvent<Element>}
     */
    protected getScopedDiscoveryEvent(): import('../discovery').ScopedDiscoveryEvent<Element>;
    /**
     * @protected
     * @param {ManagedElementConnectEvent} event
     * @returns {boolean}
     */
    protected validateConnectEvent(event: ManagedElementConnectEvent<any>): boolean;
    /**
     * @protected
     * @param {Element} element
     */
    protected addElement(element: Element): void;
    /**
     * @protected
     * @param {Element} element
     */
    protected handleElementAdded(element: Element): void;
    /**
     * @protected
     * @param {Element} element
     */
    protected removeElement(element: Element): void;
    /**
     * @protected
     */
    protected removeAllElements(): void;
    /**
     * @protected
     * @param {Element} element
     */
    protected handleElementRemoved(element: Element): void;
}
export type ElementManagerHost = import('lit').ReactiveElement;
import { DisposalBin } from "../../events/events.js";
import { ManagedElementConnectEvent } from "./ManagedElement.js";
