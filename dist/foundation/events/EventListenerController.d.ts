/**
 * @typedef {import('lit').ReactiveElement} EventListenerControllerHost
 */
/**
 * @typedef {{
 *   target?: any;
 *   receiver?: any
 * }} EventListenerControllerOptions
 */
/**
 * @template {import('./events.js').EventHandlerRecord} EventHandlerRecord
 */
export class EventListenerController<EventHandlerRecord extends import("./events.js").EventHandlerRecord> {
    /**
     * @param {EventListenerControllerHost} host
     * @param {EventHandlerRecord} eventHandlers
     * @param {EventListenerControllerOptions} [options]
     */
    constructor(host: EventListenerControllerHost, eventHandlers: EventHandlerRecord, options?: EventListenerControllerOptions | undefined);
    /**
     * @protected
     * @readonly
     */
    protected readonly disconnectDisposal: DisposalBin;
    /**
     * @protected
     * @readonly
     * @type {EventListenerControllerHost}
     */
    protected readonly host: EventListenerControllerHost;
    /**
     * @protected
     * @readonly
     * @type {EventHandlerRecord}
     */
    protected readonly eventHandlers: EventHandlerRecord;
    /**
     * @protected
     * @readonly
     * @type {EventListenerControllerOptions}
     */
    protected readonly options: EventListenerControllerOptions;
    /**
     * @protected
     */
    protected handleHostConnected(): void;
    /**
     * @protected
     */
    protected handleHostDisconnected(): void;
    removeListeners(): void;
}
export type EventListenerControllerHost = import('lit').ReactiveElement;
export type EventListenerControllerOptions = {
    target?: any;
    receiver?: any;
};
import { DisposalBin } from "./events.js";
