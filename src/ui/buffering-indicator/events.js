import { VdsCustomEvent } from '../../foundation/events/index.js';

/**
 * @typedef {{
 *  [BufferingIndicatorShowEvent.TYPE]: BufferingIndicatorShowEvent;
 *  [BufferingIndicatorHideEvent.TYPE]: BufferingIndicatorHideEvent;
 * }} BufferingIndicatorEvents
 */

/**
 * @template DetailType
 * @extends {VdsCustomEvent<DetailType>}
 */
export class BufferingIndicatorEvent extends VdsCustomEvent {}

/**
 * Emitted when the buffering indicator is shown.
 *
 * @extends {BufferingIndicatorEvent<void>}
 */
export class BufferingIndicatorShowEvent extends BufferingIndicatorEvent {
  /** @readonly */
  static TYPE = 'vds-buffering-indicator-show';
}

/**
 * Emitted when the buffering indicator is hidden.
 *
 * @extends {BufferingIndicatorEvent<void>}
 */
export class BufferingIndicatorHideEvent extends BufferingIndicatorEvent {
  /** @readonly */
  static TYPE = 'vds-buffering-indicator-hide';
}
