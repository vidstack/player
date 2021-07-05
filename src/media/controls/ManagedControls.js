import {
  ManagedElement,
  ManagedElementConnectEvent
} from '../../foundation/elements/index.js';

/**
 * @typedef {{
 *   showControls(): Promise<void>;
 *   hideControls(): Promise<void>;
 * } & import('lit').ReactiveElement} ControlsHost
 */

/**
 * Fired when connecting a new controls manager with the `MediaControllerElement`.
 *
 * @bubbles
 * @composed
 * @augments ManagedElementConnectEvent<ControlsHost>
 */
export class ManagedControlsConnectEvent extends ManagedElementConnectEvent {
  static DEFAULT_BUBBLES = true;
  static DEFAULT_COMPOSED = true;
}

/**
 * @augments {ManagedElement<ControlsHost>}
 */
export class ManagedControls extends ManagedElement {
  /**
   * @protected
   * @type {import('../../foundation/elements').ScopedManagedElementConnectEvent}
   */
  static get ScopedManagedElementConnectEvent() {
    return ManagedControlsConnectEvent;
  }
}
