import { VdsCustomEvent, VdsEventInit, VdsEvents } from '../../shared/events';
import { MediaContainerElement } from './MediaContainerElement';

declare global {
	interface GlobalEventHandlersEventMap extends VdsMediaContainerEvents {}
}

export interface MediaContainerConnectEventDetail {
	container: MediaContainerElement;
	onDisconnect: (callback: () => void) => void;
}

export interface MediaContainerEvents {
	'media-container-connect': VdsCustomEvent<MediaContainerConnectEventDetail>;
}

export type VdsMediaContainerEvents = VdsEvents<MediaContainerEvents>;

export class VdsMediaContainerEvent<
	DetailType
> extends VdsCustomEvent<DetailType> {
	static readonly TYPE: keyof VdsMediaContainerEvents;
}

/**
 * Fired when the media provider connects to the DOM.
 *
 * @bubbles
 * @composed
 */
export class VdsMediaContainerConnectEvent extends VdsMediaContainerEvent<MediaContainerConnectEventDetail> {
	static readonly TYPE = 'vds-media-container-connect';
	constructor(eventInit: VdsEventInit<MediaContainerConnectEventDetail>);
}
