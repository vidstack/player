import {
  buildVdsEvent,
  ExtractEventDetailType,
  VdsCustomEvent,
  VdsCustomEventConstructor,
  VdsEvents,
} from '../../../shared/events';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface GlobalEventHandlersEventMap extends VdsSliderEvents {}
}

export interface SliderEvents {
  slidervaluechange: VdsCustomEvent<number>;
  sliderdragstart: VdsCustomEvent<void>;
  sliderdragend: VdsCustomEvent<void>;
}

export type VdsSliderEvents = VdsEvents<SliderEvents>;

export function buildVdsSliderEvent<
  P extends keyof SliderEvents,
  DetailType = ExtractEventDetailType<SliderEvents[P]>
>(type: P): VdsCustomEventConstructor<DetailType> {
  return class VdsSliderEvent extends buildVdsEvent<DetailType>(type) {};
}

/**
 * Fired when the slider value changes.
 */
export class VdsSliderValueChangeEvent extends buildVdsSliderEvent(
  'slidervaluechange',
) {}

/**
 * Fired when the user begins interacting with the slider and dragging the thumb.
 */
export class VdsSliderDragStartEvent extends buildVdsSliderEvent(
  'sliderdragstart',
) {}

/**
 * Fired when the user stops dragging the slider thumb.
 */
export class VdsSliderDragEndEvent extends buildVdsSliderEvent(
  'sliderdragend',
) {}
