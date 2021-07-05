import { DisposalBin } from '../../events/index.js';
import { VdsCustomEvent } from '../../events/index.js';

/**
 * @template {Element} ManagedElement
 * @typedef {{
 *  element: ManagedElement;
 *  onDisconnect: (callback: () => void) => void;
 * }} ManagedElementConnectEventDetail
 */

/**
 * @template {Element} ManagedElement
 * @augments VdsCustomEvent<ManagedElementConnectEventDetail<ManagedElement>>
 * @bubbles
 * @composed
 */
export class ManagedElementConnectEvent extends VdsCustomEvent {
  /** @readonly */
  static TYPE = 'vds-managed-element-connect';
  static DEFAULT_BUBBLES = true;
  static DEFAULT_COMPOSED = true;
}

/**
 * @typedef {{ new(...args: any[]): ManagedElementConnectEvent<any> }} ScopedManagedElementConnectEvent
 */

/**
 * @template {import('lit').ReactiveElement} HostElement
 */
export class ManagedElement {
  /**
   * @protected
   * @type {ScopedManagedElementConnectEvent}
   */
  static get ScopedManagedElementConnectEvent() {
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
      new ctor.ScopedManagedElementConnectEvent({
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
