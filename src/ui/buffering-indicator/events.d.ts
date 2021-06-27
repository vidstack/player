import { VdsCustomEvent, VdsEventInit } from '../../shared/events/index.js';

declare global {
  interface GlobalEventHandlersEventMap extends BufferingIndicatorEvents {}
}

export interface BufferingIndicatorEvents {
  'vds-buffering-indicator-show': VdsCustomEvent<void>;
  'vds-buffering-indicator-hide': VdsCustomEvent<void>;
}

export class BufferingIndicatorEvent<
  DetailType
> extends VdsCustomEvent<DetailType> {
  static readonly TYPE: keyof BufferingIndicatorEvents;
}

/**
 * Emitted when the buffering indicator is shown.
 */
export class BufferingIndicatorShowEvent extends BufferingIndicatorEvent<void> {
  static readonly TYPE = 'vds-buffering-indicator-show';
  constructor(eventInit?: VdsEventInit<void>) {
    super(BufferingIndicatorShowEvent.TYPE, eventInit);
  }
}

/**
 * Emitted when the buffering indicator is hidden.
 */
export class BufferingIndicatorHideEvent extends BufferingIndicatorEvent<void> {
  static readonly TYPE = 'vds-buffering-indicator-hide';
  constructor(eventInit?: VdsEventInit<void>) {
    super(BufferingIndicatorHideEvent.TYPE, eventInit);
  }
}
