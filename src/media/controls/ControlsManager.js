import { ElementManager } from '@base/elements/index.js';
import { listen, vdsEvent } from '@base/events/index.js';

import { controlsContext } from './context.js';
import { ManagedControlsConnectEvent } from './ManagedControls';

/**
 *  @typedef {import('@base/elements').ElementManagerHost} ControlsManagerHost
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
   * @type {import('@base/elements').ScopedDiscoveryEvent<any>}
   */
  static get _ScopedDiscoveryEvent() {
    return ManagedControlsConnectEvent;
  }

  /**
   * Whether controls are currently hidden.
   *
   * @type {boolean}
   */
  get isHidden() {
    return this._hidden.value;
  }

  /**
   * @param {ControlsManagerHost} host
   */
  constructor(host) {
    super(host);

    /**
     * @protected
     * @readonly
     * @type {import('@base/context').ContextProvider<boolean>}
     */
    this._hidden = controlsContext.hidden.provide(host);

    listen(
      this._host,
      'vds-show-controls-request',
      this._handleShowControlsRequest.bind(this)
    );

    listen(
      this._host,
      'vds-hide-controls-request',
      this._handleHideControlsRequest.bind(this)
    );
  }

  /**
   * Show all controls.
   *
   * @param {Event} [request]
   */
  async show(request) {
    if (!this._hidden.value) return;
    this._hidden.value = false;
    await this.waitForUpdateComplete();
    this._handleControlsChange(request);
  }

  /**
   * Hide all controls.
   *
   * @param {Event} [request]
   */
  async hide(request) {
    if (this._hidden.value) return;
    this._hidden.value = true;
    await this.waitForUpdateComplete();
    this._handleControlsChange(request);
  }

  /**
   * Wait for all controls `updateComplete` to finish.
   */
  async waitForUpdateComplete() {
    await Promise.all(
      Array.from(this._managedElements).map(
        (controls) => controls.updateComplete
      )
    );
  }

  /**
   * @private
   * @type {boolean}
   */
  _prevHiddenValue = controlsContext.hidden.initialValue;

  /**
   * @protected
   * @param {Event} [request]
   */
  _handleControlsChange(request) {
    if (this._hidden.value === this._prevHiddenValue) return;

    this._host.dispatchEvent(
      vdsEvent('vds-controls-change', {
        detail: !this.isHidden,
        originalEvent: request
      })
    );

    this._prevHiddenValue = this._hidden.value;
  }

  /**
   * @protected
   * @param {import('./events').ShowControlsRequestEvent} request
   * @returns {Promise<void>}
   */
  async _handleShowControlsRequest(request) {
    request.stopPropagation();
    await this.show(request);
  }

  /**
   * @protected
   * @param {import('./events').HideControlsRequestEvent} request
   * @returns {Promise<void>}
   */
  async _handleHideControlsRequest(request) {
    request.stopPropagation();
    await this.hide(request);
  }
}
