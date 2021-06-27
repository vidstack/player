import { Plugin } from '../../shared/plugin/index.js';
import { MediaPluginConnectEvent } from './events.js';

/**
 * @template {import('lit').ReactiveElement} HostElement
 * @extends {Plugin<HostElement>}
 */
export class MediaPlugin extends Plugin {
	/** @protected */
	static get ScopedManagedControllerConnectEvent() {
		return MediaPluginConnectEvent;
	}
}
