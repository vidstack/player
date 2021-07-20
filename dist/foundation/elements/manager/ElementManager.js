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
   * @param {ElementManagerHost} host
   */
  constructor(host) {
    /**
     * @protected
     * @readonly
     * @type {Omit<Set<Element>, 'clear'>}
     */
    this.managedElements = new Set();
    /**
     * @protected
     * @readonly
     */
    this.disconnectDisposal = new DisposalBin();
    /**
     * @protected
     * @readonly
     * @type {ElementManagerHost}
     */
    this.host = host;
    host.addController({
      hostConnected: this.handleHostConnected.bind(this),
      hostDisconnected: this.handleHostDisconnected.bind(this)
    });
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
   */
  handleHostConnected() {
    const ScopedDiscoveryEvent = this.getScopedDiscoveryEvent();
    this.disconnectDisposal.add(
      listen(
        this.host,
        ScopedDiscoveryEvent.TYPE,
        this.handleElementConnect.bind(this)
      )
    );
  }
  /**
   * @protected
   */
  handleHostDisconnected() {
    this.disconnectDisposal.empty();
    this.removeAllElements();
  }
  /**
   * @protected
   * @param {ManagedElementConnectEvent<Element>} event
   */
  handleElementConnect(event) {
    if (!this.validateConnectEvent(event)) return;
    const { element, onDisconnect } = event.detail;
    this.addElement(element);
    onDisconnect(() => {
      this.removeElement(element);
    });
  }
  /**
   * @protected
   * @returns {import('../discovery').ScopedDiscoveryEvent<Element>}
   */
  getScopedDiscoveryEvent() {
    const ctor = /** @type {typeof ElementManager} */ (this.constructor);
    const ScopedDiscoveryEvent = ctor.ScopedDiscoveryEvent;
    return ScopedDiscoveryEvent;
  }
  /**
   * @protected
   * @param {ManagedElementConnectEvent} event
   * @returns {boolean}
   */
  validateConnectEvent(event) {
    const ScopedDiscoveryEvent = this.getScopedDiscoveryEvent();
    return event instanceof ScopedDiscoveryEvent;
  }
  /**
   * @protected
   * @param {Element} element
   */
  addElement(element) {
    if (this.managedElements.has(element)) return;
    this.managedElements.add(element);
    this.handleElementAdded(element);
  }
  /**
   * @protected
   * @param {Element} element
   */
  handleElementAdded(element) {
    // no-op
  }
  /**
   * @protected
   * @param {Element} element
   */
  removeElement(element) {
    if (!this.managedElements.has(element)) return;
    this.managedElements.delete(element);
    this.handleElementRemoved(element);
  }
  /**
   * @protected
   */
  removeAllElements() {
    this.managedElements.forEach(this.removeElement.bind(this));
  }
  /**
   * @protected
   * @param {Element} element
   */
  handleElementRemoved(element) {
    // no-op
  }
}
