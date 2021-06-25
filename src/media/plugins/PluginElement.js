import { ManagedElement } from '../../shared/elements/index.js';
import { PluginConnectEvent } from './events.js';

/**
 * @typedef {ManagedElement} Plugin
 */

/**
 * @typedef {{
 *  new (): Plugin;
 *  readonly pluginAttributes: string[];
 *  readonly pluginProperties: string[];
 *  readonly pluginEvents: string[];
 * }} PluginConstructor
 */

/**
 * @implements {Plugin}
 */
export class PluginElement extends ManagedElement {
	/** @protected */
	static get ScopedManagedElementConnectEvent() {
		return PluginConnectEvent;
	}

	/** @type {PluginConstructor['pluginAttributes']} */
	static get pluginAttributes() {
		return [];
	}

	/** @type {PluginConstructor['pluginEvents']} */
	static get pluginEvents() {
		return [];
	}

	/** @type {PluginConstructor['pluginProperties']} */
	static get pluginProperties() {
		return [];
	}
}
