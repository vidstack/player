import { VdsCustomEvent } from '../../../shared/events/index.js';

export class SliderEvent extends VdsCustomEvent {}

export class SliderValueChangeEvent extends SliderEvent {
  static TYPE = 'vds-slider-value-change';
  constructor(eventInit) {
    super(SliderValueChangeEvent.TYPE, eventInit);
  }
}

export class SliderDragStartEvent extends SliderEvent {
  static TYPE = 'vds-slider-drag-start';
  constructor(eventInit) {
    super(SliderDragStartEvent.TYPE, eventInit);
  }
}

export class SliderDragEndEvent extends SliderEvent {
  static TYPE = 'vds-slider-drag-end';
  constructor(eventInit) {
    super(SliderDragEndEvent.TYPE, eventInit);
  }
}
