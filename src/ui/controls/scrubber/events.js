import { VdsCustomEvent } from '../../../foundation/events/index.js';

export class ScrubberEvent extends VdsCustomEvent {}

export class ScrubberPreviewShowEvent extends ScrubberEvent {
  static TYPE = 'vds-scrubber-preview-show';
  constructor(eventInit) {
    super(ScrubberPreviewShowEvent.TYPE, eventInit);
  }
}

export class ScrubberPreviewHideEvent extends ScrubberEvent {
  static TYPE = 'vds-scrubber-preview-hide';
  constructor(eventInit) {
    super(ScrubberPreviewHideEvent.TYPE, eventInit);
  }
}

export class ScrubberPreviewTimeUpdateEvent extends ScrubberEvent {
  static TYPE = 'vds-scrubber-preview-time-update';
  constructor(eventInit) {
    super(ScrubberPreviewTimeUpdateEvent.TYPE, eventInit);
  }
}
