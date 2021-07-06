import { bindEventListeners, DisposalBin } from './events.js';

/**
 * @typedef {{
 *   target?: any;
 *   receiver?: any
 * }} EventListenerControllerOptions
 */

/**
 * @template {import('lit').ReactiveElement} HostElement
 */
export class EventListenerController {
  /**
   * @protected
   * @readonly
   */
  disconnectDisposal = new DisposalBin();

  /**
   * @param {HostElement} host
   * @param {import('./events.js').EventHandlerRecord} eventHandlers
   * @param {EventListenerControllerOptions} [options]
   */
  constructor(host, eventHandlers, options = {}) {
    /**
     * @protected
     * @readonly
     * @type {HostElement}
     */
    this.host = host;

    /**
     * @protected
     * @readonly
     * @type {import('./events.js').EventHandlerRecord}
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
    bindEventListeners(
      this.options.target ?? this.host,
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
}
