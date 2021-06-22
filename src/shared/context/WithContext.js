/** @typedef {import('./types').ContextHostConstructor} ContextHostConstructor */

import { isFunction } from '../../utils/unit.js';
import { isDerviedContext } from './context.js';

const FINALIZED = Symbol('finalized');
const PROVIDERS = Symbol('providers');
const CONSUMERS = Symbol('consumers');

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
				/** @type {import('./types').ContextProviderDeclaration<any>} */
				const declaration = contextProviders[contextPropertyName];
				const context =
					'context' in declaration ? declaration.context : declaration;
				const options = 'context' in declaration ? declaration : {};
				this.defineContextProvider(contextPropertyName, context, options);
			});
		}

		/**
		 * @template {any} T
		 * @param {string} name
		 * @param {import('./types').Context<T>} context
		 * @param {import('./types').ContextProvideOptions<T>} [options]
		 */
		static defineContextProvider(name, context, options = {}) {
			// eslint-disable-next-line no-prototype-builtins
			if (this.prototype.hasOwnProperty(name)) return;

			// Might be called by decorator.
			this.finalizeContext();

			function defineProvider(element) {
				const provider = context.provide(element, options);

				if (!element[PROVIDERS]) {
					element[PROVIDERS] = new Map();
				}

				element[PROVIDERS].set(name, provider);

				return provider;
			}

			Object.defineProperty(this.prototype, name, {
				enumerable: true,
				configurable: false,
				get() {
					return (
						this[PROVIDERS]?.get(name)?.value ?? defineProvider(this).value
					);
				},
				set: isDerviedContext(context)
					? function () {
							// console.warn(`Context provider property [${name}] is derived, thus it's readonly.`);
					  }
					: function (newValue) {
							const provider =
								// @ts-ignore
								this[PROVIDERS]?.get(name) ?? defineProvider(this);
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
				/** @type {import('./types').ContextConsumerDeclaration<any>} */
				const declaration = contextConsumers[contextPropertyName];
				const context =
					'context' in declaration ? declaration.context : declaration;
				const options = 'context' in declaration ? declaration : {};
				this.defineContextConsumer(contextPropertyName, context, options);
			});
		}

		/**
		 * @template {any} T
		 * @param {string} name
		 * @param {import('./types').Context<T>} context
		 * @param {import('./types').ContextConsumeOptions<T>} [options]
		 */
		static defineContextConsumer(name, context, options = {}) {
			// eslint-disable-next-line no-prototype-builtins
			if (this.prototype.hasOwnProperty(name)) return;

			// Might be called by decorator.
			this.finalizeContext();

			function defineConsumer(element) {
				let initialized = false;
				let oldValue =
					options.transform?.(context.initialValue) ?? context.initialValue;

				const consumer = context.consume(element, {
					...options,
					onUpdate: (newValue) => {
						if (!initialized) return;
						element.requestUpdate(name, oldValue);
						oldValue = newValue;
						options.onUpdate?.(newValue);
					}
				});

				if (!element[CONSUMERS]) {
					element[CONSUMERS] = new Map();
				}

				element[CONSUMERS].set(name, consumer);
				initialized = true;

				return consumer;
			}

			Object.defineProperty(this.prototype, name, {
				enumerable: true,
				configurable: false,
				get() {
					return (
						this[CONSUMERS]?.get(name)?.value ?? defineConsumer(this).value
					);
				},
				set() {
					// console.warn(`Context consumer property [${name}] is readonly.`);
				}
			});
		}
	};
}
