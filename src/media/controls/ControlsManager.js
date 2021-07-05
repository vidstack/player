import { bindEventListeners } from '../../bundle/index.js';
import { ElementManager } from '../../foundation/elements/index.js';
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
   * @type {boolean}
   */
  visible = false;

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
    return this.currentLock !== ControlsLock.Hidden && this.visible;
  }

  /**
   * @param {ControlsManagerHost} host
   */
  constructor(host) {
    super(host);
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
    if (this.currentLock === ControlsLock.Hidden || this.visible) return;

    await Promise.all(
      Array.from(this.managedElements).map((controls) =>
        controls.showControls()
      )
    );

    this.visible = true;
    this.handleControlsChange(request);
  }

  /**
   * @param {Event} [request]
   */
  async hide(request) {
    if (this.currentLock === ControlsLock.Showing || !this.visible) return;

    await Promise.all(
      Array.from(this.managedElements).map((controls) =>
        controls.hideControls()
      )
    );

    this.visible = false;
    this.handleControlsChange(request);
  }

  /**
   * @param {ControlsLock} lock
   * @param {Event} [request]
   */
  async lock(lock, request) {
    this.currentLock = lock;

    if (lock === ControlsLock.Hidden) {
      await this.hide(request);
    } else if (lock === ControlsLock.Showing) {
      await this.show(request);
    }
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
