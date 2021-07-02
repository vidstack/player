import { VdsCustomEvent } from '../../foundation/events/index.js';

/**
 * @typedef {{
 *  [BufferingIndicatorShowEvent.TYPE]: BufferingIndicatorShowEvent;
 *  [BufferingIndicatorHideEvent.TYPE]: BufferingIndicatorHideEvent;
 * }} BufferingIndicatorEvents
 */

/**
 * @template DetailType
 * @augments {VdsCustomEvent<DetailType>}
 */
export class BufferingIndicatorEvent extends VdsCustomEvent {}

/**
 * Emitted when the buffering indicator is shown.
 *
 * @augments {BufferingIndicatorEvent<void>}
 */
export class BufferingIndicatorShowEvent extends BufferingIndicatorEvent {
  /** @readonly */
  static TYPE = 'vds-buffering-indicator-show';
}

/**
 * Emitted when the buffering indicator is hidden.
 *
 * @augments {BufferingIndicatorEvent<void>}
 */
export class BufferingIndicatorHideEvent extends BufferingIndicatorEvent {
  /** @readonly */
  static TYPE = 'vds-buffering-indicator-hide';
}
