import { bindEventListeners, DisposalBin } from './events.js';
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
export class EventListenerController {
  /**
   * @param {EventListenerControllerHost} host
   * @param {EventHandlerRecord} eventHandlers
   * @param {EventListenerControllerOptions} [options]
   */
  constructor(host, eventHandlers, options = {}) {
    /**
     * @protected
     * @readonly
     */
    this.disconnectDisposal = new DisposalBin();
    /**
     * @protected
     * @readonly
     * @type {EventListenerControllerHost}
     */
    this.host = host;
    /**
     * @protected
     * @readonly
     * @type {EventHandlerRecord}
     */
    this.eventHandlers = eventHandlers;
    /**
     * @protected
     * @readonly
     * @type {EventListenerControllerOptions}
     */
    this.options = options;
    host.addController({
      hostConnected: this.handleHostConnected.bind(this),
      hostDisconnected: this.handleHostDisconnected.bind(this)
    });
  }
  /**
   * @protected
   */
  handleHostConnected() {
    var _a;
    bindEventListeners(
      (_a = this.options.target) !== null && _a !== void 0 ? _a : this.host,
      this.eventHandlers,
      this.disconnectDisposal,
      this.options
    );
  }
  /**
   * @protected
   */
  handleHostDisconnected() {
    this.disconnectDisposal.empty();
  }
  removeListeners() {
    this.disconnectDisposal.empty();
  }
}
