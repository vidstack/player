/**
 * @template {Element} T
 * @typedef {{
 *  element: T;
 *  onDisconnect: (callback: () => void) => void;
 * }} DiscoveryEventDetail
 */
/**
 * @template {Element} T
 * @typedef {{
 *   TYPE: string;
 *   new(...args: any): DiscoveryEvent<any>;
 * }} ScopedDiscoveryEvent<T>
 */
/**
 * @template {Element} T
 * @augments {VdsCustomEvent<DiscoveryEventDetail<T>>}
 */
export class DiscoveryEvent<T extends Element> extends VdsCustomEvent<DiscoveryEventDetail<T>> {
    static DEFAULT_BUBBLES: boolean;
    static DEFAULT_COMPOSED: boolean;
    constructor(eventInit?: import("../../events/events.js").VdsEventInit<DiscoveryEventDetail<T>> | undefined, type?: string | undefined, final?: boolean | undefined);
}
export type DiscoveryEventDetail<T extends Element> = {
    element: T;
    onDisconnect: (callback: () => void) => void;
};
/**
 * <T>
 */
export type ScopedDiscoveryEvent<T extends Element> = {
    new (...args: any): DiscoveryEvent<any>;
    TYPE: string;
};
import { VdsCustomEvent } from "../../events/events.js";
