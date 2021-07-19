import { VdsCustomEvent } from '../../foundation/events/index.js';

/**
 * @typedef {{
 *  [SliderDragStartEvent.TYPE]: SliderDragStartEvent;
 *  [SliderDragEndEvent.TYPE]: SliderDragEndEvent;
 *  [SliderValueChangeEvent.TYPE]: SliderValueChangeEvent;
 * }} SliderEvents
 */

/**
 * @template DetailType
 * @augments {VdsCustomEvent<DetailType>}
 */
export class SliderEvent extends VdsCustomEvent {}

/**
 * Fired when the user begins interacting with the slider and dragging the thumb. The event
 * detail contains the current value the drag is starting at.
 *
 * @augments {SliderEvent<number>}
 */
export class SliderDragStartEvent extends SliderEvent {
  /** @readonly */
  static TYPE = 'vds-slider-drag-start';
}

/**
 * Fired when the user stops dragging the slider thumb. The event detail contains the value
 * the drag is ending at.
 *
 * @augments {SliderEvent<number>}
 */
export class SliderDragEndEvent extends SliderEvent {
  /** @readonly */
  static TYPE = 'vds-slider-drag-end';
}

/**
 * Fired when the slider value changes. The event detail contains the current value.
 *
 * @augments {SliderEvent<number>}
 */
export class SliderValueChangeEvent extends SliderEvent {
  /** @readonly */
  static TYPE = 'vds-slider-value-change';
}
