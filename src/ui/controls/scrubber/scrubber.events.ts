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
  scrubberpreviewshow: VdsCustomEvent<void>;
  scrubberpreviewhide: VdsCustomEvent<void>;
  scrubberpreviewtimeupdate: VdsCustomEvent<number>;
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
  'scrubberpreviewshow',
) {}

/**
 * Emitted when the preview transitions from showing to hidden.
 */
export class VdsScrubberPreviewHideEvent extends buildVdsScrubberEvent(
  'scrubberpreviewhide',
) {}

/**
 * Emitted when the time being previewed changes.
 */
export class VdsScrubberPreviewTimeUpdate extends buildVdsScrubberEvent(
  'scrubberpreviewtimeupdate',
) {}
