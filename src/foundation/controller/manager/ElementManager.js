import { DisposalBin, listen } from '../../events/index.js';
import { ManagedElementConnectEvent } from './events.js';
import { ManagedElement } from './ManagedElement.js';

/**
 * @typedef {import('lit').ReactiveElement} ElementManagerHost
 */

/**
 * @template {import('lit').ReactiveElement} Element
 */
export class ElementManager {
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
   * @type {Omit<Set<Element>, 'clear'>}
   */
  managedElements = new Set();

  /**
   * @protected
   * @readonly
   */
  disconnectDisposal = new DisposalBin();

  /**
   * @param {ElementManagerHost} host
   */
  constructor(host) {
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

  /** @protected */
  handleHostConnected() {
    this.disconnectDisposal.add(
      listen(
        this.host,
        ManagedElementConnectEvent.TYPE,
        this.handleElementConnect.bind(this)
      )
    );
  }

  /** @protected */
  handleHostDisconnected() {
    this.disconnectDisposal.empty();
    this.removeAllElements();
  }

  /**
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
   * @param {ManagedElementConnectEvent} event
   * @returns {boolean}
   */
  validateConnectEvent(event) {
    const ctor = /** @type {typeof ElementManager} */ (this.constructor);
    const ScopedEvent = ctor.ScopedManagedControllerConnectEvent;
    return event instanceof ScopedEvent;
  }

  /**
   * @param {Element} element
   */
  addElement(element) {
    if (this.managedElements.has(element)) return;
    this.managedElements.add(element);
    this.handleElementAdded(element);
  }

  /**
   * @param {Element} element
   */
  handleElementAdded(element) {
    // no-op
  }

  /**
   * @param {Element} element
   */
  removeElement(element) {
    if (!this.managedElements.has(element)) return;
    this.managedElements.delete(element);
    this.handleElementRemoved(element);
  }

  removeAllElements() {
    this.managedElements.forEach(this.removeElement.bind(this));
  }

  /**
   * @param {Element} element
   */
  handleElementRemoved(element) {
    // no-op
  }
}
