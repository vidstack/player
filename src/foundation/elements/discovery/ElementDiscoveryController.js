import { DisposalBin } from '../../events/index.js';

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
   * @param {import('./events.js').ScopedDiscoveryEvent<HostElement>} ScopedDiscoveryEvent
   */
  constructor(host, ScopedDiscoveryEvent) {
    /**
     * @protected
     * @readonly
     * @type {HostElement}
     */
    this._host = host;

    /**
     * @protected
     * @readonly
     * @type {import('./events.js').ScopedDiscoveryEvent<HostElement>}
     */
    this._ScopedDiscoveryEvent = ScopedDiscoveryEvent;

    host.addController({
      hostConnected: this._handleHostConnected.bind(this),
      hostDisconnected: this._handleHostDisconnected.bind(this)
    });
  }

  /**
   * @protected
   */
  _handleHostConnected() {
    const ScopedDiscoveryEvent = this._ScopedDiscoveryEvent;

    this._host.dispatchEvent(
      new ScopedDiscoveryEvent({
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
