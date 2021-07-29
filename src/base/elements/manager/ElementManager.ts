import { ReactiveElement } from 'lit';

import { DisposalBin, listen } from '../../events';
import { ScopedDiscoveryEvent } from '../discovery/events';
import { ManagedElementConnectEvent } from './ManagedElement';

export class ElementManager<ManagedElement extends ReactiveElement> {
  protected static get _ScopedDiscoveryEvent(): ScopedDiscoveryEvent {
    return ManagedElementConnectEvent;
  }

  protected readonly _managedElements: Omit<Set<ManagedElement>, 'clear'> =
    new Set();

  protected readonly _disconnectDisposal = new DisposalBin();

  constructor(protected readonly _host: ReactiveElement) {
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
  }

  protected _handleHostDisconnected() {
    this._disconnectDisposal.empty();
    this._removeAllElements();
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
  }

  protected _handleElementAdded(element: ManagedElement) {
    // no-op
  }

  protected _removeElement(element: ManagedElement) {
    if (!this._managedElements.has(element)) return;
    this._managedElements.delete(element);
    this._handleElementRemoved(element);
  }

  protected _removeAllElements() {
    this._managedElements.forEach(this._removeElement.bind(this));
  }

  protected _handleElementRemoved(element: ManagedElement) {
    // no-op
  }
}
