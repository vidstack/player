import { DisposalBin, listen } from '../../events/index.js';
import { ManagedControllerConnectEvent } from './events.js';
import { ManagedController } from './ManagedController.js';

/**
 * @typedef {import('lit').ReactiveController} CanManageControllers
 */

/**
 * @typedef {import('lit').ReactiveElement} ControllerManagerHost
 */

/**
 * @template {import('lit').ReactiveElement} HostElement
 * @implements {CanManageControllers}
 */
export class ControllerManager {
  /**
   * @protected
   */
  static get ScopedManagedControllerConnectEvent() {
    return ManagedControllerConnectEvent;
  }

  /**
   * @protected
   * @readonly
   * @type {Omit<Set<ManagedController<HostElement>>, 'clear'>}
   */
  managedControllers = new Set();

  /**
   * @protected
   * @readonly
   */
  disconnectDisposal = new DisposalBin();

  /**
   * @param {ControllerManagerHost} host
   */
  constructor(host) {
    host.addController({
      hostConnected: this.handleHostConnected.bind(this),
      hostDisconnected: this.handleHostDisconnected.bind(this)
    });

    /**
     * @protected
     * @readonly
     * @type {ControllerManagerHost}
     */
    this.host = host;
  }

  /** @protected */
  handleHostConnected() {
    this.disconnectDisposal.add(
      listen(
        this.host,
        ManagedControllerConnectEvent.TYPE,
        this.handleManagedControllerConnect.bind(this)
      )
    );
  }

  /** @protected */
  handleHostDisconnected() {
    this.disconnectDisposal.empty();
    this.removeAllManagedControllers();
  }

  /**
   * @param {ManagedControllerConnectEvent} event
   * @returns {void}
   */
  handleManagedControllerConnect(event) {
    if (!this.validateControllerConnectEvent(event)) return;

    const { controller, onDisconnect } = event.detail;

    this.addManagedController(controller);

    onDisconnect(() => {
      this.removeManagedController(controller);
    });
  }

  /**
   * @param {ManagedControllerConnectEvent} event
   * @returns {boolean}
   */
  validateControllerConnectEvent(event) {
    const ctor = /** @type {typeof ControllerManager} */ (this.constructor);
    const ScopedEvent = ctor.ScopedManagedControllerConnectEvent;
    return event instanceof ScopedEvent;
  }

  /**
   * @param {ManagedController<HostElement>} controller
   * @returns {void}
   */
  addManagedController(controller) {
    if (this.managedControllers.has(controller)) return;
    this.managedControllers.add(controller);
    this.handleManagedControllerAdded(controller);
  }

  /**
   * @param {ManagedController<HostElement>} controller
   * @returns {void}
   */
  removeManagedController(controller) {
    if (!this.managedControllers.has(controller)) return;
    this.managedControllers.delete(controller);
    this.handleManagedControllerRemoved(controller);
  }

  /**
   * @param {ManagedController<HostElement>} controller
   * @returns {void}
   */
  handleManagedControllerAdded(controller) {
    // no-op
  }

  /**
   * @param {ManagedController<HostElement>} controller
   * @returns {void}
   */
  handleManagedControllerRemoved(controller) {
    // no-op
  }

  removeAllManagedControllers() {
    this.managedControllers.forEach(this.removeManagedController.bind(this));
  }
}
