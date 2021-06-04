/** @typedef {import('../../types/context').ContextHostConstructor} ContextHostConstructor */

import { isDerviedContext } from './context';

const FINALIZED = Symbol();

/**
 * @template {ContextHostConstructor} T
 * @param {T} Base
 * @returns {T}
 */
export function WithContext(Base) {
	return class WithContext extends Base {
		/** @return {import('../../types/context').ContextConsumerDeclarations} */
		static get contextConsumers() {
			return {};
		}

		/** @return {import('../../types/context').ContextConsumerDeclarations} */
		static get contextProviders() {
			return {};
		}

		// -------------------------------------------------------------------------------------------
		// Context
		// -------------------------------------------------------------------------------------------

		/**
		 * @protected
		 * @returns {void}
		 */
		static finalize() {
			// eslint-disable-next-line no-prototype-builtins
			if (this.hasOwnProperty(FINALIZED)) return;
			this[FINALIZED] = true;

			/** @type {typeof WithContext} */
			const superCtor = Object.getPrototypeOf(this);
			superCtor.finalize();

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
				/** @type {import('../../types/context').Context<any>} */
				const context = contextProviders[contextPropertyName];

				/** @type {import('../../types/context').ContextProvider<any>} */
				let provider;

				/** @type {any} */ (this).addInitializer((element) => {
					provider = context.provide(element);
				});

				// eslint-disable-next-line no-prototype-builtins
				if (!this.prototype.hasOwnProperty(contextPropertyName)) {
					const hasUserDefined = new WeakSet();

					Object.defineProperty(this.prototype, contextPropertyName, {
						enumerable: true,
						configurable: false,
						get() {
							return provider.value;
						},
						set: isDerviedContext(context)
							? function () {
									if (!hasUserDefined.has(this)) {
										hasUserDefined.add(this);
										return;
									}

									throw Error(
										`Context provider property [${contextPropertyName}] is dervied, thus it's readonly.`
									);
							  }
							: function (newValue) {
									provider.value = newValue;
							  }
					});
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
				/** @type {import('../../types/context').Context<any>} */
				const context = contextConsumers[contextPropertyName];

				/** @type {import('../../types/context').ContextConsumer<any>} */
				let consumer;

				/** @type {any} */ (this).addInitializer((element) => {
					let oldValue = context.initialValue;
					consumer = context.consume(element, {
						onUpdate: (newValue) => {
							element.requestUpdate(contextPropertyName, oldValue);
							oldValue = newValue;
						}
					});
				});

				// eslint-disable-next-line no-prototype-builtins
				if (!this.prototype.hasOwnProperty(contextPropertyName)) {
					const hasUserDefined = new WeakSet();

					Object.defineProperty(this.prototype, contextPropertyName, {
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

							throw Error(
								`Context consumer property [${contextPropertyName}] is readonly.`
							);
						}
					});
				}
			});
		}
	};
}
