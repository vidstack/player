import { ReactiveElement } from 'lit';

import { ElementManager } from '../../../base/elements';
import { listen, vdsEvent } from '../../../base/events';
import { mediaContext } from '../../context';
import { HideControlsRequestEvent, ShowControlsRequestEvent } from './events';
import { ManagedControlsConnectEvent } from './ManagedControls';

export type ControlsManagerHost = ReactiveElement & {
  readonly ctx: {
    customControls: boolean;
  };
};

/**
 * A registry for all media controls that:
 *
 * - Listens for new controls connecting in the DOM and adds them to the registry.
 * - Manages showing and hiding all controls in-sync.
 * - Listens for relevant requests such as `ShowControlsRequestEvent` and handles them.
 * - Updates `mediaContext.customControls`.
 */
export class ControlsManager extends ElementManager<ReactiveElement> {
  protected static override get _ScopedDiscoveryEvent() {
    return ManagedControlsConnectEvent;
  }

  /**
   * Whether controls are currently hidden.
   */
  get isHidden(): boolean {
    return !this._host.ctx.customControls;
  }

  constructor(protected override readonly _host: ControlsManagerHost) {
    super(_host);
  }

  protected override _handleHostConnected() {
    super._handleHostConnected();

    this._disconnectDisposal.add(
      listen(
        this._host,
        'vds-show-controls-request',
        this._handleShowControlsRequest.bind(this)
      )
    );

    this._disconnectDisposal.add(
      listen(
        this._host,
        'vds-hide-controls-request',
        this._handleHideControlsRequest.bind(this)
      )
    );
  }

  protected _setHiddenContext(isHidden) {
    this._host.ctx.customControls = !isHidden;
  }

  /**
   * Show all controls.
   *
   * @param request
   */
  async show(request?: Event): Promise<void> {
    if (!this.isHidden) return;
    this._setHiddenContext(false);
    await this.waitForUpdateComplete();
    this._handleControlsChange(request);
  }

  /**
   * Hide all controls.
   *
   * @param request
   */
  async hide(request?: Event): Promise<void> {
    if (this.isHidden) return;
    this._setHiddenContext(true);
    await this.waitForUpdateComplete();
    this._handleControlsChange(request);
  }

  /**
   * Wait for all controls `updateComplete` to finish.
   */
  async waitForUpdateComplete(): Promise<void> {
    await Promise.all(
      Array.from(this._managedElements).map(
        (controls) => controls.updateComplete
      )
    );
  }

  private _prevHiddenValue = mediaContext.customControls.initialValue;

  protected _handleControlsChange(request?: Event): void {
    if (this.isHidden === this._prevHiddenValue) return;

    this._host.dispatchEvent(
      vdsEvent('vds-controls-change', {
        detail: !this.isHidden,
        originalEvent: request
      })
    );

    this._prevHiddenValue = this.isHidden;
  }

  protected async _handleShowControlsRequest(
    request: ShowControlsRequestEvent
  ): Promise<void> {
    request.stopPropagation();
    await this.show(request);
  }

  protected async _handleHideControlsRequest(
    request: HideControlsRequestEvent
  ): Promise<void> {
    request.stopPropagation();
    await this.hide(request);
  }
}
