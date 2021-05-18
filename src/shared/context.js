import { UpdatingElement } from 'lit-element';

import { noop, notEqual } from '../utils/unit';

/**
 * @typedef {{
 *   onConnect(): void;
 *   onUpdate(newValue: any): void;
 *   onDisconnect(callback: () => void): void;
 * }} ContextConsumer
 */

/**
 * @extends CustomEvent<ContextConsumer>
 */
class ConsumerConnectEvent extends CustomEvent {
	static TYPE = 'vds-context-connect';

	/**
	 * @param {Event} event
	 * @returns {event is ConsumerConnectEvent}
	 */
	static validate(event) {
		return event instanceof this;
	}

	/**
	 * @param {ContextConsumer} detail
	 */
	constructor(detail) {
		super(ConsumerConnectEvent.TYPE, {
			bubbles: true,
			composed: true,
			detail
		});
	}
}

/**
 * @template T
 * @param {T} initialValue
 * @returns {import('../types/context').Context<T>}
 */
export function createContext(initialValue) {
	// Privately declared event to safely pair context providers and consumers.
	class ContextConsumerConnectEvent extends ConsumerConnectEvent {}

	/** @type {import('../types/context').Context<T>['provide']} */
	function provide(host) {
		let currentValue = initialValue;

		/**
		 * @type {Set<ContextConsumer>}
		 */
		let consumers = new Set();

		/**
		 * @param {ContextConsumerConnectEvent} event
		 */
		function onConsumerConnect(event) {
			// Validate event was dispatched by a pairable consumer.
			if (!ContextConsumerConnectEvent.validate(event)) return;

			// Stop propagation of the event to prevent pairing with similar context providers.
			event.stopImmediatePropagation();

			const consumer = event.detail;

			consumer.onConnect();

			consumer.onUpdate(currentValue);

			consumer.onDisconnect(() => {
				consumers.delete(consumer);
			});

			consumers.add(consumer);
		}

		function updateConsumers(newValue) {
			consumers.forEach((consumer) => {
				consumer.onUpdate(newValue);
			});
		}

		const connectedCallback = host.connectedCallback;
		host.connectedCallback = function () {
			host.addEventListener(ConsumerConnectEvent.TYPE, onConsumerConnect);
			connectedCallback?.call(this);
		};

		const disconnectedCallback = host.disconnectedCallback;
		host.disconnectedCallback = function () {
			host.removeEventListener(ConsumerConnectEvent.TYPE, onConsumerConnect);
			currentValue = initialValue;
			updateConsumers(initialValue);
			consumers.clear();
			disconnectedCallback?.call(this);
		};

		return {
			get value() {
				return currentValue;
			},
			set value(newValue) {
				if (notEqual(newValue, currentValue)) {
					updateConsumers(newValue);
				}
			}
		};
	}

	/** @type {import('../types/context').Context<T>['consume']} */
	function consume(host, options) {
		let currentValue = initialValue;
		let disconnectFromProviderCallback = noop;

		function onConnect() {
			options?.onConnect?.();
		}

		function onUpdate(newValue) {
			currentValue = newValue;
			host.requestUpdate();
			options?.onUpdate?.(newValue);
		}

		function onDisconnect(callback) {
			disconnectFromProviderCallback = callback;
		}

		const connectedCallback = host.connectedCallback;
		host.connectedCallback = function () {
			this.dispatchEvent(
				new ContextConsumerConnectEvent({
					onConnect,
					onUpdate,
					onDisconnect
				})
			);

			connectedCallback?.call(this);
		};

		const disconnectedCallback = host.disconnectedCallback;
		host.disconnectedCallback = function () {
			disconnectFromProviderCallback();
			disconnectFromProviderCallback = noop;
			currentValue = initialValue;
			options?.onUpdate?.(initialValue);
			disconnectedCallback?.call(this);
			options?.onDisconnect?.();
		};

		return {
			get value() {
				return currentValue;
			}
		};
	}

	return {
		initialValue,
		provide,
		consume
	};
}

/**
 * Derives a context from others that was created with `createContext`. This assumes the
 * given `contexts` are ALL provided by the same host element.
 *
 * @template {readonly import('../types/context').Context<unknown>[]} T
 * @template R
 * @param {T} contexts - The contexts to derive values from as it updates.
 * @param {(...values: import('../types/context').ExtractContextArray<T>) => R} derivation - Takes the original context values and outputs the derived value.
 * @returns {import('../types/context').DerivedContext<R>}
 */
export function derivedContext(contexts, derivation) {
	const initialValue = derivation(
		.../** @type {any} */ (contexts.map((c) => c.initialValue))
	);

	const derivedContext = createContext(initialValue);

	return {
		initialValue,
		consume: derivedContext.consume,
		provide(host) {
			let ready = false;

			const values = [];
			const provider = derivedContext.provide(host);

			contexts.forEach((context, i) => {
				context.consume(host, {
					onConnect() {
						ready = values.length === contexts.length;
					},

					onUpdate(newValue) {
						values[i] = newValue;

						if (ready) {
							provider.value = derivation(.../** @type {any} */ (values));
						}
					},

					onDisconnect() {
						ready = false;
						values.splice(i, 1);
					}
				});
			});

			return {
				get value() {
					return provider.value;
				}
			};
		}
	};
}

/**
 * Takes in a context record which is essentially an object containing 0 or more contexts, and sets
 * the given `host` element as the provider of all the contexts within the given record.
 *
 * @template {import('../types/context').ContextRecord<unknown>} ContextRecordType
 * @param {UpdatingElement} host
 * @param {ContextRecordType} contextRecord
 * @returns {{ [P in keyof ContextRecordType]: ReturnType<ContextRecordType[P]['provide']> }}
 */
export function contextRecord(host, contextRecord) {
	/** @type {any} */
	const providers = {};

	Object.keys(contextRecord).forEach((contextKey) => {
		const context = contextRecord[contextKey];
		providers[contextKey] = context.provide(host);
	});

	return providers;
}
