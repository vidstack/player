import { DisposalBin, listen } from '../../events/index.js';
import { ManagedElementConnectEvent } from './ManagedElement.js';

/**
 * @typedef {import('lit').ReactiveElement} ElementManagerHost
 */

/**
 * @template {import('lit').ReactiveElement} Element
 */
export class ElementManager {
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
   * @type {Omit<Set<Element>, 'clear'>}
   */
  _managedElements = new Set();

  /**
   * @protected
   * @readonly
   */
  _disconnectDisposal = new DisposalBin();

  /**
   * @param {ElementManagerHost} host
   */
  constructor(host) {
    /**
     * @protected
     * @readonly
     * @type {ElementManagerHost}
     */
    this._host = host;

    host.addController({
      hostConnected: this._handleHostConnected.bind(this),
      hostDisconnected: this._handleHostDisconnected.bind(this)
    });
  }

  /**
   * @protected
   */
  _handleHostConnected() {
    const ScopedDiscoveryEvent = this._getScopedDiscoveryEvent();

    this._disconnectDisposal.add(
      listen(
        this._host,
        ScopedDiscoveryEvent.TYPE,
        this._handleElementConnect.bind(this)
      )
    );
  }

  /**
   * @protected
   */
  _handleHostDisconnected() {
    this._disconnectDisposal.empty();
    this._removeAllElements();
  }

  /**
   * @protected
   * @param {ManagedElementConnectEvent<Element>} event
   */
  _handleElementConnect(event) {
    if (!this._validateConnectEvent(event)) return;

    const { element, onDisconnect } = event.detail;

    this._addElement(element);

    onDisconnect(() => {
      this._removeElement(element);
    });
  }

  /**
   * @protected
   * @returns {import('../discovery').ScopedDiscoveryEvent<Element>}
   */
  _getScopedDiscoveryEvent() {
    const ctor = /** @type {typeof ElementManager} */ (this.constructor);
    const ScopedDiscoveryEvent = ctor._ScopedDiscoveryEvent;
    return ScopedDiscoveryEvent;
  }

  /**
   * @protected
   * @param {ManagedElementConnectEvent} event
   * @returns {boolean}
   */
  _validateConnectEvent(event) {
    const ScopedDiscoveryEvent = this._getScopedDiscoveryEvent();
    return event instanceof ScopedDiscoveryEvent;
  }

  /**
   * @protected
   * @param {Element} element
   */
  _addElement(element) {
    if (this._managedElements.has(element)) return;
    this._managedElements.add(element);
    this._handleElementAdded(element);
  }

  /**
   * @protected
   * @param {Element} element
   */
  _handleElementAdded(element) {
    // no-op
  }

  /**
   * @protected
   * @param {Element} element
   */
  _removeElement(element) {
    if (!this._managedElements.has(element)) return;
    this._managedElements.delete(element);
    this._handleElementRemoved(element);
  }

  /**
   * @protected
   */
  _removeAllElements() {
    this._managedElements.forEach(this._removeElement.bind(this));
  }

  /**
   * @protected
   * @param {Element} element
   */
  _handleElementRemoved(element) {
    // no-op
  }
}
