import { ManagedController } from '../../controller/index.js';
import { PluginConnectEvent } from './events.js';

/**
 * @template Properties
 * @typedef {{
 *  bridgedAttributes?: string[];
 *  bridgedProperties?: Properties[];
 *  bridgedEvents?: string[];
 * }} PluginBridgeOptions
 */

/**
 * @template {import('lit').ReactiveElement} HostElement
 * @typedef {PluginBridgeOptions<keyof HostElement>} PluginOptions
 */

/**
 * @template {import('lit').ReactiveElement} HostElement
 * @extends {ManagedController<HostElement>}
 */
export class Plugin extends ManagedController {
	/** @protected */
	static get ScopedManagedControllerConnectEvent() {
		return PluginConnectEvent;
	}

	/**
	 * @param {HostElement} host
	 * @param {PluginOptions<HostElement>} options
	 */
	constructor(host, options) {
		super(host);

		/**
		 * @readonly
		 * @type {PluginOptions<HostElement>}
		 */
		this.options = options;
	}
}
