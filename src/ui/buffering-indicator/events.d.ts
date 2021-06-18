import { VdsCustomEvent, VdsEventInit } from '../../shared/events';

declare global {
	interface GlobalEventHandlersEventMap extends VdsBufferingIndicatorEvents {}
}

export interface VdsBufferingIndicatorEvents {
	'vds-buffering-indicator-show': VdsCustomEvent<void>;
	'vds-buffering-indicator-hide': VdsCustomEvent<void>;
}

export class VdsBufferingIndicatorEvent<
	DetailType
> extends VdsCustomEvent<DetailType> {
	static readonly TYPE: keyof VdsBufferingIndicatorEvents;
}

/**
 * Emitted when the buffering indicator is shown.
 */
export class VdsBufferingIndicatorShowEvent extends VdsBufferingIndicatorEvent<void> {
	static readonly TYPE = 'vds-buffering-indicator-show';
	constructor(eventInit?: VdsEventInit<void>) {
		super(VdsBufferingIndicatorShowEvent.TYPE, eventInit);
	}
}

/**
 * Emitted when the buffering indicator is hidden.
 */
export class VdsBufferingIndicatorHideEvent extends VdsBufferingIndicatorEvent<void> {
	static readonly TYPE = 'vds-buffering-indicator-hide';
	constructor(eventInit?: VdsEventInit<void>) {
		super(VdsBufferingIndicatorHideEvent.TYPE, eventInit);
	}
}
