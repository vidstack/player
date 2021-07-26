import {
  ManagedElement,
  ManagedElementConnectEvent
} from '@base/elements/index';
import { ReactiveElement } from 'lit';

export type ManagedControlsHost = ReactiveElement;

/**
 * Fired when connecting a new controls manager with the `MediaControllerElement`.
 *
 * @bubbles
 * @composed
 */
export class ManagedControlsConnectEvent extends ManagedElementConnectEvent<ManagedControlsHost> {
  static override readonly TYPE = 'vds-managed-controls-connect';
}

export class ManagedControls extends ManagedElement<ManagedControlsHost> {
  protected static override get _ScopedDiscoveryEvent() {
    return ManagedControlsConnectEvent;
  }
}
