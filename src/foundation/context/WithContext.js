import { isFunction } from '../../utils/unit.js';
import { defineContextConsumer, defineContextProvider } from './define.js';

const FINALIZED = Symbol('finalized');

/**
 * @template {import('./types').ContextHostConstructor} T
 * @param {T} Base
 * @returns {import('./types').ContextInitializer & T}
 */
export function WithContext(Base) {
  return class WithContextMixin extends Base {
    /** @type {import('./types').ContextConsumerDeclarations} */
    static get contextConsumers() {
      return {};
    }

    /** @type {import('./types').ContextProviderDeclarations} */
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
      defineContextProvider(/** @type {any} */ (this), name, context, options);
    }

    /**
     * @protected
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
      defineContextConsumer(/** @type {any} */ (this), name, context, options);
    }
  };
}
