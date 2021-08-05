import { ReactiveElement } from 'lit';

import { DEV_MODE } from '../../../env';
import { DisposalBin, listen } from '../../events';
import { Logger } from '../../logger';
import { ScopedDiscoveryEvent } from '../discovery/events';
import { ManagedElementConnectEvent } from './ManagedElement';

export class ElementManager<ManagedElement extends ReactiveElement> {
  protected static get _ScopedDiscoveryEvent(): ScopedDiscoveryEvent {
    return ManagedElementConnectEvent;
  }

  protected readonly _managedElements: Omit<Set<ManagedElement>, 'clear'> =
    new Set();

  protected readonly _disconnectDisposal: DisposalBin;

  protected readonly _logger!: Logger;

  constructor(protected readonly _host: ReactiveElement) {
    if (DEV_MODE) {
      this._logger = new Logger(_host, { owner: this });
    }

    this._disconnectDisposal = new DisposalBin(
      _host,
      DEV_MODE && { name: 'elementManagerDisconnectDisposal', owner: this }
    );

    _host.addController({
      hostConnected: this._handleHostConnected.bind(this),
      hostDisconnected: this._handleHostDisconnected.bind(this)
    });
  }

  protected _handleHostConnected() {
    const ScopedDiscoveryEvent = this._getScopedDiscoveryEvent();

    this._disconnectDisposal.add(
      listen(
        this._host,
        ScopedDiscoveryEvent.TYPE,
        this._handleElementConnect.bind(this)
      )
    );

    if (DEV_MODE) {
      this._logger.debug('started listening');
    }
  }

  protected _handleHostDisconnected() {
    this._disconnectDisposal.empty();
    this._removeAllElements();

    if (DEV_MODE) {
      this._logger.debug('disconnected');
    }
  }

  protected _handleElementConnect(
    event: ManagedElementConnectEvent<ManagedElement>
  ) {
    const { element, onDisconnect } = event.detail;

    this._addElement(element);

    onDisconnect(() => {
      this._removeElement(element);
    });
  }

  protected _getScopedDiscoveryEvent(): ScopedDiscoveryEvent {
    const ctor = this.constructor as typeof ElementManager;
    const ScopedDiscoveryEvent = ctor._ScopedDiscoveryEvent;
    return ScopedDiscoveryEvent;
  }

  protected _addElement(element: ManagedElement) {
    if (this._managedElements.has(element)) return;
    this._managedElements.add(element);
    this._handleElementAdded(element);

    if (DEV_MODE) {
      this._logger
        .debugGroup('added element')
        .appendWithLabel('Element', element)
        .end();
    }
  }

  protected _handleElementAdded(element: ManagedElement) {
    // no-op
  }

  protected _removeElement(element: ManagedElement) {
    if (!this._managedElements.has(element)) return;
    this._managedElements.delete(element);
    this._handleElementRemoved(element);

    if (DEV_MODE) {
      this._logger
        .debugGroup('removed element')
        .appendWithLabel('Element', element)
        .end();
    }
  }

  protected _removeAllElements() {
    this._managedElements.forEach(this._removeElement.bind(this));
  }

  protected _handleElementRemoved(element: ManagedElement) {
    // no-op
  }
}
