import { isUndefined, noop, notEqual } from '../../utils/unit.js';
/**
 * @augments CustomEvent<import('./types').ContextConsumerDetail>
 */
class ConsumerConnectEvent extends CustomEvent {
  /**
   * @param {import('./types').ContextConsumerDetail} detail
   */
  constructor(detail) {
    super(ConsumerConnectEvent.TYPE, {
      bubbles: true,
      composed: true,
      detail
    });
  }
  /**
   * @param {Event} event
   * @returns {event is ConsumerConnectEvent}
   */
  static validate(event) {
    return event instanceof this;
  }
}
ConsumerConnectEvent.TYPE = 'vds-context-connect';
/**
 * @template T
 * @param {T} initialValue
 * @returns {import('./types').Context<T>}
 */
export function createContext(initialValue) {
  const key = Symbol('CTX_PROVIDER');
  // Privately declared event to safely pair context providers and consumers.
  class ContextConsumerConnectEvent extends ConsumerConnectEvent {}
  /** @type {import('./types').Context<T>['provide']} */
  function provide(host, options = {}) {
    if (host[key]) return host[key];
    let currentValue = initialValue;
    /** @type {Set<import('./types').ContextConsumerDetail>} */
    let consumers = new Set();
    /**
     * @param {Event | ContextConsumerConnectEvent} event
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
    /**
     * @param {T} newValue
     */
    function onUpdate(newValue) {
      var _a;
      currentValue = newValue;
      consumers.forEach((consumer) => {
        consumer.onUpdate(newValue);
      });
      (_a = options.onUpdate) === null || _a === void 0
        ? void 0
        : _a.call(options, newValue);
    }
    host.addController({
      hostConnected() {
        var _a;
        host.addEventListener(ConsumerConnectEvent.TYPE, onConsumerConnect);
        (_a = options.onConnect) === null || _a === void 0
          ? void 0
          : _a.call(options);
      },
      hostDisconnected() {
        var _a;
        host.removeEventListener(ConsumerConnectEvent.TYPE, onConsumerConnect);
        onUpdate(initialValue);
        consumers.clear();
        (_a = options.onDisconnect) === null || _a === void 0
          ? void 0
          : _a.call(options);
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
    host[key] = context;
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
     *
     */
    function onConnect() {
      var _a, _b;
      (_a = options.onConnect) === null || _a === void 0
        ? void 0
        : _a.call(options);
      (_b = options.onUpdate) === null || _b === void 0
        ? void 0
        : _b.call(options, currentValue);
    }
    /**
     * @param {T} newValue
     */
    function onUpdate(newValue) {
      var _a;
      const transformedValue = transformer(newValue);
      if (notEqual(transformedValue, currentValue)) {
        currentValue = transformedValue;
        (_a = options.onUpdate) === null || _a === void 0
          ? void 0
          : _a.call(options, transformedValue);
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
          new ContextConsumerConnectEvent({
            onConnect,
            onUpdate,
            onDisconnect
          })
        );
      },
      hostDisconnected() {
        var _a;
        disconnectFromProviderCallback();
        disconnectFromProviderCallback = noop;
        onUpdate(initialValue);
        (_a = options.onDisconnect) === null || _a === void 0
          ? void 0
          : _a.call(options);
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
