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
 * @augments {VdsCustomEvent<DetailType>}
 */
export class ScrubberEvent extends VdsCustomEvent {}
/**
 * Emitted when the preview transitions from hidden to showing.
 *
 * @augments {ScrubberEvent<void>}
 */
export class ScrubberPreviewShowEvent extends ScrubberEvent {}
/** @readonly */
ScrubberPreviewShowEvent.TYPE = 'vds-scrubber-preview-show';
/**
 * Emitted when the preview transitions from showing to hidden.
 *
 * @augments {ScrubberEvent<void>}
 */
export class ScrubberPreviewHideEvent extends ScrubberEvent {}
/** @readonly */
ScrubberPreviewHideEvent.TYPE = 'vds-scrubber-preview-hide';
/**
 * Emitted when the time being previewed changes.
 *
 * @augments {ScrubberEvent<number>}
 */
export class ScrubberPreviewTimeUpdateEvent extends ScrubberEvent {}
/** @readonly */
ScrubberPreviewTimeUpdateEvent.TYPE = 'vds-scrubber-preview-time-update';
