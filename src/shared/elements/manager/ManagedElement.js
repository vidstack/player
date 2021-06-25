import { VdsElement } from '../VdsElement.js';
import { ManagedElementConnectEvent } from './events.js';

export class ManagedElement extends VdsElement {
	/**
	 * @protected
	 */
	static get ScopedManagedElementConnectEvent() {
		return ManagedElementConnectEvent;
	}

	connectedCallback() {
		super.connectedCallback();
		this.connectToElementManager();
	}

	/**
	 * @private
	 * @returns {void}
	 */
	connectToElementManager() {
		this.dispatchEvent(
			new ManagedElement.ScopedManagedElementConnectEvent({
				detail: {
					element: this,
					// Pipe callbacks into the disconnect disposal bin.
					onDisconnect: (callback) => {
						this.disconnectDisposal.add(callback);
					}
				}
			})
		);
	}
}
