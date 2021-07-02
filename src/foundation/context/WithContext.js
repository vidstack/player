import { isFunction } from '../../utils/unit.js';
import { isDerviedContext } from './context.js';

const FINALIZED = Symbol('finalized');
const PROVIDERS = Symbol('providers');
const CONSUMERS = Symbol('consumers');

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
      // Might be called by decorator.
      this.finalizeContext();

      /** @type {any} */ (this).addInitializer((element) => {
        if (!element[PROVIDERS]) element[PROVIDERS] = new Map();
        const provider = context.provide(element, options);
        element[PROVIDERS].set(name, provider);
      });

      Object.defineProperty(this.prototype, name, {
        enumerable: true,
        configurable: true,
        get() {
          return this[PROVIDERS].get(name).value;
        },
        set: isDerviedContext(context)
          ? function () {
              // console.warn(`Context provider property [${name}] is derived, thus it's readonly.`);
            }
          : function (newValue) {
              // @ts-ignore
              this[PROVIDERS].get(name).value = newValue;
            }
      });
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
      // Might be called by decorator.
      this.finalizeContext();

      /**
       * @param {import('lit').LitElement} element
       * @returns {import('./types').ContextConsumer<any>}
       */
      function initConsumer(element) {
        let initialized = false;
        let oldValue =
          options.transform?.(context.initialValue) ?? context.initialValue;

        const consumer = context.consume(element, {
          ...options,
          onUpdate: (newValue) => {
            if (!initialized) return;

            // Trigger setters.
            element[name] = newValue;

            if (options.shouldRequestUpdate ?? true) {
              element.requestUpdate(name, oldValue);
              oldValue = newValue;
            }

            options.onUpdate?.(newValue);
          }
        });

        element[CONSUMERS].set(name, consumer);
        initialized = true;

        return consumer;
      }

      /** @type {any} */ (this).addInitializer((element) => {
        if (!element[CONSUMERS]) element[CONSUMERS] = new Map();
        initConsumer(element);
      });

      Object.defineProperty(this.prototype, name, {
        enumerable: true,
        configurable: true,
        get() {
          return this[CONSUMERS].get(name).value;
        },
        set() {
          // console.warn(`Context consumer property [${name}] is readonly.`);
        }
      });
    }
  };
}
