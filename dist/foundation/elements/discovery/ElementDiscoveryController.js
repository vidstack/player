import { DisposalBin } from '../../events/index.js';
/**
 * @template {import('lit').ReactiveElement} HostElement
 */
export class ElementDiscoveryController {
  /**
   * @param {HostElement} host
   * @param {import('./events.js').ScopedDiscoveryEvent<HostElement>} ScopedDiscoveryEvent
   */
  constructor(host, ScopedDiscoveryEvent) {
    /**
     * @protected
     * @readonly
     */
    this.disconnectDisposal = new DisposalBin();
    /**
     * @protected
     * @readonly
     * @type {HostElement}
     */
    this.host = host;
    /**
     * @protected
     * @readonly
     * @type {import('./events.js').ScopedDiscoveryEvent<HostElement>}
     */
    this.ScopedDiscoveryEvent = ScopedDiscoveryEvent;
    host.addController({
      hostConnected: this.handleHostConnected.bind(this),
      hostDisconnected: this.handleHostDisconnected.bind(this)
    });
  }
  /**
   * @protected
   */
  handleHostConnected() {
    const ScopedDiscoveryEvent = this.ScopedDiscoveryEvent;
    this.host.dispatchEvent(
      new ScopedDiscoveryEvent({
        detail: {
          element: this.host,
          onDisconnect: (callback) => {
            this.disconnectDisposal.add(callback);
          }
        }
      })
    );
  }
  /**
   * @protected
   */
  handleHostDisconnected() {
    this.disconnectDisposal.empty();
  }
}
