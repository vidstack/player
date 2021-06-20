import { VdsCustomEvent } from '../../../shared/events/index.js';

export class VdsScrubberEvent extends VdsCustomEvent {}

export class VdsScrubberPreviewShowEvent extends VdsScrubberEvent {
	static TYPE = 'vds-scrubber-preview-show';
	constructor(eventInit) {
		super(VdsScrubberPreviewShowEvent.TYPE, eventInit);
	}
}

export class VdsScrubberPreviewHideEvent extends VdsScrubberEvent {
	static TYPE = 'vds-scrubber-preview-hide';
	constructor(eventInit) {
		super(VdsScrubberPreviewHideEvent.TYPE, eventInit);
	}
}

export class VdsScrubberPreviewTimeUpdateEvent extends VdsScrubberEvent {
	static TYPE = 'vds-scrubber-preview-time-update';
	constructor(eventInit) {
		super(VdsScrubberPreviewTimeUpdateEvent.TYPE, eventInit);
	}
}
