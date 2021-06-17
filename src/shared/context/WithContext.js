/** @typedef {import('./types').ContextHostConstructor} ContextHostConstructor */

import { isFunction } from '../../utils/unit';
import { isDerviedContext } from './context';

const FINALIZED = Symbol();

/**
 * @template {ContextHostConstructor} T
 * @param {T} Base
 * @returns {import('./types').ContextInitializer & T}
 */
export function WithContext(Base) {
	return class WithContextMixin extends Base {
		/** @returns {import('./types').ContextConsumerDeclarations} */
		static get contextConsumers() {
			return {};
		}

		/** @returns {import('./types').ContextConsumerDeclarations} */
		static get contextProviders() {
			return {};
		}

		// -------------------------------------------------------------------------------------------
		// Context
		// -------------------------------------------------------------------------------------------

		static get observedAttributes() {
			// @ts-ignore
			const attributes = super.observedAttributes;
			// Piggy backing on this to ensure we're finalized.
			this.finalizeContext();
			return attributes;
		}

		/**
		 * @protected
		 * @returns {void}
		 */
		static finalizeContext() {
			// eslint-disable-next-line no-prototype-builtins
			if (this.hasOwnProperty(FINALIZED)) return;
			this[FINALIZED] = true;

			const superCtor = Object.getPrototypeOf(this);
			if (isFunction(superCtor?.finalizeContext)) {
				superCtor.finalizeContext();
			}

			this.defineContextProviders();
			this.defineContextConsumers();
		}

		/**
		 * @protected
		 * @returns {void}
		 */
		static defineContextProviders() {
			const contextProviders = this.contextProviders ?? {};

			Object.keys(contextProviders).forEach((contextPropertyName) => {
				/** @type {import('./types').Context<any>} */
				const context = contextProviders[contextPropertyName];
				this.defineContextProvider(context, contextPropertyName);
			});
		}

		/**
		 * @param {import('./types').Context<any>} context
		 * @param {string} name
		 */
		static defineContextProvider(context, name) {
			// eslint-disable-next-line no-prototype-builtins
			if (this.prototype.hasOwnProperty(name)) return;

			// Might be called by decorator.
			this.finalizeContext();

			/** @type {import('./types').ContextProvider<any>} */
			let provider;

			/** @type {any} */ (this).addInitializer((element) => {
				provider = context.provide(element);
			});

			const hasUserDefined = new WeakSet();

			Object.defineProperty(this.prototype, name, {
				enumerable: true,
				configurable: false,
				get() {
					return provider.value;
				},
				set: isDerviedContext(context)
					? /** @type {(this: any) => void} */ function () {
							if (!hasUserDefined.has(this)) {
								hasUserDefined.add(this);
								return;
							}

							throw Error(
								`Context provider property [${name}] is derived, thus it's readonly.`
							);
					  }
					: function (newValue) {
							provider.value = newValue;
					  }
			});
		}

		/**
		 * @protected
		 * @returns {void}
		 */
		static defineContextConsumers() {
			const contextConsumers = this.contextConsumers ?? {};

			Object.keys(contextConsumers).forEach((contextPropertyName) => {
				/** @type {import('./types').Context<any>} */
				const context = contextConsumers[contextPropertyName];
				this.defineContextConsumer(context, contextPropertyName);
			});
		}

		/**
		 * @param {import('./types').Context<any>} context
		 * @param {string} name
		 */
		static defineContextConsumer(context, name) {
			// eslint-disable-next-line no-prototype-builtins
			if (this.prototype.hasOwnProperty(name)) return;

			// Might be called by decorator.
			this.finalizeContext();

			/** @type {import('./types').ContextConsumer<any>} */
			let consumer;

			/** @type {any} */ (this).addInitializer((element) => {
				let oldValue = context.initialValue;
				consumer = context.consume(element, {
					onUpdate: (newValue) => {
						element.requestUpdate(name, oldValue);
						oldValue = newValue;
					}
				});
			});

			const hasUserDefined = new WeakSet();

			Object.defineProperty(this.prototype, name, {
				enumerable: true,
				configurable: false,
				get() {
					return consumer.value;
				},
				set() {
					if (!hasUserDefined.has(this)) {
						hasUserDefined.add(this);
						return;
					}

					throw Error(`Context consumer property [${name}] is readonly.`);
				}
			});
		}
	};
}
