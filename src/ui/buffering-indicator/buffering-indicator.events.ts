import { VdsCustomEvent, VdsEventInit, VdsEvents } from '../../shared/events';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface GlobalEventHandlersEventMap extends VdsBufferingIndicatorEvents {}
}

export interface BufferingIndicatorEvents {
  'buffering-indicator-show': VdsCustomEvent<void>;
  'buffering-indicator-hide': VdsCustomEvent<void>;
}

export type VdsBufferingIndicatorEvents = VdsEvents<BufferingIndicatorEvents>;

export class VdsBufferingIndicatorEvent<
  DetailType
> extends VdsCustomEvent<DetailType> {
  static readonly TYPE: keyof VdsBufferingIndicatorEvents;
}

/**
 * Emitted when the buffering indicator is shown.
 */
export class VdsBufferingIndicatorShowEvent extends VdsBufferingIndicatorEvent<void> {
  static readonly TYPE = 'vds-buffering-indicator-show';
  constructor(eventInit?: VdsEventInit<void>) {
    super(VdsBufferingIndicatorShowEvent.TYPE, eventInit);
  }
}

/**
 * Emitted when the buffering indicator is hidden.
 */
export class VdsBufferingIndicatorHideEvent extends VdsBufferingIndicatorEvent<void> {
  static readonly TYPE = 'vds-buffering-indicator-hide';
  constructor(eventInit?: VdsEventInit<void>) {
    super(VdsBufferingIndicatorHideEvent.TYPE, eventInit);
  }
}
