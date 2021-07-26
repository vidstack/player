import { VdsEvent } from '@base/events/index.js';

/**
 * @typedef {{
 *  'vds-slider-drag-start': SliderDragStartEvent;
 *  'vds-slider-drag-end': SliderDragEndEvent;
 *  'vds-slider-value-change': SliderValueChangeEvent;
 * }} SliderEvents
 */

/**
 * Fired when the user begins interacting with the slider and dragging the thumb. The event
 * detail contains the current value the drag is starting at.
 *
 * @event
 * @typedef {VdsEvent<number>} SliderDragStartEvent
 */

/**
 * Fired when the user stops dragging the slider thumb. The event detail contains the value
 * the drag is ending at.
 *
 * @event
 * @typedef {VdsEvent<number>} SliderDragEndEvent
 */

/**
 * Fired when the slider value changes. The event detail contains the current value.
 *
 * @event
 * @typedef {VdsEvent<number>} SliderValueChangeEvent
 */
