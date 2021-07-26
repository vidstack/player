import {
  ManagedElement,
  ManagedElementConnectEvent
} from '@base/elements/index.js';

/**
 * @typedef {import('lit').ReactiveElement} ManagedControlsHost
 */

/**
 * Fired when connecting a new controls manager with the `MediaControllerElement`.
 *
 * @bubbles
 * @composed
 * @augments ManagedElementConnectEvent<ManagedControlsHost>
 */
export class ManagedControlsConnectEvent extends ManagedElementConnectEvent {
  /** @readonly */
  static TYPE = 'vds-managed-controls-connect';
}

/**
 * @augments {ManagedElement<ManagedControlsHost>}
 */
export class ManagedControls extends ManagedElement {
  /**
   * @protected
   * @type {import('@base/elements').ScopedDiscoveryEvent<any>}
   */
  static get _ScopedDiscoveryEvent() {
    return ManagedControlsConnectEvent;
  }
}
