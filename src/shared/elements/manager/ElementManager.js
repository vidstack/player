import { DisposalBin, listen, VdsCustomEvent } from '../../events/events.js';

// -------------------------------------------------------------------------------------------
// Events
// -------------------------------------------------------------------------------------------

/**
 * @template {Element} ManagedElement
 * @typedef {{
 *  element: ManagedElement;
 *  onDisconnect: (callback: () => void) => void;
 * }} ManagedElementConnectedEventDetail
 */

/**
 * @typedef {{
 *  [ManagedElementConnectedEvent.TYPE]: ManagedElementConnectedEvent<any>
 * }} ElementManagerEvents
 */

/**
 * @template {Element} ManagedElement
 * @extends VdsCustomEvent<ManagedElementConnectedEventDetail<ManagedElement>>
 */
export class ManagedElementConnectedEvent extends VdsCustomEvent {
	/** @readonly */
	static TYPE = 'vds-managed-element-connected';

	/**
	 * @param {import('../../events').VdsEventInit<ManagedElementConnectedEventDetail<ManagedElement>>} eventInit
	 */
	constructor(eventInit) {
		super(ManagedElementConnectedEvent.TYPE, eventInit);
	}
}

// -------------------------------------------------------------------------------------------
// ElementManager
// -------------------------------------------------------------------------------------------

/**
 * @typedef {import('lit').ReactiveController} CanManageElements
 */

/**
 * @typedef {import('lit').ReactiveControllerHost & EventTarget} ElementManagerHost
 */

/**
 * @template {Element} ManagedElement
 * @implements {CanManageElements}
 */
export class ElementManager {
	/**
	 * @protected
	 * @readonly
	 * @type {Omit<Set<ManagedElement>, 'clear'>}
	 */
	managedElements = new Set();

	/**
	 * @protected
	 * @readonly
	 */
	disconnectDisposal = new DisposalBin();

	/**
	 * @param {ElementManagerHost} host
	 */
	constructor(host) {
		host.addController(this);

		/**
		 * @protected
		 * @readonly
		 * @type {ElementManagerHost}
		 */
		this.host = host;
	}

	hostConnected() {
		this.disconnectDisposal.add(
			listen(
				this.host,
				ManagedElementConnectedEvent.TYPE,
				this.handleElementConnected.bind(this)
			)
		);
	}

	hostDisconnected() {
		this.disconnectDisposal.empty();
		this.removeAllManagedElements();
	}

	/**
	 * @param {ManagedElementConnectedEvent<ManagedElement>} event
	 * @returns {void}
	 */
	handleElementConnected(event) {
		if (!this.validateConnectedEvent(event)) return;

		const { element, onDisconnect } = event.detail;

		this.addManagedElement(element);

		onDisconnect(() => {
			this.removeManagedElement(element);
		});
	}

	/**
	 * @param {ManagedElementConnectedEvent<ManagedElement>} event
	 * @returns {boolean}
	 */
	validateConnectedEvent(event) {
		return true;
	}

	/**
	 * @param {ManagedElement} element
	 * @returns {void}
	 */
	addManagedElement(element) {
		if (this.managedElements.has(element)) return;
		this.managedElements.add(element);
		this.handleManagedElementAdded(element);
	}

	/**
	 * @param {ManagedElement} element
	 * @returns {void}
	 */
	removeManagedElement(element) {
		if (!this.managedElements.has(element)) return;
		this.managedElements.delete(element);
		this.handleManagedElementRemoved(element);
	}

	/**
	 * @param {ManagedElement} element
	 * @returns {void}
	 */
	handleManagedElementAdded(element) {
		// no-op
	}

	/**
	 * @param {ManagedElement} element
	 * @returns {void}
	 */
	handleManagedElementRemoved(element) {
		// no-op
	}

	removeAllManagedElements() {
		this.managedElements.forEach(this.removeManagedElement.bind(this));
	}
}
