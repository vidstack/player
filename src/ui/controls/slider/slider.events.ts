import { buildVdsEvent } from '../../../shared/events';

/**
 * Emitted when the slider value changes.
 */
export class SliderValueChangeEvent extends buildVdsEvent<number>(
  'slider-value-change',
) {}

/**
 * Emitted when the user begins interacting with the slider and dragging the thumb.
 */
export class SliderDragStartEvent extends buildVdsEvent<void>(
  'slider-drag-start',
) {}

/**
 * Emitted when the user stops dragging the slider thumb.
 */
export class SliderDragEndEvent extends buildVdsEvent<void>(
  'slider-drag-end',
) {}
