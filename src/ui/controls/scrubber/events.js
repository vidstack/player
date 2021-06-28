import { VdsCustomEvent } from '../../../foundation/events/index.js';

/**
 * @typedef {{
 *  [ScrubberPreviewShowEvent.TYPE]: ScrubberPreviewShowEvent;
 *  [ScrubberPreviewHideEvent.TYPE]: ScrubberPreviewHideEvent;
 *  [ScrubberPreviewTimeUpdateEvent.TYPE]: ScrubberPreviewTimeUpdateEvent;
 * }} ScrubberEvents
 */

/**
 * @template DetailType
 * @extends {VdsCustomEvent<DetailType>}
 */
export class ScrubberEvent extends VdsCustomEvent {}

/**
 * Emitted when the preview transitions from hidden to showing.
 *
 * @extends {ScrubberEvent<void>}
 */
export class ScrubberPreviewShowEvent extends ScrubberEvent {
  /** @readonly */
  static TYPE = 'vds-scrubber-preview-show';
}

/**
 * Emitted when the preview transitions from showing to hidden.
 *
 * @extends {ScrubberEvent<void>}
 */
export class ScrubberPreviewHideEvent extends ScrubberEvent {
  /** @readonly */
  static TYPE = 'vds-scrubber-preview-hide';
}

/**
 * Emitted when the time being previewed changes.
 *
 * @extends {ScrubberEvent<number>}
 */
export class ScrubberPreviewTimeUpdateEvent extends ScrubberEvent {
  /** @readonly */
  static TYPE = 'vds-scrubber-preview-time-update';
}
