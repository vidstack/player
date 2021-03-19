import {
  buildVdsEvent,
  ExtractEventDetailType,
  VdsCustomEvent,
  VdsCustomEventConstructor,
  VdsEvents,
} from '../../../shared/events';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface GlobalEventHandlersEventMap extends VdsScrubberEvents {}
}

export interface ScrubberEvents {
  'scrubber-preview-show': VdsCustomEvent<void>;
  'scrubber-preview-hide': VdsCustomEvent<void>;
  'scrubber-preview-time-update': VdsCustomEvent<number>;
}

export type VdsScrubberEvents = VdsEvents<ScrubberEvents>;

export function buildVdsScrubberEvent<
  P extends keyof ScrubberEvents,
  DetailType = ExtractEventDetailType<ScrubberEvents[P]>
>(type: P): VdsCustomEventConstructor<DetailType> {
  return class VdsScrubberEvent extends buildVdsEvent<DetailType>(type) {};
}

/**
 * Emitted when the preview transitions from hdiden to showing.
 */
export class VdsScrubberPreviewShowEvent extends buildVdsScrubberEvent(
  'scrubber-preview-show',
) {}

/**
 * Emitted when the preview transitions from showing to hidden.
 */
export class VdsScrubberPreviewHideEvent extends buildVdsScrubberEvent(
  'scrubber-preview-hide',
) {}

/**
 * Emitted when the time being previewed changes.
 */
export class VdsScrubberPreviewTimeUpdate extends buildVdsScrubberEvent(
  'scrubber-preview-time-update',
) {}
