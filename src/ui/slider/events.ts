import { VdsEvent } from '../../base/events';

export type SliderEvents = {
  'vds-slider-drag-start': SliderDragStartEvent;
  'vds-slider-drag-end': SliderDragEndEvent;
  'vds-slider-value-change': SliderValueChangeEvent;
  'vds-slider-drag-value-change': SliderDragValueChangeEvent;
  'vds-slider-pointer-value-change': SliderPointerValueChangeEvent;
};

/**
 * Fired when the user begins interacting with the slider and dragging the thumb. The event
 * detail contains the current value the drag is starting at.
 *
 * @event
 */
export type SliderDragStartEvent = VdsEvent<number>;

/**
 * Fired when the user stops dragging the slider thumb. The event detail contains the value
 * the drag is ending at.
 *
 * @event
 */
export type SliderDragEndEvent = VdsEvent<number>;

/**
 * Fired when the slider value changes. The event detail contains the current value.
 *
 * @event
 */
export type SliderValueChangeEvent = VdsEvent<number>;

/**
 * Fired when the slider drag value changes. The drag value indicates the last slider value that
 * the user has dragged to. The event detail contains the value.
 *
 * @event
 */
export type SliderDragValueChangeEvent = VdsEvent<number>;

/**
 * Fired when the device pointer is inside the slider region and it's position changes. The
 * event detail contains the value.
 *
 * @event
 */
export type SliderPointerValueChangeEvent = VdsEvent<number>;
