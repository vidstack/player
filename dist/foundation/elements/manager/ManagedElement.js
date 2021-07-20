import { DisposalBin } from '../../events/index.js';
import {
  DiscoveryEvent,
  ElementDiscoveryController
} from '../discovery/index.js';
/**
 * @bubbles
 * @composed
 * @template {Element} ManagedElement
 * @augments DiscoveryEvent<ManagedElement>
 */
export class ManagedElementConnectEvent extends DiscoveryEvent {}
/**
 * @template {import('lit').ReactiveElement} HostElement
 */
export class ManagedElement {
  /**
   * @param {HostElement} host
   */
  constructor(host) {
    /**
     * @protected
     * @readonly
     */
    this.disconnectDisposal = new DisposalBin();
    /**
     * @readonly
     * @type {HostElement}
     */
    this.host = host;
    /**
     * @protected
     * @readonly
     * @type {ElementDiscoveryController<HostElement>}
     */
    this.discoveryController =
      /** @type {ElementDiscoveryController<HostElement>} */ (
        new ElementDiscoveryController(host, this.getScopedDiscoveryEvent())
      );
  }
  /**
   * @protected
   * @type {import('../discovery').ScopedDiscoveryEvent<any>}
   */
  static get ScopedDiscoveryEvent() {
    return ManagedElementConnectEvent;
  }
  /**
   * @protected
   * @returns {import('../discovery').ScopedDiscoveryEvent<Element>}
   */
  getScopedDiscoveryEvent() {
    const ctor = /** @type {typeof ManagedElement} */ (this.constructor);
    const ScopedDiscoveryEvent = ctor.ScopedDiscoveryEvent;
    return ScopedDiscoveryEvent;
  }
}
