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
   * @protected
   * @type {import('../discovery').ScopedDiscoveryEvent<any>}
   */
  static get _ScopedDiscoveryEvent() {
    return ManagedElementConnectEvent;
  }

  /**
   * @protected
   * @readonly
   */
  _disconnectDisposal = new DisposalBin();

  /**
   * @param {HostElement} host
   */
  constructor(host) {
    /**
     * @readonly
     * @type {HostElement}
     */
    this._host = host;

    /**
     * @protected
     * @readonly
     * @type {ElementDiscoveryController<HostElement>}
     */
    this._discoveryController =
      /** @type {ElementDiscoveryController<HostElement>} */ (
        new ElementDiscoveryController(host, this._getScopedDiscoveryEvent())
      );
  }

  /**
   * @protected
   * @returns {import('../discovery').ScopedDiscoveryEvent<Element>}
   */
  _getScopedDiscoveryEvent() {
    const ctor = /** @type {typeof ManagedElement} */ (this.constructor);
    const ScopedDiscoveryEvent = ctor._ScopedDiscoveryEvent;
    return ScopedDiscoveryEvent;
  }
}
