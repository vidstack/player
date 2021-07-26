import { VdsEvent } from '@base/events/index.js';

/**
 * @typedef {{
 *  'vds-scrubber-preview-show': ScrubberPreviewShowEvent;
 *  'vds-scrubber-preview-hide': ScrubberPreviewHideEvent;
 *  'vds-scrubber-preview-time-update': ScrubberPreviewTimeUpdateEvent;
 * }} ScrubberPreviewEvents
 */

/**
 * Emitted when the preview transitions from hidden to showing.
 *
 * @event
 * @typedef {VdsEvent<void>} ScrubberPreviewShowEvent
 */

/**
 * Emitted when the preview transitions from showing to hidden.
 *
 * @event
 * @typedef {VdsEvent<void>} ScrubberPreviewHideEvent
 */

/**
 * Emitted when the time being previewed changes.
 *
 * @event
 * @typedef {VdsEvent<number>} ScrubberPreviewTimeUpdateEvent
 */
