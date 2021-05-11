import {
  VdsCustomEvent,
  VdsEventInit,
  VdsEvents,
} from '../../../shared/events';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface GlobalEventHandlersEventMap extends VdsSliderEvents {}
}

export interface SliderEvents {
  'slider-value-change': VdsCustomEvent<number>;
  'slider-drag-start': VdsCustomEvent<number>;
  'slider-drag-end': VdsCustomEvent<number>;
}

export type VdsSliderEvents = VdsEvents<SliderEvents>;

export class VdsSliderEvent<DetailType> extends VdsCustomEvent<DetailType> {
  static readonly TYPE: keyof VdsSliderEvents;
}

/**
 * Fired when the slider value changes.
 */
export class VdsSliderValueChangeEvent extends VdsSliderEvent<number> {
  static readonly TYPE = 'vds-slider-value-change';
  constructor(eventInit: VdsEventInit<number>) {
    super(VdsSliderValueChangeEvent.TYPE, eventInit);
  }
}

/**
 * Fired when the user begins interacting with the slider and dragging the thumb.
 */
export class VdsSliderDragStartEvent extends VdsSliderEvent<number> {
  static readonly TYPE = 'vds-slider-drag-start';
  constructor(eventInit: VdsEventInit<number>) {
    super(VdsSliderDragStartEvent.TYPE, eventInit);
  }
}

/**
 * Fired when the user stops dragging the slider thumb.
 */
export class VdsSliderDragEndEvent extends VdsSliderEvent<number> {
  static readonly TYPE = 'vds-slider-drag-end';
  constructor(eventInit: VdsEventInit<number>) {
    super(VdsSliderDragEndEvent.TYPE, eventInit);
  }
}
