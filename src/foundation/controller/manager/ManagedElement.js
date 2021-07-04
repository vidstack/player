import { DisposalBin } from '../../events/index.js';
import { ManagedElementConnectEvent } from './events.js';

/**
 * @template {import('lit').ReactiveElement} HostElement
 */
export class ManagedElement {
  /**
   * @protected
   * @type {typeof ManagedElementConnectEvent}
   */
  static get ScopedManagedControllerConnectEvent() {
    return ManagedElementConnectEvent;
  }

  /**
   * @protected
   * @readonly
   */
  disconnectDisposal = new DisposalBin();

  /**
   * @param {HostElement} host
   */
  constructor(host) {
    /**
     * @readonly
     * @type {HostElement}
     */
    this.host = host;

    host.addController({
      hostConnected: this.handleHostConnected.bind(this),
      hostDisconnected: this.handleHostDisconnected.bind(this)
    });
  }

  /**
   * @protected
   */
  handleHostConnected() {
    this.connectToManager();
  }

  /**
   * @protected
   */
  handleHostDisconnected() {
    this.disconnectDisposal.empty();
  }

  /**
   * @protected
   */
  connectToManager() {
    const ctor = /** @type {typeof ManagedElement} */ (this.constructor);

    this.host.dispatchEvent(
      new ctor.ScopedManagedControllerConnectEvent({
        detail: {
          element: this.host,
          // Pipe callbacks into the disconnect disposal bin.
          onDisconnect: (callback) => {
            this.disconnectDisposal.add(callback);
          }
        }
      })
    );
  }
}
