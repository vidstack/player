import { VdsCustomEvent } from '../../shared/events/index.js';

export class VdsMediaContainerEvent extends VdsCustomEvent {}

export class VdsMediaContainerConnectEvent extends VdsMediaContainerEvent {
	static TYPE = 'vds-media-container-connect';
	constructor(eventInit) {
		super(VdsMediaContainerConnectEvent.TYPE, {
			bubbles: true,
			composed: true,
			...eventInit
		});
	}
}
