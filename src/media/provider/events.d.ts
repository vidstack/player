import { VdsCustomEvent, VdsEventInit } from '../../shared/events/index.js';
import { MediaProviderElement } from './MediaProviderElement.js';

declare global {
	interface GlobalEventHandlersEventMap extends VdsMediaProviderEvents {}
}

export interface MediaProviderConnectEventDetail {
	provider: MediaProviderElement;
	onDisconnect: (callback: () => void) => void;
}

export interface VdsMediaProviderEvents {
	'vds-media-provider-connect': VdsCustomEvent<MediaProviderConnectEventDetail>;
}

export class VdsMediaProviderEvent<
	DetailType
> extends VdsCustomEvent<DetailType> {
	static readonly TYPE: keyof VdsMediaProviderEvents;
}

/**
 * Fired when the media provider connects to the DOM.
 *
 * @bubbles
 * @composed
 */
export class VdsMediaProviderConnectEvent extends VdsMediaProviderEvent<MediaProviderConnectEventDetail> {
	static readonly TYPE = 'vds-media-provider-connect';
	constructor(eventInit: VdsEventInit<MediaProviderConnectEventDetail>);
}
