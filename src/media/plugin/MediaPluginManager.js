import { PluginManager } from '../../shared/plugin/index.js';
import { MediaPluginConnectEvent } from './events.js';

/**
 * @typedef {import('lit').ReactiveElement} MediaPluginManagerHost
 */

/**
 * @template {import('lit').ReactiveElement} HostElement
 * @extends {PluginManager<HostElement>}
 */
export class MediaPluginManager extends PluginManager {
	/** @protected */
	static get ScopedManagedControllerConnectEvent() {
		return MediaPluginConnectEvent;
	}
}
