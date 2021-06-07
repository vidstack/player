/**
 * @template DetailType
 * @extends CustomEvent<DetailType>
 */
export class VdsCustomEvent extends CustomEvent {
	/**
	 * @type {string}
	 * @readonly
	 */
	static TYPE;

	/**
	 * @type {Event | undefined}
	 * @readonly
	 */
	originalEvent;

	/**
	 * Walks up the event chain (following each `originalEvent`) and returns the origin event
	 * that started the chain.
	 *
	 * @returns {Event | undefined}
	 */
	get originEvent() {
		let originalEvent = /** @type {VdsCustomEvent<unknown>} */ (this
			.originalEvent);

		while (originalEvent && originalEvent.originalEvent) {
			originalEvent = /** @type {VdsCustomEvent<unknown>} */ (originalEvent.originalEvent);
		}

		return originalEvent;
	}

	/**
	 * Walks up the event chain (following each `originalEvent`) and determines whether the initial
	 * event was triggered by the end user (ie: check whether `isTrusted` on the `originEvent` `true`).
	 *
	 * @returns {boolean}
	 */
	get isOriginTrusted() {
		return this.originEvent?.isTrusted ?? false;
	}

	/**
	 * @param {string} typeArg
	 * @param {import('./types').VdsEventInit<DetailType>} [eventInit]
	 */
	constructor(typeArg, eventInit) {
		const { originalEvent, ...init } = eventInit ?? {};
		super(typeArg, init);
		this.originalEvent = originalEvent;
	}
}

/**
 * @param {HTMLElement} el
 * @param {Event} originalEvent
 * @returns {void}
 */
export function redispatchNativeEvent(el, originalEvent) {
	const event = new VdsCustomEvent(originalEvent.type, {
		originalEvent,
		bubbles: originalEvent.bubbles,
		cancelable: originalEvent.cancelable,
		composed: originalEvent.composed
	});

	const constructor = event.constructor;
	/** @type {any} */ (constructor).TYPE = originalEvent.type;

	el.dispatchEvent(event);
}

/**
 * A disposal bin used to add cleanup callbacks that can be called when required.
 */
export class DisposalBin {
	/**
	 * @protected
	 * @type {import('../types/utils').Callback<void>[]}
	 */
	disposal = this.disposal ?? [];

	/**
	 * @param {import('../types/utils').Callback<void>} callback
	 * @returns {void}
	 */
	add(callback) {
		this.disposal.push(callback);
	}

	/**
	 * @returns {void}
	 */
	empty() {
		this.disposal.forEach((fn) => fn());
		this.disposal = [];
	}
}

/**
 * Listens to an event on the given `target` and returns a cleanup function to stop listening.
 *
 * @param {EventTarget} target - The target to listen for the events on.
 * @param {string} type - The name of the event to listen to.
 * @param {EventListenerOrEventListenerObject} listener - The function to be called when the event is fired.
 * @param {boolean | AddEventListenerOptions | EventListenerOptions} [options] - Configures the event listener.
 * @returns {import('../types/utils').Unsubscribe}
 *
 * @example
 * ```tscript
 * const dispose = listen(window, 'resize', () => {});
 *
 * // Stop listening.
 * dispose();
 * ```
 */
export function listen(target, type, listener, options) {
	target.addEventListener(type, listener, options);
	return () => {
		target.removeEventListener(type, listener, options);
	};
}

/**
 * @param {HTMLElement} host
 * @param {import('./types').EventHandlerRecord} record
 * @param {DisposalBin} disposal
 */
export function bindEventListeners(host, record, disposal) {
	Object.keys(record).forEach((eventType) => {
		const dispose = listen(host, eventType, record[eventType].bind(host));
		disposal.add(dispose);
	});
}
