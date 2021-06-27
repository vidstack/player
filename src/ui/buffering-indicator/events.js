import { VdsCustomEvent } from '../../foundation/events/index.js';

export class BufferingIndicatorEvent extends VdsCustomEvent {}

export class BufferingIndicatorShowEvent extends BufferingIndicatorEvent {
  static TYPE = 'vds-buffering-indicator-show';
  constructor(eventInit) {
    super(BufferingIndicatorShowEvent.TYPE, eventInit);
  }
}

export class BufferingIndicatorHideEvent extends BufferingIndicatorEvent {
  static TYPE = 'vds-buffering-indicator-hide';
  constructor(eventInit) {
    super(BufferingIndicatorHideEvent.TYPE, eventInit);
  }
}
