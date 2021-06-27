import { bridgeElements } from '../../../utils/dom.js';
import { getAllObjectPropertyNames } from '../../../utils/object.js';
import { ControllerManager } from '../../controller/index.js';
import { PluginConnectEvent } from './events.js';
import { Plugin } from './Plugin.js';

/**
 * @typedef {import('lit').ReactiveElement} PluginManagerHost
 */

/**
 * @template {import('lit').ReactiveElement} HostElement
 * @extends {ControllerManager<HostElement>}
 */
export class PluginManager extends ControllerManager {
	/** @protected */
	static get ScopedManagedControllerConnectEvent() {
		return PluginConnectEvent;
	}

	/**
	 * @protected
	 * @type {Map<Plugin<HostElement>, () => void>}
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

		/**
		 * @protected
		 * @type {Set<string>}
		 */
		this.blacklistAttributeNames = new Set(
			/** @type {any} **/ (host.constructor).observedAttributes
		);

		/**
		 * @protected
		 * @type {Set<string | symbol | number>}
		 */
		this.blacklistPropertyNames = getAllObjectPropertyNames(host);
	}

	hostDisconnected() {
		super.hostDisconnected();
		this.pluginDisposal.forEach((destroyBridge) => destroyBridge());
	}

	/**
	 * @param {Plugin<HostElement>} plugin
	 */
	handleManagedControllerAdded(plugin) {
		super.handleManagedControllerAdded(plugin);

		const options = plugin.options;

		const managerHost = this.host;
		const pluginHost = plugin.host;

		const safeBridgedAttributeNames = new Set();
		const safeBridgedPropertyNames = new Set();

		// Ignore bridged attributes that exist on the manager.
		for (const attrName of plugin.options.bridgedAttributes ?? []) {
			if (!this.blacklistAttributeNames.has(attrName)) {
				safeBridgedAttributeNames.add(attrName);
				this.blacklistAttributeNames.add(attrName);
			}
		}

		// Ignore bridged properties that exist on the manager.
		for (const propName of plugin.options.bridgedProperties ?? []) {
			if (!this.blacklistPropertyNames.has(propName)) {
				safeBridgedPropertyNames.add(propName);
				this.blacklistPropertyNames.add(propName);
			}
		}

		const destroyBridge = bridgeElements(managerHost, pluginHost, {
			attributes: safeBridgedAttributeNames,
			events: new Set(options.bridgedEvents),
			properties: safeBridgedPropertyNames
		});

		this.pluginDisposal.set(plugin, destroyBridge);
	}

	/**
	 * @param {Plugin<HostElement>} plugin
	 */
	handleManagedControllerRemoved(plugin) {
		super.handleManagedControllerRemoved(plugin);
		const destroyBridge = this.pluginDisposal.get(plugin);
		destroyBridge?.();
	}
}
