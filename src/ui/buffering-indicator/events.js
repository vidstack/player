import { VdsCustomEvent } from '../../shared/events';

export class VdsBufferingIndicatorEvent extends VdsCustomEvent {}

export class VdsBufferingIndicatorShowEvent extends VdsBufferingIndicatorEvent {
	static TYPE = 'vds-buffering-indicator-show';
	constructor(eventInit) {
		super(VdsBufferingIndicatorShowEvent.TYPE, eventInit);
	}
}

export class VdsBufferingIndicatorHideEvent extends VdsBufferingIndicatorEvent {
	static TYPE = 'vds-buffering-indicator-hide';
	constructor(eventInit) {
		super(VdsBufferingIndicatorHideEvent.TYPE, eventInit);
	}
}
