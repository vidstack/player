import { ReactiveElement } from 'lit';

import { DEV_MODE } from '../../../global/env';
import { DisposalBin, vdsEvent } from '../../events';
import { Logger } from '../../logger';

export class ElementDiscoveryController<HostElement extends ReactiveElement> {
  protected readonly _logger!: Logger;

  protected readonly _disconnectDisposal: DisposalBin;

  constructor(
    protected readonly _host: HostElement,
    protected readonly _eventType: keyof GlobalEventHandlersEventMap
  ) {
    /* c8 ignore start */
    if (DEV_MODE) {
      this._logger = new Logger(_host, { owner: this });
    }
    /* c8 ignore stop */

    this._disconnectDisposal = new DisposalBin(
      _host,
      /* c8 ignore next */
      DEV_MODE && { name: 'disconnectDisposal', owner: this }
    );

    _host.addController({
      hostConnected: this._handleHostConnected.bind(this),
      hostDisconnected: this._handleHostDisconnected.bind(this)
    });
  }

  protected _handleHostConnected() {
    const event = vdsEvent(this._eventType, {
      bubbles: true,
      composed: true,
      detail: {
        element: this._host,
        onDisconnect: (callback: () => void) => {
          this._disconnectDisposal.add(callback);
        }
      }
    });

    /* c8 ignore start */
    if (DEV_MODE) {
      this._logger
        .debugGroup('dispatched discovery event')
        .appendWithLabel('Event type', event.type)
        .appendWithLabel('Event', event)
        .end();
    }
    /* c8 ignore stop */

    this._host.dispatchEvent(event);
  }

  protected _handleHostDisconnected() {
    this._disconnectDisposal.empty();
  }
}
