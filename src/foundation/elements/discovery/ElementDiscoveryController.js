import { DisposalBin, vdsEvent } from '../../events/index.js';

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
   * @param {keyof GlobalEventHandlersEventMap} eventType
   */
  constructor(host, eventType) {
    /**
     * @protected
     * @readonly
     * @type {HostElement}
     */
    this._host = host;

    /**
     * @protected
     * @readonly
     * @type {keyof GlobalEventHandlersEventMap}
     */
    this._eventType = eventType;

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
      vdsEvent(this._eventType, {
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
