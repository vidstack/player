import {
	VdsCustomEvent,
	VdsEventInit,
	VdsEvents
} from '../../../shared/events';

declare global {
	interface GlobalEventHandlersEventMap extends VdsScrubberEvents {}
}

export interface ScrubberEvents {
	'scrubber-preview-show': VdsCustomEvent<void>;
	'scrubber-preview-hide': VdsCustomEvent<void>;
	'scrubber-preview-time-update': VdsCustomEvent<number>;
}

export type VdsScrubberEvents = VdsEvents<ScrubberEvents>;

export class VdsScrubberEvent<DetailType> extends VdsCustomEvent<DetailType> {
	static readonly TYPE: keyof VdsScrubberEvents;
}

/**
 * Emitted when the preview transitions from hidden to showing.
 */
export class VdsScrubberPreviewShowEvent extends VdsScrubberEvent<void> {
	static readonly TYPE = 'vds-scrubber-preview-show';
	constructor(eventInit?: VdsEventInit<void>) {
		super(VdsScrubberPreviewShowEvent.TYPE, eventInit);
	}
}

/**
 * Emitted when the preview transitions from showing to hidden.
 */
export class VdsScrubberPreviewHideEvent extends VdsScrubberEvent<void> {
	static readonly TYPE = 'vds-scrubber-preview-hide';
	constructor(eventInit?: VdsEventInit<void>) {
		super(VdsScrubberPreviewHideEvent.TYPE, eventInit);
	}
}

/**
 * Emitted when the time being previewed changes.
 */
export class VdsScrubberPreviewTimeUpdateEvent extends VdsScrubberEvent<number> {
	static readonly TYPE = 'vds-scrubber-preview-time-update';
	constructor(eventInit: VdsEventInit<number>) {
		super(VdsScrubberPreviewTimeUpdateEvent.TYPE, eventInit);
	}
}
