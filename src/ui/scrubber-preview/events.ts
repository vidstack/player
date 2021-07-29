import { VdsEvent } from '../../base/events';

export type ScrubberPreviewEvents = {
  'vds-scrubber-preview-show': ScrubberPreviewShowEvent;
  'vds-scrubber-preview-hide': ScrubberPreviewHideEvent;
  'vds-scrubber-preview-time-update': ScrubberPreviewTimeUpdateEvent;
};

/**
 * Emitted when the preview transitions from hidden to showing.
 *
 * @event
 */
export type ScrubberPreviewShowEvent = VdsEvent<void>;

/**
 * Emitted when the preview transitions from showing to hidden.
 *
 * @event
 */
export type ScrubberPreviewHideEvent = VdsEvent<void>;

/**
 * Emitted when the time being previewed changes.
 *
 * @event
 */
export type ScrubberPreviewTimeUpdateEvent = VdsEvent<number>;
