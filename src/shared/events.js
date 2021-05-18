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
	 * @param {import('../types/events').VdsEventInit<DetailType>} [eventInit]
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
	 * @type {import('../types/misc').Callback<void>[]}
	 * @private
	 */
	dispose;

	/**
	 * @param {import('../types/misc').Callback<void>[]} [dispose]
	 */
	constructor(dispose) {
		this.dispose = dispose ?? [];
	}

	/**
	 * @param {import('../types/misc').Callback<void>} callback
	 * @returns {void}
	 */
	add(callback) {
		this.dispose.push(callback);
	}

	/**
	 * @returns {void}
	 */
	empty() {
		this.dispose.forEach((fn) => fn());
		this.dispose = [];
	}
}

/**
 * Listens to an event on the given `target` and returns a cleanup function to stop listening.
 *
 * @param {EventTarget} target - The target to listen for the events on.
 * @param {string} type - The name of the event to listen to.
 * @param {EventListenerOrEventListenerObject} listener - The function to be called when the event is fired.
 * @param {boolean | AddEventListenerOptions | EventListenerOptions} [options] - Configures the event listener.
 * @returns {import('../types/misc').Unsubscribe}
 *
 * @example
 * ```typescript
 * const off = listen(window, 'resize', () => {});
 *
 * // Stop listening.
 * off();
 * ```
 */
export function listen(target, type, listener, options) {
	target.addEventListener(type, listener, options);
	return () => {
		target.removeEventListener(type, listener, options);
	};
}
