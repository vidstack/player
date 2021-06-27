import { VdsCustomEvent, VdsEventInit } from '../../../shared/events/index.js';

declare global {
  interface GlobalEventHandlersEventMap extends VdsSliderEvents {}
}

export interface VdsSliderEvents {
  'vds-slider-value-change': VdsCustomEvent<number>;
  'vds-slider-drag-start': VdsCustomEvent<number>;
  'vds-slider-drag-end': VdsCustomEvent<number>;
}

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
