import { VdsCustomEvent } from '../../shared/events';
import { isUndefined } from '../../utils/unit';

/**
 * @template EventRecordType
 */
export class EventDispatcher {
	/** @type {Map<keyof EventRecordType, import('../types/utils').Callback<any>[]>} */
	eventListeners = new Map();

	/**
	 * @template {keyof EventRecordType} EventType
	 * @param {EventType} type
	 * @param {import('../types/utils').Callback<EventRecordType[EventType]>} listener
	 * @returns {import('../types/utils').Unsubscribe}
	 */
	addEventListener(type, listener) {
		const callbacks = this.eventListeners.get(type) ?? [];
		callbacks.push(listener);
		this.eventListeners.set(type, callbacks);
		return () => {
			this.removeEventListener(type, listener);
		};
	}

	/**
	 * @template {keyof EventRecordType} EventType
	 * @param {EventType} type
	 * @param {import('../types/utils').Callback<EventRecordType[EventType]>} listener
	 * @returns {void}
	 */
	removeEventListener(type, listener) {
		let callbacks = this.eventListeners.get(type);
		if (!isUndefined(callbacks)) {
			callbacks = callbacks.filter((cb) => cb !== listener);
		}
	}

	/**
	 * @template {keyof EventRecordType} EventType
	 * @param {EventType} typeArg
	 * @param {import('./types').ExtractVdsEventInit<EventRecordType[EventType]>} eventInit
	 * @returns {void}
	 */
	dispatchEvent(typeArg, eventInit) {
		const event = new VdsCustomEvent(
			/** @type {string} */ (typeArg),
			eventInit
		);

		this.eventListeners.get(typeArg)?.forEach((callback) => callback(event));
	}

	/**
	 * @returns {void}
	 */
	destroy() {
		this.eventListeners.clear();
	}
}
