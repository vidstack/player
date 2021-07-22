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
 * @template {import('./events.js').GlobalEventHandlerRecord} EventHandlerRecord
 */
export class EventListenerController {
  /**
   * @protected
   * @readonly
   */
  _disconnectDisposal = new DisposalBin();

  /**
   * @param {EventListenerControllerHost} host
   * @param {EventHandlerRecord} eventHandlers
   * @param {EventListenerControllerOptions} [options]
   */
  constructor(host, eventHandlers, options = {}) {
    /**
     * @protected
     * @readonly
     * @type {EventListenerControllerHost}
     */
    this._host = host;

    /**
     * @protected
     * @readonly
     * @type {EventHandlerRecord}
     */
    this._eventHandlers = eventHandlers;

    /**
     * @protected
     * @readonly
     * @type {EventListenerControllerOptions}
     */
    this._options = options;

    host.addController({
      hostConnected: this.handleHostConnected.bind(this),
      hostDisconnected: this.handleHostDisconnected.bind(this)
    });
  }

  /**
   * @protected
   */
  handleHostConnected() {
    bindEventListeners(
      this._options.target ?? this._host,
      this._eventHandlers,
      this._disconnectDisposal,
      this._options
    );
  }

  /**
   * @protected
   */
  handleHostDisconnected() {
    this._disconnectDisposal.empty();
  }

  removeListeners() {
    this._disconnectDisposal.empty();
  }
}
