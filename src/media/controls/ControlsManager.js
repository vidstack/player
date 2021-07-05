import { ElementManager } from '../../foundation/elements/index.js';
import { bindEventListeners } from '../../foundation/events/index.js';
import { controlsContext } from './context.js';
import {
  ControlsChangeEvent,
  ControlsLock,
  HideControlsRequestEvent,
  LockControlsRequestEvent,
  ShowControlsRequestEvent
} from './events.js';
import { ManagedControlsConnectEvent } from './ManagedControls';

/**
 *  @typedef {import('../../foundation/elements').ElementManagerHost} ControlsManagerHost
 */

/**
 * A registry for all media controls that:
 *
 * - Listens for new controls connecting in the DOM and adds them to the registry.
 * - Manages showing and hiding all controls in-sync.
 * - Listens for relevant requests such as `ShowControlsRequestEvent` and handles them.
 * - Updates the `controlsContext` record.
 *
 * @augments {ElementManager<import('./ManagedControls').ControlsHost>}
 */
export class ControlsManager extends ElementManager {
  /**
   * @protected
   * @type {import('../../foundation/elements').ScopedManagedElementConnectEvent}
   */
  static get ScopedManagedElementConnectEvent() {
    return ManagedControlsConnectEvent;
  }

  /**
   * @protected
   * @type {ControlsLock}
   */
  currentLock = ControlsLock.None;

  /**
   * The current lock on the controls (`none | showing | hidden`).
   *
   * @type {ControlsLock}
   */
  get lockedState() {
    return this.currentLock;
  }

  /**
   * Whether controls are currently visible.
   *
   * @type {boolean}
   */
  get isVisible() {
    return this.currentLock !== ControlsLock.Hidden && this.visible.value;
  }

  /**
   * @param {ControlsManagerHost} host
   */
  constructor(host) {
    super(host);

    /**
     * @protected
     * @readonly
     * @type {import('../../foundation/context/types').ContextProvider<boolean>}
     */
    this.visible = controlsContext.visible.provide(host);
  }

  handleHostConnected() {
    super.handleHostConnected();

    const events = {
      [LockControlsRequestEvent.TYPE]: this.handleLockControlsRequest,
      [HideControlsRequestEvent.TYPE]: this.handleHideControlsRequest,
      [ShowControlsRequestEvent.TYPE]: this.handleShowControlsRequest
    };

    bindEventListeners(this.host, events, this.disconnectDisposal, {
      receiver: this
    });
  }

  /**
   * @param {Event} [request]
   */
  async show(request) {
    if (this.currentLock === ControlsLock.Hidden || this.visible.value) return;

    await Promise.all(
      Array.from(this.managedElements).map((controls) =>
        controls.showControls()
      )
    );

    this.visible.value = true;
    this.handleControlsChange(request);
  }

  /**
   * @param {Event} [request]
   */
  async hide(request) {
    if (this.currentLock === ControlsLock.Showing || !this.visible.value)
      return;

    await Promise.all(
      Array.from(this.managedElements).map((controls) =>
        controls.hideControls()
      )
    );

    this.visible.value = false;
    this.handleControlsChange(request);
  }

  /**
   * Lock the controls to a given state to prevent changes until unlocked.
   *
   * @param {ControlsLock} lock
   * @param {Event} [request]
   */
  async lock(lock, request) {
    if (this.currentLock === lock) return;

    this.currentLock = lock;

    if (lock === ControlsLock.Hidden) {
      await this.hide(request);
    } else if (lock === ControlsLock.Showing) {
      await this.show(request);
    }
  }

  /**
   * Unlock the controls so they can be freely shown or hidden.
   */
  async unlock() {
    this.currentLock = ControlsLock.None;
  }

  /**
   * @protected
   * @param {import('./ManagedControls').ControlsHost} controls
   */
  async handleElementAdded(controls) {
    super.handleElementAdded(controls);
    this.handleControlsAdded(controls);
  }

  /**
   * @protected
   * @param {import('./ManagedControls').ControlsHost} controls
   */
  async handleControlsAdded(controls) {
    super.handleElementAdded(controls);

    if (this.isVisible) {
      await controls.showControls();
    } else {
      await controls.hideControls();
    }
  }

  /**
   * @protected
   * @param {Event} [request]
   */
  handleControlsChange(request) {
    if (this.visible.value === this.isVisible) return;
    this.host.dispatchEvent(
      new ControlsChangeEvent({
        detail: this.isVisible,
        originalEvent: request
      })
    );
  }

  /**
   * @protected
   * @param {ShowControlsRequestEvent} event
   * @returns {Promise<void>}
   */
  async handleShowControlsRequest(event) {
    event.stopPropagation();
    await this.show(event);
  }

  /**
   * @protected
   * @param {HideControlsRequestEvent} event
   * @returns {Promise<void>}
   */
  async handleHideControlsRequest(event) {
    event.stopPropagation();
    await this.hide(event);
  }

  /**
   * @protected
   * @param {LockControlsRequestEvent} event
   * @returns {Promise<void>}
   */
  async handleLockControlsRequest(event) {
    event.stopPropagation();
    const lock = event.detail;
    await this.lock(lock, event);
  }
}
