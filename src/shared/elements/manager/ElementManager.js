import { DisposalBin, listen } from '../../events/index.js';
import { ManagedElementConnectEvent } from './events.js';
import { ManagedElement } from './ManagedElement.js';

/**
 * @typedef {import('lit').ReactiveController} CanManageElements
 */

/**
 * @typedef {import('lit').ReactiveControllerHost & EventTarget} ElementManagerHost
 */

/**
 * @template {ManagedElement} Element
 * @implements {CanManageElements}
 */
export class ElementManager {
	static ScopedManagedElementConnectedEvent = ManagedElementConnectEvent;

	static createScopedManager() {
		// Privately declared to uniquely identify elements with a specific manager.
		class ScopedManagerElementConnectEvent extends ManagedElementConnectEvent {}
		class ScopedElementManager extends ElementManager {}
		class ScopedManagedElement extends ManagedElement {}

		ScopedElementManager.ScopedManagedElementConnectEvent =
			ScopedManagerElementConnectEvent;

		ScopedManagedElement.ScopedManagedElementConnectEvent =
			ScopedManagerElementConnectEvent;

		return {
			ElementManager: ScopedElementManager,
			ManagedElement: ScopedManagedElement
		};
	}

	/**
	 * @protected
	 * @readonly
	 * @type {Omit<Set<Element>, 'clear'>}
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
				ManagedElementConnectEvent.TYPE,
				this.handleElementConnected.bind(this)
			)
		);
	}

	hostDisconnected() {
		this.disconnectDisposal.empty();
		this.removeAllManagedElements();
	}

	/**
	 * @param {ManagedElementConnectEvent<Element>} event
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
	 * @param {ManagedElementConnectEvent<Element>} event
	 * @returns {boolean}
	 */
	validateConnectedEvent(event) {
		const ctor = /** @type {typeof ElementManager} */ (this.constructor);
		const ScopedEvent = ctor.ScopedManagedElementConnectedEvent;
		return event instanceof ScopedEvent;
	}

	/**
	 * @param {Element} element
	 * @returns {void}
	 */
	addManagedElement(element) {
		if (this.managedElements.has(element)) return;
		this.managedElements.add(element);
		this.handleManagedElementAdded(element);
	}

	/**
	 * @param {Element} element
	 * @returns {void}
	 */
	removeManagedElement(element) {
		if (!this.managedElements.has(element)) return;
		this.managedElements.delete(element);
		this.handleManagedElementRemoved(element);
	}

	/**
	 * @param {Element} element
	 * @returns {void}
	 */
	handleManagedElementAdded(element) {
		// no-op
	}

	/**
	 * @param {Element} element
	 * @returns {void}
	 */
	handleManagedElementRemoved(element) {
		// no-op
	}

	removeAllManagedElements() {
		this.managedElements.forEach(this.removeManagedElement.bind(this));
	}
}
