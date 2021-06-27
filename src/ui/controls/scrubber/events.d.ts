import { VdsCustomEvent, VdsEventInit } from '../../../shared/events/index.js';

declare global {
  interface GlobalEventHandlersEventMap extends ScrubberEvents {}
}

export interface ScrubberEvents {
  'vds-scrubber-preview-show': VdsCustomEvent<void>;
  'vds-scrubber-preview-hide': VdsCustomEvent<void>;
  'vds-scrubber-preview-time-update': VdsCustomEvent<number>;
}

export class ScrubberEvent<DetailType> extends VdsCustomEvent<DetailType> {
  static readonly TYPE: keyof ScrubberEvents;
}

/**
 * Emitted when the preview transitions from hidden to showing.
 */
export class ScrubberPreviewShowEvent extends ScrubberEvent<void> {
  static readonly TYPE = 'vds-scrubber-preview-show';
  constructor(eventInit?: VdsEventInit<void>) {
    super(ScrubberPreviewShowEvent.TYPE, eventInit);
  }
}

/**
 * Emitted when the preview transitions from showing to hidden.
 */
export class ScrubberPreviewHideEvent extends ScrubberEvent<void> {
  static readonly TYPE = 'vds-scrubber-preview-hide';
  constructor(eventInit?: VdsEventInit<void>) {
    super(ScrubberPreviewHideEvent.TYPE, eventInit);
  }
}

/**
 * Emitted when the time being previewed changes.
 */
export class ScrubberPreviewTimeUpdateEvent extends ScrubberEvent<number> {
  static readonly TYPE = 'vds-scrubber-preview-time-update';
  constructor(eventInit: VdsEventInit<number>) {
    super(ScrubberPreviewTimeUpdateEvent.TYPE, eventInit);
  }
}
