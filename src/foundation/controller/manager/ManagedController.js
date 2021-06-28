import { DisposalBin } from '../../events/index.js';
import { ManagedControllerConnectEvent } from './events.js';

/**
 * @template {import('lit').ReactiveElement} HostElement
 */
export class ManagedController {
  /**
   * @protected
   */
  static get ScopedManagedControllerConnectEvent() {
    return ManagedControllerConnectEvent;
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

  /** @protected */
  handleHostConnected() {
    this.connectToManager();
  }

  /** @protected */
  handleHostDisconnected() {
    this.disconnectDisposal.empty();
  }

  /**
   * @protected
   * @returns {void}
   */
  connectToManager() {
    const ctor = /** @type {typeof ManagedController} */ (this.constructor);

    this.host.dispatchEvent(
      new ctor.ScopedManagedControllerConnectEvent({
        detail: {
          controller: this,
          // Pipe callbacks into the disconnect disposal bin.
          onDisconnect: (callback) => {
            this.disconnectDisposal.add(callback);
          }
        }
      })
    );
  }
}
