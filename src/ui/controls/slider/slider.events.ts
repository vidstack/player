import { buildVdsEvent } from '../../../shared/events';

/**
 * Emitted when the slider value changes.
 */
export class SliderValueChangeEvent extends buildVdsEvent<number>(
  'slider-value-change',
) {}
