import { VdsCustomEvent } from '../../shared/events';
import { isUndefined } from '../../utils/unit';

/**
 * Mixes in the ability to dispatch events and for consumers to add event listeners to be notified.
 *
 * @template EventRecordType
 * @param {import('../../types/misc').Constructor} Base
 */
export function WithEvents(Base) {
	return class WithEvents extends Base {
		/** @type {Map<keyof EventRecordType, import('../../types/misc').Callback<any>[]>} */
		eventListeners = new Map();

		/**
		 * @template {keyof EventRecordType} EventType
		 * @param {EventType} type
		 * @param {import('../../types/misc').Callback<EventRecordType[EventType]>} listener
		 * @returns {import('../../types/misc').Unsubscribe}
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
		 * @param {import('../../types/misc').Callback<EventRecordType[EventType]>} listener
		 * @returns {void}
		 */
		removeEventListener(type, listener) {
			let callbacks = this.eventListeners.get(type);
			if (!isUndefined(callbacks)) {
				callbacks = callbacks.filter((cb) => cb !== listener);
			}
		}

		// TODO: clean this event param up.
		/**
		 * @template {keyof EventRecordType} EventType
		 * @param {EventType} typeArg
		 * @param {import('../../types/events').VdsEventInit<import('../../types/events').ExtractEventDetailType<EventRecordType[EventType]> >} eventInit
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
	};
}
