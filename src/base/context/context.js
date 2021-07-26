import { isUndefined, noop, notEqual } from '@utils/unit.js';

/**
 * @augments CustomEvent<import('./types').ContextConsumerConnectEventDetail>
 */
class ConsumerConnectEvent extends CustomEvent {
  /** @readonly */
  static TYPE = 'vds-context-connect';

  /**
   * @param {import('./types').ContextConsumerConnectEventDetail} detail
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
 * @returns {import('./types').Context<T>}
 */
export function createContext(initialValue) {
  const id = Symbol('Vidstack.contextId');

  /** @type {import('./types').Context<T>['provide']} */
  function provide(host, options = {}) {
    if (host[id]) return host[id];

    let currentValue = initialValue;

    /** @type {Set<import('./types').ContextConsumerConnectEventDetail>} */
    let consumers = new Set();

    /**
     * @param {Event} event
     */
    function onConsumerConnect(event) {
      const consumer = /** @type {ConsumerConnectEvent} */ (event).detail;

      // Validate event was dispatched by a pairable consumer.
      if (consumer.id !== id) return;

      // Stop propagation of the event to prevent pairing with similar context providers.
      event.stopImmediatePropagation();

      consumer.onConnect();

      consumer.onUpdate(currentValue);

      consumer.onDisconnect(() => {
        consumers.delete(consumer);
      });

      consumers.add(consumer);
    }

    /**
     * @param {T} newValue
     */
    function onUpdate(newValue) {
      currentValue = newValue;
      consumers.forEach((consumer) => {
        consumer.onUpdate(newValue);
      });
      options.onUpdate?.(newValue);
    }

    host.addController({
      hostConnected() {
        host.addEventListener(ConsumerConnectEvent.TYPE, onConsumerConnect);
        options.onConnect?.();
      },
      hostDisconnected() {
        host.removeEventListener(ConsumerConnectEvent.TYPE, onConsumerConnect);
        onUpdate(initialValue);
        consumers.clear();
        options.onDisconnect?.();
      }
    });

    const context = {
      get value() {
        return currentValue;
      },
      set value(newValue) {
        if (notEqual(newValue, currentValue)) {
          onUpdate(newValue);
        }
      },
      reset() {
        onUpdate(initialValue);
      }
    };

    host[id] = context;
    return context;
  }

  /** @type {import('./types').Context<T>['consume']} */
  function consume(host, options = {}) {
    const transformer = !isUndefined(options.transform)
      ? options.transform
      : (v) => v;

    let currentValue = transformer(initialValue);
    let disconnectFromProviderCallback = noop;

    /**
     * @returns {void}
     */
    function onConnect() {
      options.onConnect?.();
      options.onUpdate?.(currentValue);
    }

    /**
     * @param {T} newValue
     */
    function onUpdate(newValue) {
      const transformedValue = transformer(newValue);
      if (notEqual(transformedValue, currentValue)) {
        currentValue = transformedValue;
        options.onUpdate?.(transformedValue);
      }
    }

    /**
     * @param {() => void} callback
     */
    function onDisconnect(callback) {
      disconnectFromProviderCallback = callback;
    }

    host.addController({
      hostConnected() {
        host.dispatchEvent(
          new ConsumerConnectEvent({
            id,
            onConnect,
            onUpdate,
            onDisconnect
          })
        );
      },

      hostDisconnected() {
        disconnectFromProviderCallback();
        disconnectFromProviderCallback = noop;
        onUpdate(initialValue);
        options.onDisconnect?.();
      }
    });

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
 * @template {import('./types').ContextTuple} T
 * @template R
 * @param {T} contexts - The contexts to derive values from as it updates.
 * @param {(values: import('./types').ContextTupleValues<T>) => R} derivation - Takes the original context values and outputypes the derived value.
 * @returns {import('./types').DerivedContext<R>}
 */
export function derivedContext(contexts, derivation) {
  const initialValue = derivation(
    /** @type {any} */ (contexts.map((c) => c.initialValue))
  );

  const derivedContext = createContext(initialValue);

  return {
    initialValue,
    consume: derivedContext.consume,
    isDerived: true,
    provide(host) {
      const values = [];
      const derivedProvider = derivedContext.provide(host);

      contexts.forEach((context, i) => {
        context.consume(host, {
          onUpdate(newValue) {
            values[i] = newValue;

            if (values.length === contexts.length) {
              derivedProvider.value = derivation(/** @type {any} */ (values));
            }
          },

          onDisconnect() {
            values.splice(i, 1);
            if (values.length === 0) derivedProvider.value = initialValue;
          }
        });
      });

      return {
        get value() {
          return derivedProvider.value;
        },
        reset() {
          derivedProvider.value = initialValue;
        }
      };
    }
  };
}

/**
 * @template T
 * @param {import('./types').Context<T> | import('./types').DerivedContext<T>} context
 * @returns {context is import('./types').DerivedContext<T>}
 */
export function isDerviedContext(context) {
  return !!(
    /** @type {import('./types').DerivedContext<any>} */ (context).isDerived
  );
}

/**
 * Takes in a context record which is essentially an object containing 0 or more contexts, and sets
 * the given `host` element as the provider of all the contexts within the given record.
 *
 * @template {import('./types').ContextRecord<unknown>} ContextRecordType
 * @param {import('./types').ContextHost} host
 * @param {ContextRecordType} contextRecord
 * @returns {import('./types').ContextProviderRecord<ContextRecordType>}
 */
export function provideContextRecord(host, contextRecord) {
  /** @type {any} */
  const providers = {};

  Object.keys(contextRecord).forEach((contextKey) => {
    /** @type {import('./types').Context<unknown>} */
    const context = contextRecord[contextKey];
    const provider = context.provide(host);

    Object.defineProperty(providers, contextKey, {
      enumerable: true,
      configurable: false,
      get() {
        return provider.value;
      },
      set: isDerviedContext(context)
        ? undefined
        : (newValue) => {
            provider.value = newValue;
          }
    });
  });

  return providers;
}
