import { LIB_PREFIX } from '../../../shared/constants';
import {
  buildVdsEvent,
  VdsCustomEvent,
  VdsCustomEventConstructor,
} from '../../../shared/events';

export const SLIDER_EVENT_PREFIX = 'slider';

export type RawSliderEventType =
  | 'slider-value-change'
  | 'slider-drag-start'
  | 'slider-drag-end';

export type RawSliderEventDetailType = {
  'slider-value-change': number;
  'slider-drag-start': void;
  'slider-drag-end': void;
};

export type GenericVdsSliderEventType<
  T extends string
> = `${typeof LIB_PREFIX}-${typeof SLIDER_EVENT_PREFIX}-${T}`;

export type SliderEventConstructor<
  T extends RawSliderEventType
> = VdsCustomEventConstructor<RawSliderEventDetailType[T]>;

export type SliderEventConstructors = {
  [P in RawSliderEventType as GenericVdsSliderEventType<P>]: SliderEventConstructor<P>;
};

export type SliderEvents = {
  [P in RawSliderEventType as GenericVdsSliderEventType<P>]: VdsCustomEvent<
    RawSliderEventDetailType[P]
  >;
};

export type SliderEventType = keyof SliderEvents;

export function buildSliderEvent<
  P extends RawSliderEventType,
  DetailType = RawSliderEventDetailType[P]
>(type: P): VdsCustomEventConstructor<DetailType> {
  const prefixedType = `${SLIDER_EVENT_PREFIX}-${type}`;
  class SliderEvent extends buildVdsEvent<DetailType>(prefixedType) {}
  return SliderEvent;
}

/**
 * Emitted when the slider value changes.
 */
export class SliderValueChangeEvent extends buildSliderEvent(
  'slider-value-change',
) {}

/**
 * Emitted when the user begins interacting with the slider and dragging the thumb.
 */
export class SliderDragStartEvent extends buildSliderEvent(
  'slider-drag-start',
) {}

/**
 * Emitted when the user stops dragging the slider thumb.
 */
export class SliderDragEndEvent extends buildSliderEvent('slider-drag-end') {}
