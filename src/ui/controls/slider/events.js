import { VdsCustomEvent } from '../../../shared/events';

export class VdsSliderEvent extends VdsCustomEvent {}

export class VdsSliderValueChangeEvent extends VdsSliderEvent {
	static TYPE = 'vds-slider-value-change';
	constructor(eventInit) {
		super(VdsSliderValueChangeEvent.TYPE, eventInit);
	}
}

export class VdsSliderDragStartEvent extends VdsSliderEvent {
	static TYPE = 'vds-slider-drag-start';
	constructor(eventInit) {
		super(VdsSliderDragStartEvent.TYPE, eventInit);
	}
}

export class VdsSliderDragEndEvent extends VdsSliderEvent {
	static TYPE = 'vds-slider-drag-end';
	constructor(eventInit) {
		super(VdsSliderDragEndEvent.TYPE, eventInit);
	}
}
