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
export class ScrubberEvent<DetailType> extends VdsCustomEvent<DetailType> {
}
/**
 * Emitted when the preview transitions from hidden to showing.
 *
 * @augments {ScrubberEvent<void>}
 */
export class ScrubberPreviewShowEvent extends ScrubberEvent<void> {
    /** @readonly */
    static readonly TYPE: "vds-scrubber-preview-show";
    constructor(eventInit?: import("../../../foundation/events/events.js").VdsEventInit<void> | undefined, type?: string | undefined, final?: boolean | undefined);
}
/**
 * Emitted when the preview transitions from showing to hidden.
 *
 * @augments {ScrubberEvent<void>}
 */
export class ScrubberPreviewHideEvent extends ScrubberEvent<void> {
    /** @readonly */
    static readonly TYPE: "vds-scrubber-preview-hide";
    constructor(eventInit?: import("../../../foundation/events/events.js").VdsEventInit<void> | undefined, type?: string | undefined, final?: boolean | undefined);
}
/**
 * Emitted when the time being previewed changes.
 *
 * @augments {ScrubberEvent<number>}
 */
export class ScrubberPreviewTimeUpdateEvent extends ScrubberEvent<number> {
    /** @readonly */
    static readonly TYPE: "vds-scrubber-preview-time-update";
    constructor(eventInit?: import("../../../foundation/events/events.js").VdsEventInit<number> | undefined, type?: string | undefined, final?: boolean | undefined);
}
export type ScrubberEvents = {
    [ScrubberPreviewShowEvent.TYPE]: ScrubberPreviewShowEvent;
    [ScrubberPreviewHideEvent.TYPE]: ScrubberPreviewHideEvent;
    [ScrubberPreviewTimeUpdateEvent.TYPE]: ScrubberPreviewTimeUpdateEvent;
};
import { VdsCustomEvent } from "../../../foundation/events/events.js";
