import { DisposalBin, VdsEvent } from '../../events/index.js';

/**
 * @template {import('lit').ReactiveElement} HostElement
 */
export class ElementDiscoveryController {
  /**
   * @protected
   * @readonly
   */
  _disconnectDisposal = new DisposalBin();

  /**
   * @param {HostElement} host
   * @param {{ eventType: (keyof GlobalEventHandlersEventMap) }} options
   */
  constructor(host, options) {
    /**
     * @protected
     * @readonly
     * @type {HostElement}
     */
    this._host = host;

    /**
     * @protected
     * @readonly
     * @type {string}
     */
    this._eventType = options.eventType;

    host.addController({
      hostConnected: this._handleHostConnected.bind(this),
      hostDisconnected: this._handleHostDisconnected.bind(this)
    });
  }

  /**
   * @protected
   */
  _handleHostConnected() {
    this._host.dispatchEvent(
      new VdsEvent(this._eventType, {
        bubbles: true,
        composed: true,
        detail: {
          element: this._host,
          onDisconnect: (callback) => {
            this._disconnectDisposal.add(callback);
          }
        }
      })
    );
  }

  /**
   * @protected
   */
  _handleHostDisconnected() {
    this._disconnectDisposal.empty();
  }
}
