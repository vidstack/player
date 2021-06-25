import { ElementManager } from '../../shared/elements/index.js';
import { bridgeElements } from '../../utils/dom.js';
import { PluginConnectEvent } from './events.js';
import { PluginElement } from './PluginElement';

/**
 * @typedef {import('../../shared/elements').ElementManagerHost & Element} PluginManagerHost
 */

/**
 * @extends {ElementManager<PluginElement>}
 */
export class PluginManager extends ElementManager {
	/** @protected */
	static get ScopedManagedElementConnectEvent() {
		return PluginConnectEvent;
	}

	/**
	 * @protected
	 * @type {Map<PluginElement, () => void>}
	 */
	pluginDisposal = new Map();

	/**
	 * @param {PluginManagerHost} host
	 */
	constructor(host) {
		super(host);

		/**
		 * @protected
		 * @readonly
		 * @type {PluginManagerHost}
		 */
		this.host = host;
	}

	hostDisconnected() {
		super.hostDisconnected();
		this.pluginDisposal.forEach((destroyBridge) => destroyBridge());
	}

	/**
	 * @param {PluginElement} plugin
	 */
	handleManagedElementAdded(plugin) {
		let ctor = /** @type {import('./PluginElement').PluginConstructor} */ (
			plugin.constructor
		);

		/** @type {Set<string>} */
		const attributes = new Set();
		/** @type {Set<string>} */
		const events = new Set();
		/** @type {Set<string>} */
		const properties = new Set();

		// Walk proto chain and collect attributes, events and properties to bridge.
		while (ctor) {
			ctor.pluginAttributes?.forEach((attr) => attributes.add(attr));
			ctor.pluginEvents?.forEach((event) => events.add(event));
			ctor.pluginProperties?.forEach((prop) => properties.add(prop));
			ctor = Object.getPrototypeOf(ctor);
		}

		const destroyBridge = bridgeElements(this.host, plugin, {
			attributes,
			events,
			properties: /** @type {Set<keyof PluginElement>} */ (properties)
		});

		this.pluginDisposal.set(plugin, destroyBridge);
	}

	/**
	 * @param {PluginElement} plugin
	 */
	handleManagedElementRemoved(plugin) {
		const destroyBridge = this.pluginDisposal.get(plugin);
		destroyBridge?.();
	}
}
