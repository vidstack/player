import { VdsCustomEvent } from '../../foundation/events/index.js';

/**
 * @typedef {{
 *  [ScrubberPreviewShowEvent.TYPE]: ScrubberPreviewShowEvent;
 *  [ScrubberPreviewHideEvent.TYPE]: ScrubberPreviewHideEvent;
 *  [ScrubberPreviewTimeUpdateEvent.TYPE]: ScrubberPreviewTimeUpdateEvent;
 * }} ScrubberPreviewEvents
 */

/**
 * @template DetailType
 * @augments {VdsCustomEvent<DetailType>}
 */
export class ScrubberPreviewEvent extends VdsCustomEvent {
  static DEFAULT_BUBBLES = true;
  static DEFAULT_COMPOSED = true;
}

/**
 * Emitted when the preview transitions from hidden to showing.
 *
 * @augments {ScrubberPreviewEvent<void>}
 */
export class ScrubberPreviewShowEvent extends ScrubberPreviewEvent {
  /** @readonly */
  static TYPE = 'vds-scrubber-preview-show';
}

/**
 * Emitted when the preview transitions from showing to hidden.
 *
 * @augments {ScrubberPreviewEvent<void>}
 */
export class ScrubberPreviewHideEvent extends ScrubberPreviewEvent {
  /** @readonly */
  static TYPE = 'vds-scrubber-preview-hide';
}

/**
 * Emitted when the time being previewed changes.
 *
 * @augments {ScrubberPreviewEvent<number>}
 */
export class ScrubberPreviewTimeUpdateEvent extends ScrubberPreviewEvent {
  /** @readonly */
  static TYPE = 'vds-scrubber-preview-time-update';
}
