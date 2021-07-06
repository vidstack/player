import { ElementManager } from '../../foundation/elements/index.js';
import { EventListenerController } from '../../foundation/events/index.js';
import { controlsContext } from './context.js';
import {
  ControlsChangeEvent,
  HideControlsRequestEvent,
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
 * - Updates `controlsContext.hidden`.
 *
 * @augments {ElementManager<import('./ManagedControls').ManagedControlsHost>}
 */
export class ControlsManager extends ElementManager {
  /**
   * @protected
   * @type {import('../../foundation/elements').ScopedDiscoveryEvent<any>}
   */
  static get ScopedDiscoveryEvent() {
    return ManagedControlsConnectEvent;
  }

  /**
   * Whether controls are currently hidden.
   *
   * @type {boolean}
   */
  get isHidden() {
    return this.hidden.value;
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
    this.hidden = controlsContext.hidden.provide(host);

    /**
     * @protected
     * @readonly
     * @type {EventListenerController}
     */
    this.eventListenerController = new EventListenerController(
      this.host,
      {
        [HideControlsRequestEvent.TYPE]: this.handleHideControlsRequest,
        [ShowControlsRequestEvent.TYPE]: this.handleShowControlsRequest
      },
      { receiver: this }
    );
  }

  /**
   * Show all controls.
   *
   * @param {Event} [request]
   */
  async show(request) {
    if (!this.hidden.value) return;
    this.hidden.value = false;
    await this.waitForUpdateComplete();
    this.handleControlsChange(request);
  }

  /**
   * Hide all controls.
   *
   * @param {Event} [request]
   */
  async hide(request) {
    if (this.hidden.value) return;
    this.hidden.value = true;
    await this.waitForUpdateComplete();
    this.handleControlsChange(request);
  }

  /**
   * Wait for all controls `updateComplete` to finish.
   */
  async waitForUpdateComplete() {
    await Promise.all(
      Array.from(this.managedElements).map(
        (controls) => controls.updateComplete
      )
    );
  }

  /**
   * @private
   * @type {boolean}
   */
  prevHiddenValue = controlsContext.hidden.initialValue;

  /**
   * @protected
   * @param {Event} [request]
   */
  handleControlsChange(request) {
    if (this.hidden.value === this.prevHiddenValue) return;

    this.host.dispatchEvent(
      new ControlsChangeEvent({
        detail: !this.isHidden,
        originalEvent: request
      })
    );

    this.prevHiddenValue = this.hidden.value;
  }

  /**
   * @protected
   * @param {ShowControlsRequestEvent} request
   * @returns {Promise<void>}
   */
  async handleShowControlsRequest(request) {
    request.stopPropagation();
    await this.show(request);
  }

  /**
   * @protected
   * @param {HideControlsRequestEvent} request
   * @returns {Promise<void>}
   */
  async handleHideControlsRequest(request) {
    request.stopPropagation();
    await this.hide(request);
  }
}
