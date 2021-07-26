import { isUndefined, noop, notEqual } from '@utils/unit';

import {
  Context,
  ContextConsumeOptions,
  ContextConsumerConnectEventDetail,
  ContextHost,
  ContextProvideOptions,
  ContextProviderRecord,
  ContextRecord,
  ContextTuple,
  ContextTupleValues,
  DerivedContext
} from './types';

class ConsumerConnectEvent extends CustomEvent<ContextConsumerConnectEventDetail> {
  static readonly TYPE = 'vds-context-connect';

  constructor(detail: ContextConsumerConnectEventDetail) {
    super(ConsumerConnectEvent.TYPE, {
      bubbles: true,
      composed: true,
      detail
    });
  }
}

export function createContext<T>(initialValue: T): Context<T> {
  const id = Symbol('Vidstack.contextId');

  function provide(host: ContextHost, options: ContextProvideOptions<T> = {}) {
    if (host[id]) return host[id];

    let currentValue = initialValue;

    const consumers = new Set<ContextConsumerConnectEventDetail>();

    function onConsumerConnect(event: Event) {
      const consumer = (event as ConsumerConnectEvent).detail;

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

    function onUpdate(newValue: T) {
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

  function consume(host: ContextHost, options: ContextConsumeOptions<T> = {}) {
    const transformer = !isUndefined(options.transform)
      ? options.transform
      : (v: T) => v;

    let currentValue = transformer(initialValue);
    let disconnectFromProviderCallback = noop;

    function onConnect() {
      options.onConnect?.();
      options.onUpdate?.(currentValue);
    }

    function onUpdate(newValue: T) {
      const transformedValue = transformer(newValue);
      if (notEqual(transformedValue, currentValue)) {
        currentValue = transformedValue;
        options.onUpdate?.(transformedValue);
      }
    }

    function onDisconnect(callback: () => void) {
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
 * @param contexts - The contexts to derive values from as it updates.
 * @param derivation - Takes the original context values and outputypes the derived value.
 */
export function derivedContext<T extends ContextTuple, R>(
  contexts: T,
  derivation: (values: ContextTupleValues<T>) => R
): DerivedContext<R> {
  const initialValue = derivation(contexts.map((c) => c.initialValue) as any);

  const derivedContext = createContext(initialValue);

  return {
    initialValue,
    consume: derivedContext.consume,
    isDerived: true,
    provide(host) {
      const values: unknown[] = [];
      const derivedProvider = derivedContext.provide(host);

      contexts.forEach((context, i) => {
        context.consume(host, {
          onUpdate(newValue) {
            values[i] = newValue;

            if (values.length === contexts.length) {
              derivedProvider.value = derivation(values as any);
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

export function isDerviedContext<T>(
  context: Context<T> | DerivedContext<T>
): context is DerivedContext<T> {
  return !!(context as DerivedContext<T>).isDerived;
}

/**
 * Takes in a context record which is essentially an object containing 0 or more contexts, and sets
 * the given `host` element as the provider of all the contexts within the given record.
 *
 * @param host
 * @param contextRecord
 */
export function provideContextRecord<T extends ContextRecord<unknown>>(
  host: ContextHost,
  contextRecord: T
): ContextProviderRecord<T> {
  const providers = {} as Partial<ContextProviderRecord<T>>;

  Object.keys(contextRecord).forEach((contextKey) => {
    const context = contextRecord[contextKey] as Context<unknown>;
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

  return providers as ContextProviderRecord<T>;
}
