import { DisposalBin, vdsEvent } from '@base/events/index';
import { ReactiveElement } from 'lit';

export class ElementDiscoveryController<HostElement extends ReactiveElement> {
  protected readonly _disconnectDisposal = new DisposalBin();

  constructor(
    protected readonly _host: HostElement,
    protected readonly _eventType: keyof GlobalEventHandlersEventMap
  ) {
    _host.addController({
      hostConnected: this._handleHostConnected.bind(this),
      hostDisconnected: this._handleHostDisconnected.bind(this)
    });
  }

  protected _handleHostConnected() {
    this._host.dispatchEvent(
      vdsEvent(this._eventType, {
        bubbles: true,
        composed: true,
        detail: {
          element: this._host,
          onDisconnect: (callback: () => void) => {
            this._disconnectDisposal.add(callback);
          }
        }
      })
    );
  }

  protected _handleHostDisconnected() {
    this._disconnectDisposal.empty();
  }
}
