import { ReactiveElement } from 'lit';

import {
  DiscoveryEventDetail,
  ElementDiscoveryController,
  ScopedDiscoveryEvent
} from '../../elements/discovery';
import { VdsEvent } from '../../events';

export class ManagedElementConnectEvent<
  ManagedElement extends Element
> extends VdsEvent<DiscoveryEventDetail<ManagedElement>> {
  static readonly TYPE: keyof GlobalEventHandlersEventMap = 'vds-noop';
}

export class ManagedElement<HostElement extends ReactiveElement> {
  protected static get _ScopedDiscoveryEvent(): ScopedDiscoveryEvent {
    return ManagedElementConnectEvent;
  }

  protected readonly _discoveryController: ElementDiscoveryController<HostElement>;

  constructor(protected readonly _host: HostElement) {
    this._discoveryController = new ElementDiscoveryController(
      _host,
      this._getScopedDiscoveryEvent().TYPE
    );
  }

  protected _getScopedDiscoveryEvent(): ScopedDiscoveryEvent {
    const ctor = this.constructor as typeof ManagedElement;
    const ScopedDiscoveryEvent = ctor._ScopedDiscoveryEvent;
    return ScopedDiscoveryEvent;
  }
}
