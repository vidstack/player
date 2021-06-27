import { DisposalBin } from '../../events/index.js';
import { ManagedControllerConnectEvent } from './events.js';

/**
 * @typedef {import('lit').ReactiveController} ManageableController
 */

/**
 * @template {import('lit').ReactiveElement} HostElement
 * @implements {ManageableController}
 */
export class ManagedController {
	/**
	 * @protected
	 */
	static get ScopedManagedControllerConnectEvent() {
		return ManagedControllerConnectEvent;
	}

	/**
	 * @protected
	 * @readonly
	 */
	disconnectDisposal = new DisposalBin();

	/**
	 * @param {HostElement} host
	 */
	constructor(host) {
		host.addController(this);

		/**
		 * @readonly
		 * @type {HostElement}
		 */
		this.host = host;
	}

	hostConnected() {
		this.connectToManager();
	}

	hostDisconnected() {
		this.disconnectDisposal.empty();
	}

	/**
	 * @protected
	 * @returns {void}
	 */
	connectToManager() {
		const ctor = /** @type {typeof ManagedController} */ (this.constructor);

		this.host.dispatchEvent(
			new ctor.ScopedManagedControllerConnectEvent({
				detail: {
					controller: this,
					// Pipe callbacks into the disconnect disposal bin.
					onDisconnect: (callback) => {
						this.disconnectDisposal.add(callback);
					}
				}
			})
		);
	}
}
