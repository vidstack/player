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
		let originalEvent = /** @type {VdsCustomEvent<unknown>} */ (
			this.originalEvent
		);

		while (originalEvent && originalEvent.originalEvent) {
			originalEvent = /** @type {VdsCustomEvent<unknown>} */ (
				originalEvent.originalEvent
			);
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
 * @param {EventTarget} target
 * @param {Event | CustomEvent | VdsCustomEvent} event
 * @returns {void}
 */
export function redispatchEvent(target, event) {
	const newEvent = new VdsCustomEvent(event.type, {
		originalEvent: /** @type {VdsCustomEvent} */ (event).originalEvent ?? event,
		detail: /** @type {CustomEvent} */ (event).detail,
		bubbles: event.bubbles,
		cancelable: event.cancelable,
		composed: event.composed
	});

	target.dispatchEvent(newEvent);
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
 * @template {Event} ListenedEvent
 * @param {EventTarget} target - The target to listen for the events on.
 * @param {string} type - The name of the event to listen to.
 * @param {(event: ListenedEvent) => void} listener - The function to be called when the event is fired.
 * @param {boolean | AddEventListenerOptions | EventListenerOptions} [options] - Configures the event listener.
 * @returns {import('../types/utils').Unsubscribe}
 *
 * @example
 * ```ts
 * const disposeListener = listen(window, 'resize', () => {});
 *
 * // Stop listening.
 * disposeListener();
 * ```
 */
export function listen(target, type, listener, options) {
	target.addEventListener(
		type,
		/** @type {EventListener} */ (listener),
		options
	);

	return () => {
		target.removeEventListener(
			type,
			/** @type {EventListener} */ (listener),
			options
		);
	};
}

/**
 * Listens to an event on the given `target` and returns a cleanup function to stop listening.
 *
 * @template {keyof GlobalEventHandlersEventMap} EventType
 * @param {EventTarget} target - The target to listen for the events on.
 * @param {EventType} type - The name of the event to listen to.
 * @param {(event: GlobalEventHandlersEventMap[EventType]) => void} listener - The function to be called when the event is fired.
 * @param {boolean | AddEventListenerOptions | EventListenerOptions} [options] - Configures the event listener.
 * @returns {import('../types/utils').Unsubscribe}
 */
export function listenGlobalEvent(target, type, listener, options) {
	target.addEventListener(type, /** @type {any} */ (listener), options);
	return () => {
		target.removeEventListener(type, /** @type {any} */ (listener), options);
	};
}

/**
 * @param {HTMLElement} host
 * @param {import('./types').EventHandlerRecord} record
 * @param {DisposalBin} disposal
 * @param {{ target?: EventTarget }} [options]
 */
export function bindEventListeners(host, record, disposal, options = {}) {
	Object.keys(record).forEach((eventType) => {
		const dispose = listen(
			options.target ?? host,
			eventType,
			record[eventType].bind(host)
		);
		disposal.add(dispose);
	});
}
