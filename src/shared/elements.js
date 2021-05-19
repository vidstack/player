import { LitElement } from 'lit-element';

/** @typedef {import('../types/elements').ElementController} ElementController */
/** @typedef {import('../types/elements').ElementControllerHost} ElementControllerHost */

/**
 * @implements {ElementControllerHost}
 */
export class VdsElement extends LitElement {
	/**
	 * @private
	 * @readonly
	 * @type {ElementController[]}
	 */
	__controllers = [];

	connectedCallback() {
		super.connectedCallback();
		this.__controllers?.forEach((c) => c.hostConnected?.());
	}

	update(changedProperties) {
		super.update(changedProperties);
		this.__controllers?.forEach((c) => c.hostUpdate?.());
	}

	updated(changedProperties) {
		super.updated(changedProperties);
		this.__controllers?.forEach((c) => c.hostUpdated?.());
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.__controllers?.forEach((c) => c.hostDisconnected?.());
	}

	/**
	 * Adds a controller to the host, which sets up the controller's lifecycle
	 * methods to be called with the host's lifecycle.
	 *
	 * @public
	 * @param {ElementController} controller
	 * @returns {void}
	 */
	addController(controller) {
		this.__controllers.push(controller);

		// If a controller is added after the element has been connected,
		// call hostConnected. Note, re-using existence of `renderRoot` here
		// (which is set in connectedCallback) to avoid the need to track a
		// first connected state.
		if (this.renderRoot !== undefined && this.isConnected) {
			controller.hostConnected?.();
		}
	}

	/**
	 * Removes a controller from the host.
	 *
	 * @public
	 * @param {ElementController} controller
	 * @returns {void}
	 */
	removeController(controller) {
		// Note, if the indexOf is -1, the >>> will flip the sign which makes the
		// splice do nothing.
		this.__controllers?.splice(this.__controllers.indexOf(controller) >>> 0, 1);
	}
}
