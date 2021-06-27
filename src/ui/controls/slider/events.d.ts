import {
  VdsCustomEvent,
  VdsEventInit
} from '../../../foundation/events/index.js';

declare global {
  interface GlobalEventHandlersEventMap extends SliderEvents {}
}

export interface SliderEvents {
  'vds-slider-value-change': VdsCustomEvent<number>;
  'vds-slider-drag-start': VdsCustomEvent<number>;
  'vds-slider-drag-end': VdsCustomEvent<number>;
}

export class SliderEvent<DetailType> extends VdsCustomEvent<DetailType> {
  static readonly TYPE: keyof SliderEvents;
}

/**
 * Fired when the slider value changes.
 */
export class SliderValueChangeEvent extends SliderEvent<number> {
  static readonly TYPE = 'vds-slider-value-change';
  constructor(eventInit: VdsEventInit<number>) {
    super(SliderValueChangeEvent.TYPE, eventInit);
  }
}

/**
 * Fired when the user begins interacting with the slider and dragging the thumb.
 */
export class SliderDragStartEvent extends SliderEvent<number> {
  static readonly TYPE = 'vds-slider-drag-start';
  constructor(eventInit: VdsEventInit<number>) {
    super(SliderDragStartEvent.TYPE, eventInit);
  }
}

/**
 * Fired when the user stops dragging the slider thumb.
 */
export class SliderDragEndEvent extends SliderEvent<number> {
  static readonly TYPE = 'vds-slider-drag-end';
  constructor(eventInit: VdsEventInit<number>) {
    super(SliderDragEndEvent.TYPE, eventInit);
  }
}
