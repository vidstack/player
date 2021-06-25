import { VdsCustomEvent } from '../../events/index.js';
import { ManagedElement } from './ManagedElement.js';

/**
 * @template {ManagedElement} Element
 * @typedef {{
 *  element: Element;
 *  onDisconnect: (callback: () => void) => void;
 * }} ManagedElementConnectedEventDetail
 */

/**
 * @typedef {{
 *  [ManagedElementConnectEvent.TYPE]: ManagedElementConnectEvent<any>
 * }} ElementManagerEvents
 */

/**
 * @template {ManagedElement} Element
 * @extends VdsCustomEvent<ManagedElementConnectedEventDetail<Element>>
 */
export class ManagedElementConnectEvent extends VdsCustomEvent {
	/** @readonly */
	static TYPE = 'vds-managed-element-connected';

	/**
	 * @param {import('../../events').VdsEventInit<ManagedElementConnectedEventDetail<Element>>} eventInit
	 */
	constructor(eventInit) {
		super(ManagedElementConnectEvent.TYPE, eventInit);
	}
}
